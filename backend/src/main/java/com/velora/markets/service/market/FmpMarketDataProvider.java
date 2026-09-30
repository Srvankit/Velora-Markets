package com.velora.markets.service.market;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.MarketStatus;
import com.velora.markets.entity.Stock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Component
public class FmpMarketDataProvider implements MarketDataProvider {

    private static final Logger log = LoggerFactory.getLogger(FmpMarketDataProvider.class);

    private final String apiKey;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public FmpMarketDataProvider(
        @Value("${velora.market.fmp.api-key:${FMP_API_KEY:}}") String apiKey,
        ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(4))
            .build();
    }

    @Override
    public String getProviderName() {
        return "FinancialModelingPrep (FMP)";
    }

    @Override
    public boolean isConfigured() {
        return !apiKey.isBlank();
    }

    @Override
    public MarketStockResponse fetchLiveQuote(Stock stock) {
        if (!isConfigured()) {
            return null;
        }

        try {
            String url = "https://financialmodelingprep.com/api/v3/quote/" + stock.getSymbol() + "?apikey=" + apiKey;
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(4))
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
                    quote.setMarketStatus(MarketStatus.LIVE.name());
                    quote.setTimestamp(stock.getUpdatedAt().toString());
                    return quote;
                }
            }
        } catch (Exception e) {
            log.warn("FMP quote fetch for {} failed: {}", stock.getSymbol(), e.getMessage());
        }
        return null;
    }

    @Override
    public List<HistoricalBarResponse> fetchHistoricalBars(Stock stock, String timeframe) {
        if (!isConfigured()) {
            return List.of();
        }

        try {
            String url = "https://financialmodelingprep.com/api/v3/historical-price-full/" + stock.getSymbol() + "?apikey=" + apiKey;
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(5))
                .GET()
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode hist = root.path("historical");
                if (hist.isArray() && !hist.isEmpty()) {
                    List<HistoricalBarResponse> bars = new ArrayList<>();
                    int limit = getBarLimitForTimeframe(timeframe);
                    int count = 0;
                    for (JsonNode item : hist) {
                        if (count++ >= limit) break;
                        bars.add(0, new HistoricalBarResponse(
                            item.path("date").asText(),
                            bd(item.path("open").asDouble()),
                            bd(item.path("high").asDouble()),
                            bd(item.path("low").asDouble()),
                            bd(item.path("close").asDouble()),
                            item.path("volume").asLong()
                        ));
                    }
                    return bars;
                }
            }
        } catch (Exception e) {
            log.warn("FMP historical bars fetch for {} failed: {}", stock.getSymbol(), e.getMessage());
        }
        return List.of();
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
