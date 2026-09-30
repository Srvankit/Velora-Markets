package com.velora.markets.repository;

import com.velora.markets.entity.User;
import com.velora.markets.entity.WatchlistItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserOrderByAddedAtDesc(User user);
    Optional<WatchlistItem> findByUserAndSymbolIgnoreCase(User user, String symbol);
    boolean existsByUserAndSymbolIgnoreCase(User user, String symbol);
    void deleteByUserAndSymbolIgnoreCase(User user, String symbol);
}
