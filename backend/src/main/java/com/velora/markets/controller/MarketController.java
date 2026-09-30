package com.velora.markets.controller;

import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.service.MarketService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/market")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping("/stocks")
    public List<MarketStockResponse> stocks() {
        return marketService.getAll();
    }

    @GetMapping("/stocks/{symbol}")
    public MarketStockResponse stock(@PathVariable String symbol) {
        return marketService.getBySymbol(symbol);
    }

    @GetMapping("/stocks/{symbol}/history")
    public List<com.velora.markets.dto.HistoricalBarResponse> history(
        @PathVariable String symbol,
        @RequestParam(defaultValue = "1M") String timeframe
    ) {
        return marketService.getHistory(symbol, timeframe);
    }

    @GetMapping("/search")
    public List<MarketStockResponse> search(@RequestParam String query) {
        return marketService.search(query);
    }

    @GetMapping("/gainers")
    public List<MarketStockResponse> gainers() {
        return marketService.gainers();
    }

    @GetMapping("/losers")
    public List<MarketStockResponse> losers() {
        return marketService.losers();
    }

    @GetMapping("/active")
    public List<MarketStockResponse> active() {
        return marketService.active();
    }
}
