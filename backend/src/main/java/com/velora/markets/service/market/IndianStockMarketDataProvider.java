package com.velora.markets.service.market;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.Exchange;
import com.velora.markets.entity.Stock;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class IndianStockMarketDataProvider implements MarketDataProvider {

    private static final Logger log = LoggerFactory.getLogger(IndianStockMarketDataProvider.class);

    private final String baseUrl;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @org.springframework.beans.factory.annotation.Autowired
    public IndianStockMarketDataProvider(
        @Value("${velora.market.indian-api.base-url:${INDIAN_MARKET_API_BASE_URL:http://127.0.0.1:8787}}") String baseUrl,
        @Value("${velora.market.indian-api.timeout-ms:5000}") int timeoutMs,
        ObjectMapper objectMapper
    ) {
        this.baseUrl = baseUrl != null ? baseUrl.trim().replaceAll("/+$", "") : "http://127.0.0.1:8787";
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofMillis(timeoutMs));
        factory.setReadTimeout(Duration.ofMillis(timeoutMs));

        this.restClient = RestClient.builder()
            .requestFactory(factory)
            .baseUrl(this.baseUrl)
            .build();
    }

    public IndianStockMarketDataProvider(String baseUrl, RestClient restClient, ObjectMapper objectMapper) {
        this.baseUrl = baseUrl != null ? baseUrl.trim().replaceAll("/+$", "") : "http://127.0.0.1:8787";
        this.restClient = restClient;
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "IndianStockMarketAPI";
    }

    @Override
    public boolean isConfigured() {
        return baseUrl != null && !baseUrl.isBlank();
    }

    @Override
    public MarketStockResponse fetchLiveQuote(Stock stock) {
        return null;
    }

    @Override
    public List<HistoricalBarResponse> fetchHistoricalBars(Stock stock, String timeframe) {
        if (!isConfigured() || stock == null) {
            return List.of();
        }

        String tickerSymbol = toTickerSymbol(stock);
        if (tickerSymbol == null) {
            log.debug("Skipping IndianStockMarketAPI for non-Indian or unsupported stock: {}", stock.getSymbol());
            return List.of();
        }

        String effectiveTimeframe = (timeframe != null && !timeframe.isBlank()) ? timeframe.trim().toUpperCase() : "1M";

        try {
            String uri = UriComponentsBuilder.fromPath("/chart")
                .queryParam("symbol", tickerSymbol)
                .queryParam("timeframe", effectiveTimeframe)
                .build(false)
                .toUriString();

            log.debug("Calling IndianStockMarketAPI chart endpoint: {}{}", baseUrl, uri);

            String rawJson = restClient.get()
                .uri(uri)
                .retrieve()
                .body(String.class);

            if (rawJson == null || rawJson.isBlank()) {
                log.warn("IndianStockMarketAPI returned empty response for ticker: {}", tickerSymbol);
                return List.of();
            }

            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode candlesNode = root.get("candles");
            if (candlesNode == null || !candlesNode.isArray() || candlesNode.isEmpty()) {
                log.debug("No candles returned by IndianStockMarketAPI for ticker: {}", tickerSymbol);
                return List.of();
            }

            List<HistoricalBarResponse> bars = new ArrayList<>();
            for (JsonNode candle : candlesNode) {
                String time = candle.hasNonNull("time") ? candle.get("time").asText() : null;
                if (time == null || time.isBlank()) {
                    continue;
                }

                BigDecimal open = candle.hasNonNull("open") ? bd(candle.get("open").asDouble()) : null;
                BigDecimal high = candle.hasNonNull("high") ? bd(candle.get("high").asDouble()) : null;
                BigDecimal low = candle.hasNonNull("low") ? bd(candle.get("low").asDouble()) : null;
                BigDecimal close = candle.hasNonNull("close") ? bd(candle.get("close").asDouble()) : null;
                long volume = candle.hasNonNull("volume") ? candle.get("volume").asLong() : 0L;

                if (open != null && high != null && low != null && close != null) {
                    bars.add(new HistoricalBarResponse(time, open, high, low, close, volume));
                }
            }

            log.info("Successfully fetched {} historical bars from IndianStockMarketAPI for {}", bars.size(), tickerSymbol);
            return bars;
        } catch (Exception e) {
            log.warn("IndianStockMarketAPI failed for symbol {} (timeframe: {}): {}", tickerSymbol, effectiveTimeframe, e.getMessage());
            return List.of();
        }
    }

    public String toTickerSymbol(Stock stock) {
        if (stock == null || stock.getSymbol() == null) {
            return null;
        }
        String symbol = stock.getSymbol().trim().toUpperCase();
        if (symbol.endsWith(".NS") || symbol.endsWith(".BO")) {
            return symbol;
        }
        Exchange exchange = stock.getExchange();
        if (exchange == Exchange.NSE) {
            return symbol + ".NS";
        }
        if (exchange == Exchange.BSE) {
            return symbol + ".BO";
        }
        return null;
    }

    private static BigDecimal bd(double val) {
        return BigDecimal.valueOf(val).setScale(4, RoundingMode.HALF_UP);
    }
}
