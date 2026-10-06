package com.velora.markets.service.market.dhan;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.MarketStreamEvent;
import com.velora.markets.entity.Exchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.nio.ByteBuffer;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class DhanWebSocketMarketService implements WebSocket.Listener {

    private static final Logger log = LoggerFactory.getLogger(DhanWebSocketMarketService.class);
    private static final Set<String> INTERVALS = Set.of("1m", "5m", "15m", "30m", "1h");

    private final String clientId;
    private final String accessToken;
    private final String feedUrl;
    private final ObjectMapper mapper;
    private final DhanInstrumentRegistry registry;
    private final DhanBinaryPacketDecoder decoder;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

    // symbol -> interval -> list of active SSE emitters
    private final Map<String, Map<String, List<SseEmitter>>> clients = new ConcurrentHashMap<>();
    // symbol -> interval -> active forming candle
    private final Map<String, Map<String, ActiveCandle>> activeCandles = new ConcurrentHashMap<>();
    // symbol -> last seen cumulative day volume from Dhan
    private final Map<String, Long> lastSeenCumulativeVolume = new ConcurrentHashMap<>();
    // Set of subscribed security IDs
    private final Set<String> subscribedSecIds = ConcurrentHashMap.newKeySet();
    private final Map<String, String> lastTickHash = new ConcurrentHashMap<>();

    private volatile String websocketState = "DISCONNECTED";
    private volatile String lastTickReceivedAt = null;
    private volatile String lastTickSymbol = null;

    private final Object lock = new Object();
    private volatile WebSocket socket;
    private volatile long lastMessageAt;
    private final AtomicBoolean reconnectScheduled = new AtomicBoolean();

    public DhanWebSocketMarketService(
        @Value("${velora.market.dhan.client-id:${DHAN_CLIENT_ID:}}") String clientId,
        @Value("${velora.market.dhan.access-token:${DHAN_ACCESS_TOKEN:}}") String accessToken,
        @Value("${velora.market.dhan.feed-url:wss://api-feed.dhan.co}") String feedUrl,
        ObjectMapper mapper,
        DhanInstrumentRegistry registry
    ) {
        this.clientId = resolveConfig(clientId, "DHAN_CLIENT_ID", "dhan_client_id", "DHAN_CLIENTID");
        this.accessToken = resolveConfig(accessToken, "DHAN_ACCESS_TOKEN", "dhan_access_token", "DHAN_TOKEN", "dhan_token");
        this.feedUrl = (feedUrl != null && !feedUrl.isBlank()) ? feedUrl : "wss://api-feed.dhan.co";
        this.mapper = mapper;
        this.registry = registry;
        this.decoder = new DhanBinaryPacketDecoder(registry);

        scheduler.scheduleAtFixedRate(this::heartbeat, 20, 20, TimeUnit.SECONDS);
        scheduler.scheduleAtFixedRate(this::cleanup, 45, 45, TimeUnit.SECONDS);
    }

    private static String resolveConfig(String injected, String... envVars) {
        if (injected != null && !injected.trim().isBlank()) {
            return clean(injected);
        }
        for (String var : envVars) {
            String val = System.getenv(var);
            if (val != null && !val.trim().isBlank()) {
                return clean(val);
            }
            val = System.getProperty(var);
            if (val != null && !val.trim().isBlank()) {
                return clean(val);
            }
        }
        return "";
    }

    private static String clean(String raw) {
        if (raw == null) return "";
        return raw.trim().replaceAll("^[\"']+|[\"']+$", "").trim();
    }

    public boolean isConfigured() {
        return !clientId.isBlank() && !accessToken.isBlank();
    }

    public SseEmitter subscribe(String symbol, String interval) {
        String ticker = symbol.trim().toUpperCase(Locale.ROOT);
        String normalizedInterval = normalizeInterval(interval);
        SseEmitter emitter = new SseEmitter(0L);

        // Check if supported Indian instrument
        Optional<DhanInstrument> instOpt = registry.findInstrument(ticker, Exchange.NSE)
            .or(() -> registry.findInstrument(ticker, Exchange.BSE));

        if (instOpt.isEmpty() || !isConfigured()) {
            send(emitter, status(ticker, normalizedInterval, "DATA_UNAVAILABLE"));
            return emitter;
        }

        DhanInstrument inst = instOpt.get();

        synchronized (lock) {
            clients.computeIfAbsent(ticker, k -> new ConcurrentHashMap<>())
                .computeIfAbsent(normalizedInterval, k -> new CopyOnWriteArrayList<>())
                .add(emitter);

            emitter.onCompletion(() -> remove(ticker, normalizedInterval, emitter));
            emitter.onTimeout(() -> remove(ticker, normalizedInterval, emitter));

            send(emitter, status(ticker, normalizedInterval, "CONNECTING"));
            connectIfNeeded();
            subscribeInstrument(inst);
        }

        return emitter;
    }

    private String normalizeInterval(String interval) {
        String val = interval == null ? "1m" : interval.trim().toLowerCase(Locale.ROOT);
        return INTERVALS.contains(val) ? val : "1m";
    }

    private void connectIfNeeded() {
        if (socket != null || reconnectScheduled.get() || !isConfigured()) return;
        reconnectScheduled.set(true);

        try {
            // DhanHQ v2 WebSocket connection URL specification:
            // wss://api-feed.dhan.co?version=2&token={access_token}&clientId={client_id}&authType=2
            StringBuilder urlBuilder = new StringBuilder(feedUrl);
            String separator = feedUrl.contains("?") ? "&" : "?";
            urlBuilder.append(separator)
                .append("version=2")
                .append("&token=").append(java.net.URLEncoder.encode(accessToken, java.nio.charset.StandardCharsets.UTF_8))
                .append("&clientId=").append(java.net.URLEncoder.encode(clientId, java.nio.charset.StandardCharsets.UTF_8))
                .append("&authType=2");

            URI uri = URI.create(urlBuilder.toString());

            httpClient.newWebSocketBuilder()
                .connectTimeout(Duration.ofSeconds(8))
                .header("client-id", clientId)
                .header("access-token", accessToken)
                .buildAsync(uri, this)
                .whenComplete((ws, error) -> {
                    reconnectScheduled.set(false);
                    if (error != null) {
                        log.warn("Dhan WebSocket feed connection failed: {}", error.getMessage());
                        broadcastStatus("PROVIDER_ERROR");
                        scheduleReconnect();
                    } else {
                        socket = ws;
                        lastMessageAt = System.currentTimeMillis();
                        resubscribeActiveInstruments();
                    }
                });
        } catch (Exception e) {
            reconnectScheduled.set(false);
            log.warn("Error initiating Dhan WebSocket: {}", e.getMessage());
            broadcastStatus("PROVIDER_ERROR");
            scheduleReconnect();
        }
    }

    private void sendAuthPacket() {
        // RequestCode 11: Dhan WebSocket Connection & Auth Registration
        Map<String, Object> auth = Map.of(
            "RequestCode", 11,
            "InstrumentCount", 0
        );
        try {
            String json = mapper.writeValueAsString(auth);
            sendSocketText(json);
            log.info("Sent Dhan WebSocket authentication packet.");
        } catch (Exception e) {
            log.warn("Failed to serialize Dhan auth packet: {}", e.getMessage());
        }
    }

    private void subscribeInstrument(DhanInstrument inst) {
        if (inst == null || !inst.isValid()) return;
        String key = inst.exchangeSegment() + ":" + inst.securityId();
        if (subscribedSecIds.add(key) && socket != null) {
            sendSubscriptionPacket(15, inst);
        }
    }

    private void resubscribeActiveInstruments() {
        synchronized (lock) {
            subscribedSecIds.clear();
            clients.keySet().forEach(symbol -> {
                registry.findInstrument(symbol, Exchange.NSE)
                    .or(() -> registry.findInstrument(symbol, Exchange.BSE))
                    .ifPresent(this::subscribeInstrument);
            });
        }
    }

    private void sendSubscriptionPacket(int requestCode, DhanInstrument inst) {
        // RequestCode 15: Subscribe / Instrument Registration
        Map<String, Object> instItem = Map.of(
            "ExchangeSegment", inst.exchangeSegment(),
            "SecurityId", inst.securityId()
        );
        Map<String, Object> payload = Map.of(
            "RequestCode", requestCode,
            "InstrumentCount", 1,
            "InstrumentList", List.of(instItem)
        );
        try {
            String json = mapper.writeValueAsString(payload);
            sendSocketText(json);
            log.debug("Subscribed Dhan instrument {} (SecurityId={})", inst.symbol(), inst.securityId());
        } catch (Exception e) {
            log.warn("Failed to serialize Dhan subscription packet for {}: {}", inst.symbol(), e.getMessage());
        }
    }

    private void sendSocketText(String text) {
        WebSocket ws = socket;
        if (ws != null) {
            try {
                ws.sendText(text, true);
            } catch (Exception e) {
                log.warn("Failed to send WebSocket frame: {}", e.getMessage());
                closeSocket();
            }
        }
    }

    private void remove(String symbol, String interval, SseEmitter emitter) {
        synchronized (lock) {
            Map<String, List<SseEmitter>> byInterval = clients.get(symbol);
            if (byInterval == null) return;
            List<SseEmitter> list = byInterval.get(interval);
            if (list != null) {
                list.remove(emitter);
            }
            if (byInterval.values().stream().allMatch(List::isEmpty)) {
                clients.remove(symbol);
                activeCandles.remove(symbol);
            }
        }
    }

    private void heartbeat() {
        WebSocket ws = socket;
        if (ws == null) {
            if (!clients.isEmpty() && isConfigured()) connectIfNeeded();
            return;
        }
        try {
            ws.sendPing(ByteBuffer.wrap(new byte[]{1}));
        } catch (Exception e) {
            closeSocket();
        }
        if (lastMessageAt > 0 && (System.currentTimeMillis() - lastMessageAt > 90_000)) {
            log.warn("Dhan WebSocket silent for 90s. Reconnecting...");
            closeSocket();
        }
    }

    private void closeSocket() {
        WebSocket ws = socket;
        socket = null;
        subscribedSecIds.clear();
        if (ws != null) {
            try {
                ws.abort();
            } catch (Exception ignored) {}
        }
        if (!clients.isEmpty()) {
            scheduleReconnect();
        }
    }

    private void scheduleReconnect() {
        if (reconnectScheduled.compareAndSet(false, true)) {
            scheduler.schedule(() -> {
                reconnectScheduled.set(false);
                connectIfNeeded();
            }, 5, TimeUnit.SECONDS);
        }
    }

    private void cleanup() {
        synchronized (lock) {
            clients.values().forEach(byInterval -> byInterval.values().forEach(list -> list.removeIf(emitter -> {
                try {
                    emitter.send(SseEmitter.event().comment("keepalive"));
                    return false;
                } catch (Exception e) {
                    return true;
                }
            })));
            clients.entrySet().removeIf(entry -> entry.getValue().values().stream().allMatch(List::isEmpty));
        }
    }

    @Override
    public CompletionStage<?> onBinary(WebSocket webSocket, ByteBuffer data, boolean last) {
        lastMessageAt = System.currentTimeMillis();
        try {
            Optional<MarketTick> tickOpt = decoder.decode(data);
            tickOpt.ifPresent(this::processTick);
        } catch (Exception e) {
            log.debug("Error decoding binary Dhan WebSocket packet: {}", e.getMessage());
        }
        if (webSocket != null) {
            webSocket.request(1);
        }
        return null;
    }

    public Map<String, Object> getStreamDiagnosticInfo() {
        Map<String, Object> streamDiag = new LinkedHashMap<>();
        streamDiag.put("websocketState", websocketState);
        streamDiag.put("subscribedInstrumentCount", subscribedSecIds.size());
        streamDiag.put("lastTickReceivedAt", lastTickReceivedAt != null ? lastTickReceivedAt : "NONE");
        streamDiag.put("lastTickSymbol", lastTickSymbol != null ? lastTickSymbol : "NONE");
        streamDiag.put("activeClients", clients.values().stream().mapToInt(m -> m.values().stream().mapToInt(List::size).sum()).sum());
        return streamDiag;
    }

    private void processTick(MarketTick tick) {
        if (tick == null || tick.symbol() == null || tick.price() == null) return;
        String symbol = tick.symbol().toUpperCase(Locale.ROOT);
        long timestamp = tick.epochMilli();
        BigDecimal price = tick.price();
        long dayVolume = tick.volume();

        this.websocketState = "LIVE";
        this.lastTickReceivedAt = Instant.ofEpochMilli(timestamp).toString();
        this.lastTickSymbol = symbol;

        // Calculate delta volume from Dhan's cumulative day volume
        long deltaVolume = 0L;
        if (dayVolume > 0L) {
            Long prevCumulative = lastSeenCumulativeVolume.get(symbol);
            if (prevCumulative != null && dayVolume >= prevCumulative) {
                deltaVolume = dayVolume - prevCumulative;
            } else {
                // First tick seen in session or reset
                deltaVolume = 0L;
            }
            lastSeenCumulativeVolume.put(symbol, dayVolume);
        }

        String tickHash = timestamp + ":" + price + ":" + dayVolume;
        if (tickHash.equals(lastTickHash.put(symbol, tickHash))) {
            return;
        }

        synchronized (lock) {
            Map<String, ActiveCandle> byInterval = activeCandles.computeIfAbsent(symbol, k -> new ConcurrentHashMap<>());
            for (String interval : INTERVALS) {
                long size = intervalMillis(interval);
                long bucket = (timestamp / size) * size;
                ActiveCandle candle = byInterval.get(interval);
                if (candle == null || candle.bucket != bucket) {
                    candle = new ActiveCandle(bucket, price, deltaVolume);
                } else {
                    candle.update(price, deltaVolume);
                }
                byInterval.put(interval, candle);

                List<SseEmitter> emitters = clients.getOrDefault(symbol, Map.of()).getOrDefault(interval, List.of());
                for (SseEmitter emitter : emitters) {
                    send(emitter, candle.toEvent(symbol, interval, "LIVE"));
                }
            }
        }
    }

    @Override
    public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
        lastMessageAt = System.currentTimeMillis();
        log.debug("Received Dhan WebSocket text frame: {}", data);
        if (webSocket != null) {
            webSocket.request(1);
        }
        return null;
    }

    @Override
    public void onError(WebSocket webSocket, Throwable error) {
        log.warn("Dhan WebSocket error: {}", error.getMessage());
        this.websocketState = "PROVIDER_ERROR";
        broadcastStatus("PROVIDER_ERROR");
        closeSocket();
    }

    @Override
    public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
        log.info("Dhan WebSocket closed (code={}, reason={})", statusCode, reason);
        this.websocketState = statusCode == 401 ? "AUTH_FAILED" : "DISCONNECTED";
        broadcastStatus(statusCode == 401 ? "AUTH_FAILED" : "DATA_UNAVAILABLE");
        closeSocket();
        return null;
    }

    @Override
    public void onOpen(WebSocket webSocket) {
        if (webSocket != null) {
            webSocket.request(1);
        }
        this.websocketState = "CONNECTING";
        log.info("Dhan WebSocket connection established. Waiting for ticks to emit LIVE...");
    }

    private void broadcastStatus(String status) {
        synchronized (lock) {
            clients.forEach((symbol, byInterval) -> byInterval.forEach((interval, emitters) ->
                emitters.forEach(emitter -> send(emitter, status(symbol, interval, status)))));
        }
    }

    private void send(SseEmitter emitter, MarketStreamEvent event) {
        try {
            emitter.send(SseEmitter.event().name("market").data(event));
        } catch (Exception e) {
            emitter.completeWithError(e);
        }
    }

    private MarketStreamEvent status(String symbol, String interval, String status) {
        return new MarketStreamEvent(symbol, interval, status, Instant.now().toString(), null, null, null, null, null, 0);
    }

    private static long intervalMillis(String interval) {
        return switch (interval) {
            case "5m" -> 300_000L;
            case "15m" -> 900_000L;
            case "30m" -> 1_800_000L;
            case "1h" -> 3_600_000L;
            default -> 60_000L;
        };
    }

    private static final class ActiveCandle {
        final long bucket;
        final BigDecimal open;
        BigDecimal high;
        BigDecimal low;
        BigDecimal close;
        long volume;

        ActiveCandle(long bucket, BigDecimal price, long initialVolume) {
            this.bucket = bucket;
            this.open = price;
            this.high = price;
            this.low = price;
            this.close = price;
            this.volume = Math.max(0, initialVolume);
        }

        void update(BigDecimal price, long deltaVolume) {
            this.high = this.high.max(price);
            this.low = this.low.min(price);
            this.close = price;
            this.volume += Math.max(0, deltaVolume);
        }

        MarketStreamEvent toEvent(String symbol, String interval, String status) {
            return new MarketStreamEvent(
                symbol,
                interval,
                status,
                Instant.ofEpochMilli(bucket).toString(),
                close,
                open,
                high,
                low,
                close,
                volume
            );
        }
    }
}
