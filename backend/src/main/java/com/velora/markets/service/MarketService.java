package com.velora.markets.service;

import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.Exchange;
import com.velora.markets.entity.Stock;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.StockRepository;
import com.velora.markets.service.market.IndianStockMarketDataProvider;
import com.velora.markets.service.market.dhan.DhanMarketDataProvider;
import com.velora.markets.service.market.dhan.DhanWebSocketMarketService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MarketService {

    private final StockRepository stockRepository;
    private final MapperService mapper;
    private final IndianStockMarketDataProvider indianProvider;
    private final DhanMarketDataProvider dhanProvider;
    private final DhanWebSocketMarketService streamService;

    public MarketService(
        StockRepository stockRepository,
        MapperService mapper,
        IndianStockMarketDataProvider indianProvider,
        DhanMarketDataProvider dhanProvider,
        DhanWebSocketMarketService streamService
    ) {
        this.stockRepository = stockRepository;
        this.mapper = mapper;
        this.indianProvider = indianProvider;
        this.dhanProvider = dhanProvider;
        this.streamService = streamService;
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
        Stock stock = resolveStock(symbol);
        return enrichStockQuote(stock);
    }

    @Transactional(readOnly = true)
    public List<HistoricalBarResponse> getHistory(String symbol, String timeframe) {
        Stock stock = resolveStock(symbol);

        if (indianProvider != null && indianProvider.isConfigured()) {
            List<HistoricalBarResponse> bars = indianProvider.fetchHistoricalBars(stock, timeframe);
            if (bars != null && !bars.isEmpty()) {
                return bars;
            }
        }

        if (dhanProvider != null && dhanProvider.isConfigured()) {
            return dhanProvider.fetchHistoricalBars(stock, timeframe);
        }
        return List.of();
    }

    public java.util.Map<String, Object> getProviderStatus() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("indianStockMarketApiConfigured", indianProvider != null && indianProvider.isConfigured());
        if (dhanProvider != null) {
            status.putAll(dhanProvider.getDiagnosticInfo());
        }
        if (streamService != null) {
            status.putAll(streamService.getStreamDiagnosticInfo());
        }
        return status;
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

    private Stock resolveStock(String rawSymbol) {
        if (rawSymbol == null || rawSymbol.isBlank()) {
            throw new ApiException("Stock symbol is required", HttpStatus.BAD_REQUEST);
        }
        String symbolUpper = rawSymbol.trim().toUpperCase();
        var direct = stockRepository.findById(symbolUpper);
        if (direct.isPresent()) {
            return direct.get();
        }

        if (symbolUpper.endsWith(".BO") || symbolUpper.endsWith(".NS")) {
            String base = symbolUpper.substring(0, symbolUpper.length() - 3);
            var baseStock = stockRepository.findById(base);
            if (baseStock.isPresent()) {
                Stock orig = baseStock.get();
                Stock s = new Stock();
                s.setSymbol(symbolUpper);
                s.setCompanyName(orig.getCompanyName());
                s.setExchange(symbolUpper.endsWith(".BO") ? Exchange.BSE : Exchange.NSE);
                s.setSector(orig.getSector());
                s.setCurrency("INR");
                s.setPrice(orig.getPrice());
                s.setPreviousClose(orig.getPreviousClose());
                s.setOpenPrice(orig.getOpenPrice());
                s.setHighPrice(orig.getHighPrice());
                s.setLowPrice(orig.getLowPrice());
                s.setVolume(orig.getVolume());
                s.setMarketStatus(orig.getMarketStatus());
                return s;
            }
        }

        throw new ApiException("Stock not found: " + rawSymbol, HttpStatus.NOT_FOUND);
    }

    private MarketStockResponse enrichStockQuote(Stock stock) {
        if (dhanProvider != null && dhanProvider.isConfigured()) {
            MarketStockResponse live = dhanProvider.fetchLiveQuote(stock);
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
