package com.velora.markets.service.market;

import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.Stock;

import java.util.List;

public interface MarketDataProvider {
    String getProviderName();
    boolean isConfigured();
    MarketStockResponse fetchLiveQuote(Stock stock);
    List<HistoricalBarResponse> fetchHistoricalBars(Stock stock, String timeframe);
}
