package com.velora.markets.service.market;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.Exchange;
import com.velora.markets.entity.MarketStatus;
import com.velora.markets.entity.Stock;
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
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Component
public class FmpMarketDataProvider implements MarketDataProvider {

    private static final Logger log = LoggerFactory.getLogger(FmpMarketDataProvider.class);

    private final String apiKey;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private volatile int lastHttpStatus = 0;
    private volatile String lastProviderMessage = "NO_REQUESTS_YET";

    public FmpMarketDataProvider(
        @Value("${velora.market.fmp.api-key:${FMP_API_KEY:}}") String apiKey,
        ObjectMapper objectMapper
    ) {
        this.apiKey = resolveKey(apiKey);
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(6))
            .build();

        if (isConfigured()) {
            log.info("FMP Market Data Provider initialized successfully (FMP_API_KEY_PRESENT=true, keyLength={}).", this.apiKey.length());
        } else {
            log.warn("FMP Market Data Provider initialized without API key (FMP_API_KEY_PRESENT=false).");
        }
    }

    private static String resolveKey(String injectedKey) {
        if (injectedKey != null && !injectedKey.trim().isBlank()) {
            return clean(injectedKey);
        }
        String[] envVars = {
            "FMP_API_KEY",
            "fmp_api_key",
            "FMP_APIKEY",
            "fmp_apikey",
            "FMP_KEY",
            "fmp_key",
            "VELORA_MARKET_FMP_API_KEY",
            "velora_market_fmp_api_key",
            "FINANCIAL_MODELING_PREP_API_KEY"
        };
        for (String var : envVars) {
            String val = System.getenv(var);
            if (val != null && !val.trim().isBlank()) {
                return clean(val);
            }
        }
        String[] sysProps = {
            "fmp.api.key",
            "FMP_API_KEY",
            "velora.market.fmp.api-key"
        };
        for (String prop : sysProps) {
            String val = System.getProperty(prop);
            if (val != null && !val.trim().isBlank()) {
                return clean(val);
            }
        }
        return clean(resolveKeyFromEnvFile());
    }

    private static String clean(String raw) {
        if (raw == null) return "";
        return raw.trim().replaceAll("^[\"']+|[\"']+$", "").trim();
    }

    private static String resolveKeyFromEnvFile() {
        String[] possiblePaths = {".env", "../.env", "../../.env"};
        for (String p : possiblePaths) {
            try {
                File f = new File(p);
                if (f.exists() && f.isFile()) {
                    List<String> lines = Files.readAllLines(f.toPath());
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (trimmed.startsWith("FMP_API_KEY=") || trimmed.startsWith("VITE_FMP_API_KEY=")) {
                            String[] parts = trimmed.split("=", 2);
                            if (parts.length > 1 && !parts[1].trim().isBlank()) {
                                return parts[1].trim();
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
        return "FinancialModelingPrep (FMP)";
    }

    @Override
    public boolean isConfigured() {
        return !apiKey.isBlank();
    }

    public java.util.Map<String, Object> getDiagnosticInfo() {
        java.util.Map<String, Object> diag = new java.util.LinkedHashMap<>();
        diag.put("provider", getProviderName());
        diag.put("FMP_API_KEY_PRESENT", isConfigured());
        diag.put("keyLength", isConfigured() ? apiKey.length() : 0);
        diag.put("lastHttpStatus", lastHttpStatus);
        diag.put("lastProviderMessage", lastProviderMessage);
        diag.put("timestamp", Instant.now().toString());
        return diag;
    }

    public String resolveFmpSymbol(Stock stock) {
        if (stock == null || stock.getSymbol() == null) return "";
        String sym = stock.getSymbol().trim().toUpperCase();
        if (stock.getExchange() == Exchange.NSE) {
            return sym.endsWith(".NS") ? sym : sym + ".NS";
        }
        if (stock.getExchange() == Exchange.BSE) {
            return sym.endsWith(".BO") ? sym : sym + ".BO";
        }
        return switch (sym) {
            case "SPX" -> "^GSPC";
            case "NDX" -> "^IXIC";
            case "DJI" -> "^DJI";
            case "NIFTY50" -> "^NSEI";
            case "BANKNIFTY" -> "^NSEBANK";
            default -> sym;
        };
    }

    @Override
    public MarketStockResponse fetchLiveQuote(Stock stock) {
        if (!isConfigured() || stock == null) {
            return null;
        }

        String fmpSymbol = resolveFmpSymbol(stock);
        try {
            String url = "https://financialmodelingprep.com/api/v3/quote/" + fmpSymbol + "?apikey=" + apiKey;
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(5))
                .GET()
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.isArray() && !root.isEmpty()) {
                    JsonNode node = root.get(0);
                    MarketStockResponse quote = new MarketStockResponse();
                    quote.setSymbol(stock.getSymbol());
                    quote.setCompanyName(node.hasNonNull("name") ? node.get("name").asText() : stock.getCompanyName());
                    quote.setPrice(bd(node.path("price").asDouble(stock.getPrice().doubleValue())));
                    quote.setPreviousClose(bd(node.path("previousClose").asDouble(stock.getPreviousClose().doubleValue())));
                    quote.setChange(bd(node.path("change").asDouble(0.0)));
                    quote.setChangePercent(bd(node.path("changesPercentage").asDouble(0.0)));
                    quote.setOpen(bd(node.path("open").asDouble(stock.getOpenPrice().doubleValue())));
                    quote.setHigh(bd(node.path("dayHigh").asDouble(stock.getHighPrice().doubleValue())));
                    quote.setLow(bd(node.path("dayLow").asDouble(stock.getLowPrice().doubleValue())));
                    quote.setVolume(node.path("volume").asLong(stock.getVolume()));
                    quote.setExchange(stock.getExchange().name());
                    quote.setSector(stock.getSector());
                    quote.setCurrency(stock.getCurrency());
                    quote.setMarketStatus(determineMarketStatus(stock.getExchange()).name());
                    quote.setTimestamp(Instant.now().toString());
                    return quote;
                }
            } else {
                log.warn("FMP returned HTTP status {} for quote {}", response.statusCode(), fmpSymbol);
            }
        } catch (Exception e) {
            log.warn("FMP quote fetch for {} failed: {}", fmpSymbol, e.getMessage());
        }
        return null;
    }

    @Override
    public List<HistoricalBarResponse> fetchHistoricalBars(Stock stock, String timeframe) {
        if (!isConfigured() || stock == null) {
            return List.of();
        }

        String tf = timeframe != null ? timeframe.toUpperCase() : "1M";

        // 1D: Try 1-minute intraday first, then fallback to 5-minute
        if ("1D".equals(tf)) {
            List<HistoricalBarResponse> bars1m = fetchIntradayBars(stock, "1min", 390);
            if (!bars1m.isEmpty()) {
                return bars1m;
            }
            List<HistoricalBarResponse> bars5m = fetchIntradayBars(stock, "5min", 78);
            if (!bars5m.isEmpty()) {
                return bars5m;
            }
        }

        // 5D: Try 5-minute intraday first, then fallback to 15-minute
        if ("5D".equals(tf)) {
            List<HistoricalBarResponse> bars5m = fetchIntradayBars(stock, "5min", 390);
            if (!bars5m.isEmpty()) {
                return bars5m;
            }
            List<HistoricalBarResponse> bars15m = fetchIntradayBars(stock, "15min", 130);
            if (!bars15m.isEmpty()) {
                return bars15m;
            }
        }

        // Daily historical candles for standard timeframes (and fallback for 1D/5D on free/restricted plans)
        String fmpSymbol = resolveFmpSymbol(stock);
        try {
            String url = "https://financialmodelingprep.com/api/v3/historical-price-full/" + fmpSymbol + "?apikey=" + apiKey;
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(6))
                .GET()
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            this.lastHttpStatus = response.statusCode();
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.has("Error Message")) {
                    this.lastProviderMessage = "FMP_ERROR: " + root.get("Error Message").asText();
                    log.warn("FMP API returned error: {}", this.lastProviderMessage);
                    return List.of();
                }
                JsonNode hist = root.path("historical");
                if (hist.isArray() && !hist.isEmpty()) {
                    List<HistoricalBarResponse> bars = new ArrayList<>();
                    int limit = getBarLimitForTimeframe(tf);
                    int count = 0;
                    for (JsonNode item : hist) {
                        if (count++ >= limit) break;
                        bars.add(new HistoricalBarResponse(
                            item.path("date").asText(),
                            bd(item.path("open").asDouble()),
                            bd(item.path("high").asDouble()),
                            bd(item.path("low").asDouble()),
                            bd(item.path("close").asDouble()),
                            item.path("volume").asLong()
                        ));
                    }
                    // Sort chronologically (oldest to newest)
                    bars.sort(Comparator.comparing(HistoricalBarResponse::getTime));
                    this.lastProviderMessage = "OK: " + bars.size() + " bars received";
                    return bars;
                } else {
                    this.lastProviderMessage = "EMPTY_HISTORICAL_ARRAY";
                }
            } else {
                this.lastProviderMessage = "HTTP_" + response.statusCode();
                log.warn("FMP historical-price-full returned HTTP status {} for {}", response.statusCode(), fmpSymbol);
            }
        } catch (Exception e) {
            this.lastProviderMessage = "EXCEPTION: " + e.getMessage();
            log.warn("FMP historical bars fetch for {} failed: {}", fmpSymbol, e.getMessage());
        }
        return List.of();
    }

    private List<HistoricalBarResponse> fetchIntradayBars(Stock stock, String interval, int limit) {
        String fmpSymbol = resolveFmpSymbol(stock);
        try {
            String url = "https://financialmodelingprep.com/api/v3/historical-chart/" + interval + "/" + fmpSymbol + "?apikey=" + apiKey;
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(5))
                .GET()
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            this.lastHttpStatus = response.statusCode();
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                if (root.has("Error Message")) {
                    this.lastProviderMessage = "FMP_ERROR: " + root.get("Error Message").asText();
                    return List.of();
                }
                if (root.isArray() && !root.isEmpty()) {
                    List<HistoricalBarResponse> bars = new ArrayList<>();
                    int count = 0;
                    for (JsonNode item : root) {
                        if (count++ >= limit) break;
                        bars.add(new HistoricalBarResponse(
                            item.path("date").asText(),
                            bd(item.path("open").asDouble()),
                            bd(item.path("high").asDouble()),
                            bd(item.path("low").asDouble()),
                            bd(item.path("close").asDouble()),
                            item.path("volume").asLong()
                        ));
                    }
                    // Chronological sort: oldest -> newest
                    bars.sort(Comparator.comparing(HistoricalBarResponse::getTime));
                    this.lastProviderMessage = "OK: " + bars.size() + " intraday bars received";
                    return bars;
                }
            } else {
                this.lastProviderMessage = "HTTP_" + response.statusCode();
            }
        } catch (Exception e) {
            log.debug("FMP intraday {} fetch failed for {}: {}", interval, fmpSymbol, e.getMessage());
        }
        return List.of();
    }

    public static MarketStatus determineMarketStatus(Exchange exchange) {
        if (exchange == null) return MarketStatus.MARKET_CLOSED;

        if (exchange == Exchange.NASDAQ || exchange == Exchange.NYSE) {
            ZonedDateTime nyTime = ZonedDateTime.now(ZoneId.of("America/New_York"));
            DayOfWeek day = nyTime.getDayOfWeek();
            if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
                return MarketStatus.MARKET_CLOSED;
            }
            LocalTime time = nyTime.toLocalTime();
            if (time.isAfter(LocalTime.of(9, 30)) && time.isBefore(LocalTime.of(16, 0))) {
                return MarketStatus.LIVE;
            }
            return MarketStatus.MARKET_CLOSED;
        }

        if (exchange == Exchange.NSE || exchange == Exchange.BSE) {
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

        return MarketStatus.MARKET_CLOSED;
    }

    private int getBarLimitForTimeframe(String tf) {
        if (tf == null) return 30;
        return switch (tf.toUpperCase()) {
            case "1D" -> 1;
            case "5D" -> 5;
            case "1M" -> 22;
            case "3M" -> 65;
            case "6M" -> 130;
            case "YTD", "1Y" -> 252;
            case "5Y" -> 1260;
            case "MAX" -> 2500;
            default -> 30;
        };
    }

    private static BigDecimal bd(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP);
    }
}
