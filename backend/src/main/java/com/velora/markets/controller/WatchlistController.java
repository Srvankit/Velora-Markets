package com.velora.markets.controller;

import com.velora.markets.dto.WatchlistItemResponse;
import com.velora.markets.service.WatchlistService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public List<WatchlistItemResponse> list() {
        return watchlistService.list();
    }

    @PostMapping("/{symbol}")
    @ResponseStatus(HttpStatus.CREATED)
    public WatchlistItemResponse add(@PathVariable String symbol) {
        return watchlistService.add(symbol);
    }

    @DeleteMapping("/{symbol}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable String symbol) {
        watchlistService.remove(symbol);
    }
}
