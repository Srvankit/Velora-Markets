package com.velora.markets.repository;

import com.velora.markets.entity.TradeOrder;
import com.velora.markets.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<TradeOrder, Long> {
    Page<TradeOrder> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    long countByUser(User user);
}
