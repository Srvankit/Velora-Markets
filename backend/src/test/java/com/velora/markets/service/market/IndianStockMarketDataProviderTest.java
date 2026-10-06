package com.velora.markets.service.market;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.entity.Exchange;
import com.velora.markets.entity.Stock;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class IndianStockMarketDataProviderTest {

    private RestClient.Builder restClientBuilder;
    private MockRestServiceServer mockServer;
    private ObjectMapper objectMapper;
    private IndianStockMarketDataProvider provider;

    @BeforeEach
    void setUp() {
        restClientBuilder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(restClientBuilder).build();
        objectMapper = new ObjectMapper();
        RestClient restClient = restClientBuilder.baseUrl("http://127.0.0.1:8787").build();
        provider = new IndianStockMarketDataProvider("http://127.0.0.1:8787", restClient, objectMapper);
    }

    @Test
    void fetchHistoricalBars_successfulNseResponse() {
        Stock stock = new Stock();
        stock.setSymbol("RELIANCE");
        stock.setExchange(Exchange.NSE);

        String jsonResponse = """
            {
              "status": "success",
              "symbol": "RELIANCE",
              "exchange": "NSE",
              "ticker": "RELIANCE.NS",
              "range": "1d",
              "interval": "5m",
              "count": 2,
              "candles": [
                {
                  "time": "2026-10-06T03:45:00.000Z",
                  "open": 1189.7,
                  "high": 1191.7,
                  "low": 1188.2,
                  "close": 1190.4,
                  "volume": 251159
                },
                {
                  "time": "2026-10-06T03:50:00.000Z",
                  "open": 1190.4,
                  "high": 1194.7,
                  "low": 1189.7,
                  "close": 1194.4,
                  "volume": 224140
                }
              ]
            }
            """;

        mockServer.expect(requestTo("http://127.0.0.1:8787/chart?symbol=RELIANCE.NS&timeframe=1D"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        List<HistoricalBarResponse> bars = provider.fetchHistoricalBars(stock, "1D");

        mockServer.verify();
        assertThat(bars).hasSize(2);
        assertThat(bars.get(0).getTime()).isEqualTo("2026-10-06T03:45:00.000Z");
        assertThat(bars.get(0).getOpen()).isEqualByComparingTo(new BigDecimal("1189.7000"));
        assertThat(bars.get(0).getHigh()).isEqualByComparingTo(new BigDecimal("1191.7000"));
        assertThat(bars.get(0).getLow()).isEqualByComparingTo(new BigDecimal("1188.2000"));
        assertThat(bars.get(0).getClose()).isEqualByComparingTo(new BigDecimal("1190.4000"));
        assertThat(bars.get(0).getVolume()).isEqualTo(251159L);

        assertThat(bars.get(1).getTime()).isEqualTo("2026-10-06T03:50:00.000Z");
        assertThat(bars.get(1).getClose()).isEqualByComparingTo(new BigDecimal("1194.4000"));
    }

    @Test
    void fetchHistoricalBars_successfulBseResponse() {
        Stock stock = new Stock();
        stock.setSymbol("RELIANCE.BO");
        stock.setExchange(Exchange.BSE);

        String jsonResponse = """
            {
              "status": "success",
              "symbol": "RELIANCE",
              "exchange": "BSE",
              "ticker": "RELIANCE.BO",
              "range": "5d",
              "interval": "5m",
              "count": 1,
              "candles": [
                {
                  "time": "2026-09-30T03:45:00.000Z",
                  "open": 1184.85,
                  "high": 1190.25,
                  "low": 1183.55,
                  "close": 1189.6,
                  "volume": 0
                }
              ]
            }
            """;

        mockServer.expect(requestTo("http://127.0.0.1:8787/chart?symbol=RELIANCE.BO&timeframe=5D"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        List<HistoricalBarResponse> bars = provider.fetchHistoricalBars(stock, "5D");

        mockServer.verify();
        assertThat(bars).hasSize(1);
        assertThat(bars.get(0).getTime()).isEqualTo("2026-09-30T03:45:00.000Z");
        assertThat(bars.get(0).getOpen()).isEqualByComparingTo(new BigDecimal("1184.8500"));
    }

    @Test
    void fetchHistoricalBars_emptyCandleResponse() {
        Stock stock = new Stock();
        stock.setSymbol("TCS");
        stock.setExchange(Exchange.NSE);

        String jsonResponse = """
            {
              "status": "success",
              "symbol": "TCS",
              "exchange": "NSE",
              "ticker": "TCS.NS",
              "count": 0,
              "candles": []
            }
            """;

        mockServer.expect(requestTo("http://127.0.0.1:8787/chart?symbol=TCS.NS&timeframe=1M"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        List<HistoricalBarResponse> bars = provider.fetchHistoricalBars(stock, "1M");

        mockServer.verify();
        assertThat(bars).isEmpty();
    }

    @Test
    void fetchHistoricalBars_providerHttpFailure() {
        Stock stock = new Stock();
        stock.setSymbol("INFY");
        stock.setExchange(Exchange.NSE);

        mockServer.expect(requestTo("http://127.0.0.1:8787/chart?symbol=INFY.NS&timeframe=1D"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR));

        List<HistoricalBarResponse> bars = provider.fetchHistoricalBars(stock, "1D");

        mockServer.verify();
        assertThat(bars).isEmpty();
    }

    @Test
    void fetchHistoricalBars_unsupportedGlobalStock() {
        Stock stock = new Stock();
        stock.setSymbol("AAPL");
        stock.setExchange(Exchange.NASDAQ);

        // Must not make any outbound call to Yahoo/Indian API for global equities
        List<HistoricalBarResponse> bars = provider.fetchHistoricalBars(stock, "1D");

        assertThat(bars).isEmpty();
    }

    @Test
    void fetchHistoricalBars_timeframeForwarding() {
        Stock stock = new Stock();
        stock.setSymbol("SBIN");
        stock.setExchange(Exchange.NSE);

        String jsonResponse = """
            {
              "status": "success",
              "symbol": "SBIN",
              "exchange": "NSE",
              "ticker": "SBIN.NS",
              "timeframe": "YTD",
              "count": 1,
              "candles": [
                {
                  "time": "2026-01-01T03:45:00.000Z",
                  "open": 800.0,
                  "high": 810.0,
                  "low": 795.0,
                  "close": 805.0,
                  "volume": 1200000
                }
              ]
            }
            """;

        mockServer.expect(requestTo("http://127.0.0.1:8787/chart?symbol=SBIN.NS&timeframe=YTD"))
            .andExpect(method(HttpMethod.GET))
            .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        List<HistoricalBarResponse> bars = provider.fetchHistoricalBars(stock, "YTD");

        mockServer.verify();
        assertThat(bars).hasSize(1);
        assertThat(bars.get(0).getTime()).isEqualTo("2026-01-01T03:45:00.000Z");
    }
}
