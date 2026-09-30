package com.velora.markets.service;

import com.velora.markets.dto.WatchlistItemResponse;
import com.velora.markets.entity.Stock;
import com.velora.markets.entity.User;
import com.velora.markets.entity.WatchlistItem;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.StockRepository;
import com.velora.markets.repository.UserRepository;
import com.velora.markets.repository.WatchlistRepository;
import com.velora.markets.security.SecurityUtils;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;
    private final MapperService mapper;

    public WatchlistService(
        WatchlistRepository watchlistRepository,
        StockRepository stockRepository,
        UserRepository userRepository,
        MapperService mapper
    ) {
        this.watchlistRepository = watchlistRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<WatchlistItemResponse> list() {
        User user = currentUser();
        return watchlistRepository.findByUserOrderByAddedAtDesc(user).stream()
            .map(item -> mapper.toWatchlistItem(item, stockRepository.findById(item.getSymbol()).orElse(null)))
            .toList();
    }

    @Transactional
    public WatchlistItemResponse add(String symbol) {
        String normalized = symbol.trim().toUpperCase();
        User user = currentUser();
        Stock stock = stockRepository.findById(normalized)
            .orElseThrow(() -> new ApiException("Stock not found: " + normalized, HttpStatus.NOT_FOUND));

        if (watchlistRepository.existsByUserAndSymbolIgnoreCase(user, normalized)) {
            throw new ApiException(normalized + " is already in your watchlist", HttpStatus.CONFLICT);
        }

        WatchlistItem item = new WatchlistItem();
        item.setUser(user);
        item.setSymbol(normalized);
        item = watchlistRepository.save(item);
        return mapper.toWatchlistItem(item, stock);
    }

    @Transactional
    public void remove(String symbol) {
        String normalized = symbol.trim().toUpperCase();
        User user = currentUser();
        WatchlistItem item = watchlistRepository.findByUserAndSymbolIgnoreCase(user, normalized)
            .orElseThrow(() -> new ApiException("Watchlist item not found", HttpStatus.NOT_FOUND));
        watchlistRepository.delete(item);
    }

    private User currentUser() {
        Long id = SecurityUtils.currentUser().getId();
        return userRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}
