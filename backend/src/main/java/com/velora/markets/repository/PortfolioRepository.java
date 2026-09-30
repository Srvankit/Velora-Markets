package com.velora.markets.repository;

import com.velora.markets.entity.Portfolio;
import com.velora.markets.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Optional<Portfolio> findByUser(User user);
    Optional<Portfolio> findByUserId(Long userId);
}
