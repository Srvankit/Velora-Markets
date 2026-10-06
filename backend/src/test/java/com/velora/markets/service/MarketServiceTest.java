package com.velora.markets.service;

import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.entity.Exchange;
import com.velora.markets.entity.Stock;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.StockRepository;
import com.velora.markets.service.market.IndianStockMarketDataProvider;
import com.velora.markets.service.market.dhan.DhanMarketDataProvider;
import com.velora.markets.service.market.dhan.DhanWebSocketMarketService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MarketServiceTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private MapperService mapper;

    @Mock
    private IndianStockMarketDataProvider indianProvider;

    @Mock
    private DhanMarketDataProvider dhanProvider;

    @Mock
    private DhanWebSocketMarketService streamService;

    private MarketService marketService;

    @BeforeEach
    void setUp() {
        marketService = new MarketService(stockRepository, mapper, indianProvider, dhanProvider, streamService);
    }

    @Test
    void getHistory_returnsIndianProviderBars() {
        Stock stock = new Stock();
        stock.setSymbol("RELIANCE");
        stock.setExchange(Exchange.NSE);

        when(stockRepository.findById("RELIANCE")).thenReturn(Optional.of(stock));
        when(indianProvider.isConfigured()).thenReturn(true);

        HistoricalBarResponse bar = new HistoricalBarResponse("2026-10-06T03:45:00.000Z", BigDecimal.valueOf(1189.7), BigDecimal.valueOf(1191.7), BigDecimal.valueOf(1188.2), BigDecimal.valueOf(1190.4), 251159L);
        when(indianProvider.fetchHistoricalBars(stock, "1D")).thenReturn(List.of(bar));

        List<HistoricalBarResponse> result = marketService.getHistory("RELIANCE", "1D");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTime()).isEqualTo("2026-10-06T03:45:00.000Z");
        verify(indianProvider).fetchHistoricalBars(stock, "1D");
    }

    @Test
    void getHistory_withExplicitExchangeSuffix_resolvesBaseStock() {
        Stock baseStock = new Stock();
        baseStock.setSymbol("RELIANCE");
        baseStock.setExchange(Exchange.NSE);
        baseStock.setPrice(BigDecimal.valueOf(1284.50));
        baseStock.setPreviousClose(BigDecimal.valueOf(1265.00));

        when(stockRepository.findById("RELIANCE.BO")).thenReturn(Optional.empty());
        when(stockRepository.findById("RELIANCE")).thenReturn(Optional.of(baseStock));
        when(indianProvider.isConfigured()).thenReturn(true);

        HistoricalBarResponse bar = new HistoricalBarResponse("2026-09-30T03:45:00.000Z", BigDecimal.valueOf(1184.85), BigDecimal.valueOf(1190.25), BigDecimal.valueOf(1183.55), BigDecimal.valueOf(1189.6), 0L);
        when(indianProvider.fetchHistoricalBars(any(Stock.class), eq("5D"))).thenReturn(List.of(bar));

        List<HistoricalBarResponse> result = marketService.getHistory("RELIANCE.BO", "5D");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTime()).isEqualTo("2026-09-30T03:45:00.000Z");
    }

    @Test
    void getHistory_whenStockNotFound_throwsApiException() {
        when(stockRepository.findById("UNKNOWN")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> marketService.getHistory("UNKNOWN", "1D"))
            .isInstanceOf(ApiException.class)
            .hasMessageContaining("Stock not found");
    }
}
