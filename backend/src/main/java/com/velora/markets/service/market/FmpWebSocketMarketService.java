package com.velora.markets.service.market;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.MarketStreamEvent;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Component
public class FmpWebSocketMarketService implements WebSocket.Listener {
    private static final Logger log = LoggerFactory.getLogger(FmpWebSocketMarketService.class);
    private static final Set<String> INTERVALS = Set.of("1m", "5m", "15m", "30m", "1h");
    private final String apiKey, endpoint;
    private final ObjectMapper mapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private final Map<String, Map<String, List<SseEmitter>>> clients = new HashMap<>();
    private final Map<String, Map<String, Candle>> candles = new HashMap<>();
    private final Set<String> subscribed = new HashSet<>();
    private final Map<String, String> lastTick = new HashMap<>();
    private final Object lock = new Object();
    private volatile WebSocket socket;
    private volatile long lastMessageAt;
    private final AtomicBoolean reconnectScheduled = new AtomicBoolean();

    public FmpWebSocketMarketService(
        @Value("${velora.market.fmp.api-key:${FMP_API_KEY:}}") String apiKey,
        @Value("${velora.market.fmp.websocket-endpoint:wss://websockets.financialmodelingprep.com/ws}") String endpoint,
        ObjectMapper mapper
    ) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.endpoint = endpoint;
        this.mapper = mapper;
        scheduler.scheduleAtFixedRate(this::heartbeat, 20, 20, TimeUnit.SECONDS);
        scheduler.scheduleAtFixedRate(this::cleanup, 60, 60, TimeUnit.SECONDS);
    }

    public SseEmitter subscribe(String symbol, String interval) {
        String ticker = symbol.trim().toUpperCase(Locale.ROOT);
        String normalized = normalizeInterval(interval);
        SseEmitter emitter = new SseEmitter(0L);
        synchronized (lock) {
            clients.computeIfAbsent(ticker, ignored -> new HashMap<>())
                .computeIfAbsent(normalized, ignored -> new ArrayList<>()).add(emitter);
            emitter.onCompletion(() -> remove(ticker, normalized, emitter));
            emitter.onTimeout(() -> remove(ticker, normalized, emitter));
            send(emitter, status(ticker, normalized, apiKey.isBlank() ? "DATA_UNAVAILABLE" : "CONNECTING"));
            if (!apiKey.isBlank()) {
                connectIfNeeded();
                subscribeProvider(ticker);
            }
        }
        return emitter;
    }

    private String normalizeInterval(String interval) {
        String value = interval == null ? "1m" : interval.trim().toLowerCase(Locale.ROOT);
        return INTERVALS.contains(value) ? value : "1m";
    }

    private void connectIfNeeded() {
        if (socket != null || reconnectScheduled.get()) return;
        reconnectScheduled.set(true);
        httpClient.newWebSocketBuilder().connectTimeout(Duration.ofSeconds(8))
            .buildAsync(URI.create(endpoint + (endpoint.contains("?") ? "&" : "?") + "apikey=" + apiKey), this)
            .whenComplete((ws, error) -> {
                reconnectScheduled.set(false);
                if (error != null) {
                    log.warn("FMP websocket connection failed: {}", error.getMessage());
                    broadcastStatus("DATA_UNAVAILABLE");
                    scheduleReconnect();
                } else {
                    socket = ws;
                    lastMessageAt = System.currentTimeMillis();
                    synchronized (lock) {
                        subscribed.clear();
                        clients.keySet().forEach(this::subscribeProvider);
                    }
                }
            });
    }

    private void subscribeProvider(String symbol) {
        if (subscribed.add(symbol) && socket != null)
            sendProvider("{\"event\":\"subscribe\",\"data\":{\"ticker\":\"" + symbol + "\"}}");
    }
    private void unsubscribeProvider(String symbol) {
        if (subscribed.remove(symbol) && socket != null)
            sendProvider("{\"event\":\"unsubscribe\",\"data\":{\"ticker\":\"" + symbol + "\"}}");
    }
    private void sendProvider(String message) {
        try { socket.sendText(message, true); } catch (RuntimeException ignored) { scheduleReconnect(); }
    }

    private void remove(String symbol, String interval, SseEmitter emitter) {
        synchronized (lock) {
            Map<String, List<SseEmitter>> byInterval = clients.get(symbol);
            if (byInterval == null) return;
            List<SseEmitter> list = byInterval.get(interval);
            if (list != null) list.remove(emitter);
            if (byInterval.values().stream().allMatch(List::isEmpty)) {
                clients.remove(symbol);
                unsubscribeProvider(symbol);
            }
        }
    }

    private void heartbeat() {
        WebSocket ws = socket;
        if (ws == null) { if (!clients.isEmpty() && !apiKey.isBlank()) connectIfNeeded(); return; }
        try { ws.sendPing(java.nio.ByteBuffer.wrap(new byte[] {1})); }
        catch (RuntimeException e) { closeSocket(); }
        if (lastMessageAt > 0 && System.currentTimeMillis() - lastMessageAt > 90_000) closeSocket();
    }
    private void closeSocket() {
        WebSocket ws = socket;
        socket = null;
        subscribed.clear();
        if (ws != null) ws.abort();
        if (!clients.isEmpty()) scheduleReconnect();
    }
    private void scheduleReconnect() {
        if (reconnectScheduled.compareAndSet(false, true))
            scheduler.schedule(() -> { reconnectScheduled.set(false); connectIfNeeded(); }, 5, TimeUnit.SECONDS);
    }
    private void cleanup() {
        synchronized (lock) {
            clients.values().forEach(byInterval -> byInterval.values().forEach(list -> list.removeIf(e -> {
                try { e.send(SseEmitter.event().comment("keepalive")); return false; }
                catch (Exception ex) { return true; }
            })));
            clients.entrySet().removeIf(e -> {
                boolean empty = e.getValue().values().stream().allMatch(List::isEmpty);
                if (empty) unsubscribeProvider(e.getKey());
                return empty;
            });
        }
    }

    private void publish(String symbol, long timestamp, BigDecimal price, long volume) {
        synchronized (lock) {
            String tickId = timestamp + ":" + price + ":" + volume;
            if (tickId.equals(lastTick.put(symbol, tickId))) return;
            Map<String, Candle> byInterval = candles.computeIfAbsent(symbol, ignored -> new HashMap<>());
            for (String interval : INTERVALS) {
                long size = intervalMillis(interval);
                long bucket = timestamp / size * size;
                Candle candle = byInterval.get(interval);
                if (candle == null || candle.bucket != bucket) candle = new Candle(bucket, price, volume);
                else candle.update(price, volume);
                byInterval.put(interval, candle);
                for (SseEmitter emitter : clients.getOrDefault(symbol, Map.of()).getOrDefault(interval, List.of()))
                    send(emitter, candle.event(symbol, interval, "LIVE"));
            }
        }
        log.debug("FMP tick {} price={} timestamp={}", symbol, price, Instant.ofEpochMilli(timestamp));
    }
    private void broadcastStatus(String status) {
        synchronized (lock) {
            clients.forEach((symbol, byInterval) -> byInterval.forEach((interval, emitters) ->
                emitters.forEach(emitter -> send(emitter, status(symbol, interval, status)))));
        }
    }
    private long intervalMillis(String interval) {
        return switch (interval) { case "5m" -> 300_000L; case "15m" -> 900_000L; case "30m" -> 1_800_000L; case "1h" -> 3_600_000L; default -> 60_000L; };
    }
    private void send(SseEmitter emitter, MarketStreamEvent event) {
        try { emitter.send(SseEmitter.event().name("market").data(event)); }
        catch (Exception e) { emitter.completeWithError(e); }
    }
    private MarketStreamEvent status(String symbol, String interval, String status) {
        return new MarketStreamEvent(symbol, interval, status, Instant.now().toString(), null, null, null, null, null, 0);
    }

    @Override public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
        lastMessageAt = System.currentTimeMillis();
        try {
            JsonNode root = mapper.readTree(data.toString());
            if (root.isArray()) {
                root.forEach(node -> parseTick(node));
            } else {
                parseTick(root.has("data") && root.get("data").isObject() ? root.get("data") : root);
            }
        } catch (Exception e) { log.debug("Ignoring malformed FMP websocket message: {}", e.getMessage()); }
        return WebSocket.Listener.super.onText(webSocket, data, last);
    }
    private void parseTick(JsonNode node) {
        try {
            String symbol = text(node, "s", "symbol", "ticker");
            BigDecimal price = decimal(node, "p", "price", "last");
            if (symbol != null && price != null) {
                long time = node.path("t").asLong(node.path("timestamp").asLong(System.currentTimeMillis()));
                if (time < 10_000_000_000L) time *= 1000;
                publish(symbol.toUpperCase(Locale.ROOT), time, price, node.path("v").asLong(node.path("volume").asLong(0)));
            }
        } catch (RuntimeException ignored) { }
    }
    private String text(JsonNode n, String... fields) { for (String f : fields) if (n.hasNonNull(f)) return n.get(f).asText(); return null; }
    private BigDecimal decimal(JsonNode n, String... fields) { String v = text(n, fields); try { return v == null ? null : new BigDecimal(v); } catch (NumberFormatException e) { return null; } }
    @Override public void onError(WebSocket webSocket, Throwable error) { log.warn("FMP websocket error: {}", error.getMessage()); broadcastStatus("DATA_UNAVAILABLE"); closeSocket(); }
    @Override public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) { broadcastStatus("DATA_UNAVAILABLE"); closeSocket(); return WebSocket.Listener.super.onClose(webSocket, statusCode, reason); }
    @Override public void onOpen(WebSocket webSocket) { webSocket.request(1); WebSocket.Listener.super.onOpen(webSocket); }

    private static final class Candle {
        final long bucket; final BigDecimal open; BigDecimal high, low, close; long volume;
        Candle(long bucket, BigDecimal price, long volume) { this.bucket = bucket; this.open = price; this.high = price; this.low = price; this.close = price; this.volume = volume; }
        void update(BigDecimal price, long volume) { high = high.max(price); low = low.min(price); close = price; this.volume += Math.max(0, volume); }
        MarketStreamEvent event(String symbol, String interval, String status) { return new MarketStreamEvent(symbol, interval, status, Instant.ofEpochMilli(bucket).toString(), close, open, high, low, close, volume); }
    }
}
