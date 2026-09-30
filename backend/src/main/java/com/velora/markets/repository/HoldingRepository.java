package com.velora.markets.repository;

import com.velora.markets.entity.Holding;
import com.velora.markets.entity.Portfolio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    List<Holding> findByPortfolio(Portfolio portfolio);
    Optional<Holding> findByPortfolioAndSymbolIgnoreCase(Portfolio portfolio, String symbol);
}
