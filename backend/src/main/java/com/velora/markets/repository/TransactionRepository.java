package com.velora.markets.repository;

import com.velora.markets.entity.Transaction;
import com.velora.markets.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByUserOrderByExecutedAtDesc(User user, Pageable pageable);
    long countByUser(User user);
}
