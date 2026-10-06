package com.velora.markets.controller;

import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.service.MarketService;
import com.velora.markets.service.market.dhan.DhanWebSocketMarketService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/market")
public class MarketController {

    private final MarketService marketService;
    private final DhanWebSocketMarketService streamService;

    public MarketController(MarketService marketService, DhanWebSocketMarketService streamService) {
        this.marketService = marketService;
        this.streamService = streamService;
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

    @GetMapping("/status")
    public java.util.Map<String, Object> status() {
        return marketService.getProviderStatus();
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

    @GetMapping(value = "/stream/{symbol}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@PathVariable String symbol, @RequestParam(defaultValue = "1m") String interval) {
        return streamService.subscribe(symbol, interval);
    }
}
