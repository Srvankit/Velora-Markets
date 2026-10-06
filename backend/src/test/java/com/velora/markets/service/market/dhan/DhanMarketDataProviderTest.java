package com.velora.markets.service.market.dhan;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.Exchange;
import com.velora.markets.entity.Stock;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DhanMarketDataProviderTest {

    private DhanMarketDataProvider provider;
    private DhanInstrumentRegistry registry;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        registry = new DhanInstrumentRegistry("https://images.dhan.co/api-data/api-scrip-master.csv");
        provider = new DhanMarketDataProvider("1000000001", "mock_jwt_token_sample", "https://api.dhan.co/v2", objectMapper, registry);
    }

    @Test
    void testProviderConfiguration() {
        assertEquals("DhanHQ", provider.getProviderName());
        assertTrue(provider.isConfigured());
        assertEquals("1000000001", provider.getClientId());
    }

    @Test
    void testUnconfiguredProviderReturnsNullOrEmpty() {
        DhanMarketDataProvider unconfigured = new DhanMarketDataProvider("", "", "https://api.dhan.co/v2", objectMapper, registry);
        assertFalse(unconfigured.isConfigured());

        Stock stock = new Stock();
        stock.setSymbol("RELIANCE");
        stock.setExchange(Exchange.NSE);

        assertNull(unconfigured.fetchLiveQuote(stock));
        assertTrue(unconfigured.fetchHistoricalBars(stock, "1D").isEmpty());
    }

    @Test
    void testNonIndianEquitiesReturnNull() {
        Stock usStock = new Stock();
        usStock.setSymbol("AAPL");
        usStock.setExchange(Exchange.NASDAQ);

        assertNull(provider.fetchLiveQuote(usStock));
        assertTrue(provider.fetchHistoricalBars(usStock, "1D").isEmpty());
    }

    @Test
    void testDiagnosticInfoContainsExpectedFields() {
        var diag = provider.getDiagnosticInfo();
        assertEquals("DhanHQ", diag.get("provider"));
        assertEquals(true, diag.get("credentialsConfigured"));
        assertFalse(diag.containsKey("clientId"));
        assertFalse(diag.containsKey("accessToken"));
        assertTrue((int) diag.get("registeredScripCount") > 0);
    }
}
