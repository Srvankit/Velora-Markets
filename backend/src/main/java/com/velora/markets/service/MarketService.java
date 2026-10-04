package com.velora.markets.service;

import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.Stock;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.StockRepository;
import com.velora.markets.service.market.FmpMarketDataProvider;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MarketService {

    private final StockRepository stockRepository;
    private final MapperService mapper;
    private final FmpMarketDataProvider fmpProvider;

    public MarketService(
        StockRepository stockRepository,
        MapperService mapper,
        FmpMarketDataProvider fmpProvider
    ) {
        this.stockRepository = stockRepository;
        this.mapper = mapper;
        this.fmpProvider = fmpProvider;
    }

    @Transactional(readOnly = true)
    public List<MarketStockResponse> getAll() {
        return stockRepository.findAll().stream()
            .sorted(Comparator.comparing(Stock::getSymbol))
            .map(this::enrichStockQuote)
            .toList();
    }

    @Transactional(readOnly = true)
    public MarketStockResponse getBySymbol(String symbol) {
        Stock stock = stockRepository.findById(symbol.trim().toUpperCase())
            .orElseThrow(() -> new ApiException("Stock not found: " + symbol, HttpStatus.NOT_FOUND));
        return enrichStockQuote(stock);
    }

    @Transactional(readOnly = true)
    public List<HistoricalBarResponse> getHistory(String symbol, String timeframe) {
        Stock stock = stockRepository.findById(symbol.trim().toUpperCase())
            .orElseThrow(() -> new ApiException("Stock not found: " + symbol, HttpStatus.NOT_FOUND));

        if (fmpProvider.isConfigured()) {
            return fmpProvider.fetchHistoricalBars(stock, timeframe);
        }
        return List.of();
    }

    @Transactional(readOnly = true)
    public List<MarketStockResponse> search(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return stockRepository.search(query.trim()).stream()
            .map(this::enrichStockQuote)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<MarketStockResponse> gainers() {
        return rankedByChange(false).stream().limit(10).toList();
    }

    @Transactional(readOnly = true)
    public List<MarketStockResponse> losers() {
        return rankedByChange(true).stream().limit(10).toList();
    }

    @Transactional(readOnly = true)
    public List<MarketStockResponse> active() {
        return stockRepository.findAll().stream()
            .sorted(Comparator.comparingLong(Stock::getVolume).reversed())
            .limit(10)
            .map(this::enrichStockQuote)
            .toList();
    }

    private MarketStockResponse enrichStockQuote(Stock stock) {
        if (fmpProvider.isConfigured()) {
            MarketStockResponse live = fmpProvider.fetchLiveQuote(stock);
            if (live != null) {
                return live;
            }
        }
        return mapper.toMarketStock(stock);
    }

    private List<MarketStockResponse> rankedByChange(boolean ascending) {
        Comparator<Stock> byPct = Comparator.comparing(this::changePercent);
        if (!ascending) {
            byPct = byPct.reversed();
        }
        return stockRepository.findAll().stream()
            .sorted(byPct)
            .map(this::enrichStockQuote)
            .toList();
    }

    private BigDecimal changePercent(Stock stock) {
        if (stock == null || stock.getPrice() == null || stock.getPreviousClose() == null) {
            return BigDecimal.ZERO;
        }
        if (stock.getPreviousClose().compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return stock.getPrice().subtract(stock.getPreviousClose())
            .multiply(BigDecimal.valueOf(100))
            .divide(stock.getPreviousClose(), 6, RoundingMode.HALF_UP);
    }
}

