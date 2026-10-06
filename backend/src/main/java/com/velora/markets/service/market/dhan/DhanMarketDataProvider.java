package com.velora.markets.service.market.dhan;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.Exchange;
import com.velora.markets.entity.MarketStatus;
import com.velora.markets.entity.Stock;
import com.velora.markets.service.market.MarketDataProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class DhanMarketDataProvider implements MarketDataProvider {

    private static final Logger log = LoggerFactory.getLogger(DhanMarketDataProvider.class);

    private final String clientId;
    private final String accessToken;
    private final String baseUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final DhanInstrumentRegistry registry;

    private volatile int lastHttpStatus = 0;
    private volatile String lastProviderMessage = "NO_REQUESTS_YET";

    public DhanMarketDataProvider(
        @Value("${velora.market.dhan.client-id:${DHAN_CLIENT_ID:}}") String clientId,
        @Value("${velora.market.dhan.access-token:${DHAN_ACCESS_TOKEN:}}") String accessToken,
        @Value("${velora.market.dhan.base-url:https://api.dhan.co/v2}") String baseUrl,
        ObjectMapper objectMapper,
        DhanInstrumentRegistry registry
    ) {
        this.clientId = resolveConfig(clientId, "DHAN_CLIENT_ID", "dhan_client_id", "DHAN_CLIENTID");
        this.accessToken = resolveConfig(accessToken, "DHAN_ACCESS_TOKEN", "dhan_access_token", "DHAN_TOKEN", "dhan_token");
        this.baseUrl = (baseUrl != null && !baseUrl.isBlank()) ? baseUrl.replaceAll("/+$", "") : "https://api.dhan.co/v2";
        this.objectMapper = objectMapper;
        this.registry = registry;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(6))
            .build();

        if (isConfigured()) {
            log.info("DhanHQ Market Data Provider initialized successfully (clientId={}, tokenLength={}).",
                this.clientId, this.accessToken.length());
        } else {
            log.warn("DhanHQ Market Data Provider initialized without credentials (DHAN_CLIENT_ID or DHAN_ACCESS_TOKEN missing).");
        }
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
        return clean(resolveFromEnvFile(envVars));
    }

    private static String clean(String raw) {
        if (raw == null) return "";
        return raw.trim().replaceAll("^[\"']+|[\"']+$", "").trim();
    }

    private static String resolveFromEnvFile(String... keys) {
        String[] possiblePaths = {".env", "../.env", "../../.env"};
        for (String p : possiblePaths) {
            try {
                File f = new File(p);
                if (f.exists() && f.isFile()) {
                    List<String> lines = Files.readAllLines(f.toPath());
                    for (String line : lines) {
                        String trimmed = line.trim();
                        for (String key : keys) {
                            if (trimmed.startsWith(key + "=")) {
                                String[] parts = trimmed.split("=", 2);
                                if (parts.length > 1 && !parts[1].trim().isBlank()) {
                                    return parts[1].trim();
                                }
                            }
                        }
                    }
                }
            } catch (Exception ignored) {
            }
        }
        return "";
    }

    @Override
    public String getProviderName() {
        return "DhanHQ";
    }

    @Override
    public boolean isConfigured() {
        return !clientId.isBlank() && !accessToken.isBlank();
    }

    public String getClientId() {
        return clientId;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public Map<String, Object> getDiagnosticInfo() {
        Map<String, Object> diag = new LinkedHashMap<>();
        diag.put("provider", getProviderName());
        diag.put("credentialsConfigured", isConfigured());
        diag.put("registeredScripCount", registry.getRegisteredCount());
        diag.put("lastHttpStatus", lastHttpStatus);
        diag.put("lastProviderMessage", lastProviderMessage);
        diag.put("timestamp", Instant.now().toString());
        return diag;
    }

    @Override
    public MarketStockResponse fetchLiveQuote(Stock stock) {
        if (!isConfigured() || stock == null) {
            return null;
        }
        if (stock.getExchange() != Exchange.NSE && stock.getExchange() != Exchange.BSE) {
            return null; // Honest DATA_UNAVAILABLE for non-Indian equities
        }

        Optional<DhanInstrument> instOpt = registry.findInstrument(stock.getSymbol(), stock.getExchange());
        if (instOpt.isEmpty()) {
            return null;
        }

        DhanInstrument inst = instOpt.get();
        String segment = inst.exchangeSegment();
        int secId;
        try {
            secId = Integer.parseInt(inst.securityId());
        } catch (NumberFormatException e) {
            return null;
        }

        try {
            String url = baseUrl + "/marketfeed/quote";
            Map<String, List<Integer>> payload = Map.of(segment, List.of(secId));
            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("client-id", clientId)
                .header("access-token", accessToken)
                .timeout(Duration.ofSeconds(5))
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            this.lastHttpStatus = response.statusCode();

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode dataNode = root.path("data").path(segment).path(String.valueOf(secId));
                if (dataNode.isMissingNode() && root.has(segment)) {
                    dataNode = root.path(segment).path(String.valueOf(secId));
                }

                if (!dataNode.isMissingNode()) {
                    double lastPrice = dataNode.path("last_price").asDouble(stock.getPrice().doubleValue());
                    JsonNode ohlc = dataNode.path("ohlc");
                    double close = ohlc.path("close").asDouble(stock.getPreviousClose().doubleValue());
                    double open = ohlc.path("open").asDouble(stock.getOpenPrice().doubleValue());
                    double high = ohlc.path("high").asDouble(stock.getHighPrice().doubleValue());
                    double low = ohlc.path("low").asDouble(stock.getLowPrice().doubleValue());
                    double change = dataNode.path("net_change").asDouble(lastPrice - close);
                    double changePct = close != 0 ? ((lastPrice - close) / close) * 100.0 : 0.0;
                    long volume = dataNode.path("volume").asLong(stock.getVolume());

                    MarketStockResponse quote = new MarketStockResponse();
                    quote.setSymbol(stock.getSymbol());
                    quote.setCompanyName(stock.getCompanyName());
                    quote.setPrice(bd(lastPrice));
                    quote.setPreviousClose(bd(close));
                    quote.setOpen(bd(open));
                    quote.setHigh(bd(high));
                    quote.setLow(bd(low));
                    quote.setChange(bd(change));
                    quote.setChangePercent(bd(changePct));
                    quote.setVolume(volume);
                    quote.setExchange(stock.getExchange().name());
                    quote.setSector(stock.getSector());
                    quote.setCurrency("INR");
                    quote.setMarketStatus(determineIndianMarketStatus().name());
                    quote.setTimestamp(Instant.now().toString());
                    this.lastProviderMessage = "OK: Quote received for " + stock.getSymbol();
                    return quote;
                }
            } else if (response.statusCode() == 401 || response.statusCode() == 403) {
                this.lastProviderMessage = "AUTH_FAILED: Dhan returned HTTP " + response.statusCode();
                log.warn("Dhan authentication failed with HTTP status {}", response.statusCode());
            } else {
                this.lastProviderMessage = "HTTP_" + response.statusCode();
                log.warn("Dhan quote API returned status {} for {}", response.statusCode(), stock.getSymbol());
            }
        } catch (Exception e) {
            this.lastProviderMessage = "EXCEPTION: " + e.getMessage();
            log.warn("Dhan quote fetch for {} failed: {}", stock.getSymbol(), e.getMessage());
        }
        return null;
    }

    @Override
    public List<HistoricalBarResponse> fetchHistoricalBars(Stock stock, String timeframe) {
        if (!isConfigured() || stock == null) {
            return List.of();
        }
        if (stock.getExchange() != Exchange.NSE && stock.getExchange() != Exchange.BSE) {
            return List.of(); // Non-Indian symbol -> DATA_UNAVAILABLE
        }

        Optional<DhanInstrument> instOpt = registry.findInstrument(stock.getSymbol(), stock.getExchange());
        if (instOpt.isEmpty()) {
            return List.of();
        }

        DhanInstrument inst = instOpt.get();
        String tf = timeframe != null ? timeframe.toUpperCase(Locale.ROOT) : "1M";

        if ("1D".equals(tf)) {
            List<HistoricalBarResponse> bars1m = fetchIntradayBars(inst, "1", 1);
            if (!bars1m.isEmpty()) return bars1m;
            return fetchIntradayBars(inst, "5", 1);
        }

        if ("5D".equals(tf)) {
            List<HistoricalBarResponse> bars5m = fetchIntradayBars(inst, "5", 5);
            if (!bars5m.isEmpty()) return bars5m;
            return fetchIntradayBars(inst, "15", 5);
        }

        // Daily historical bars for multi-day ranges (1M, 3M, 6M, YTD, 1Y, 5Y, MAX)
        return fetchDailyHistoricalBars(inst, tf);
    }

    private List<HistoricalBarResponse> fetchIntradayBars(DhanInstrument inst, String interval, int daysBack) {
        try {
            String url = baseUrl + "/charts/intraday";
            ZonedDateTime istNow = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
            ZonedDateTime istFrom = istNow.minusDays(Math.max(daysBack, 1)).withHour(9).withMinute(15).withSecond(0);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("securityId", inst.securityId());
            payload.put("exchangeSegment", inst.exchangeSegment());
            payload.put("instrument", inst.instrumentType());
            payload.put("interval", interval);
            payload.put("fromDate", istFrom.format(formatter));
            payload.put("toDate", istNow.format(formatter));

            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("client-id", clientId)
                .header("access-token", accessToken)
                .timeout(Duration.ofSeconds(6))
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            this.lastHttpStatus = response.statusCode();

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                return parseDhanBarArrays(root);
            } else {
                this.lastProviderMessage = "INTRADAY_HTTP_" + response.statusCode();
            }
        } catch (Exception e) {
            log.warn("Dhan intraday bars fetch for {} failed: {}", inst.symbol(), e.getMessage());
        }
        return List.of();
    }

    private List<HistoricalBarResponse> fetchDailyHistoricalBars(DhanInstrument inst, String tf) {
        try {
            String url = baseUrl + "/charts/historical";
            LocalDate toDate = LocalDate.now(ZoneId.of("Asia/Kolkata"));
            LocalDate fromDate = calculateFromDate(toDate, tf);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("securityId", inst.securityId());
            payload.put("exchangeSegment", inst.exchangeSegment());
            payload.put("instrument", inst.instrumentType());
            payload.put("fromDate", fromDate.format(formatter));
            payload.put("toDate", toDate.format(formatter));

            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("client-id", clientId)
                .header("access-token", accessToken)
                .timeout(Duration.ofSeconds(6))
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            this.lastHttpStatus = response.statusCode();

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                return parseDhanBarArrays(root);
            } else {
                this.lastProviderMessage = "HISTORICAL_HTTP_" + response.statusCode();
            }
        } catch (Exception e) {
            log.warn("Dhan historical bars fetch for {} failed: {}", inst.symbol(), e.getMessage());
        }
        return List.of();
    }

    private List<HistoricalBarResponse> parseDhanBarArrays(JsonNode root) {
        if (root == null || !root.has("start_Time") || !root.get("start_Time").isArray()) {
            return List.of();
        }

        JsonNode times = root.get("start_Time");
        JsonNode opens = root.path("open");
        JsonNode highs = root.path("high");
        JsonNode lows = root.path("low");
        JsonNode closes = root.path("close");
        JsonNode volumes = root.path("volume");

        int size = times.size();
        if (size == 0) return List.of();

        List<HistoricalBarResponse> bars = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            long epoch = times.get(i).asLong();
            if (epoch < 10_000_000_000L) {
                epoch *= 1000;
            }
            String timeStr = Instant.ofEpochMilli(epoch).toString();
            double open = (opens.isArray() && opens.size() > i) ? opens.get(i).asDouble() : 0.0;
            double high = (highs.isArray() && highs.size() > i) ? highs.get(i).asDouble() : open;
            double low = (lows.isArray() && lows.size() > i) ? lows.get(i).asDouble() : open;
            double close = (closes.isArray() && closes.size() > i) ? closes.get(i).asDouble() : open;
            long volume = (volumes.isArray() && volumes.size() > i) ? volumes.get(i).asLong() : 0L;

            bars.add(new HistoricalBarResponse(
                timeStr,
                bd(open),
                bd(high),
                bd(low),
                bd(close),
                volume
            ));
        }

        bars.sort(Comparator.comparing(HistoricalBarResponse::getTime));
        return bars;
    }

    private static LocalDate calculateFromDate(LocalDate toDate, String tf) {
        return switch (tf.toUpperCase(Locale.ROOT)) {
            case "1M" -> toDate.minusMonths(1);
            case "3M" -> toDate.minusMonths(3);
            case "6M" -> toDate.minusMonths(6);
            case "YTD" -> LocalDate.of(toDate.getYear(), 1, 1);
            case "1Y" -> toDate.minusYears(1);
            case "5Y" -> toDate.minusYears(5);
            case "MAX" -> LocalDate.of(2018, 1, 1);
            default -> toDate.minusMonths(1);
        };
    }

    public static MarketStatus determineIndianMarketStatus() {
        ZonedDateTime istTime = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        DayOfWeek day = istTime.getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return MarketStatus.MARKET_CLOSED;
        }
        LocalTime time = istTime.toLocalTime();
        if (time.isAfter(LocalTime.of(9, 15)) && time.isBefore(LocalTime.of(15, 30))) {
            return MarketStatus.LIVE;
        }
        return MarketStatus.MARKET_CLOSED;
    }

    private static BigDecimal bd(double val) {
        if (Double.isNaN(val) || Double.isInfinite(val)) return BigDecimal.ZERO;
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP);
    }
}
