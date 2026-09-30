package com.velora.markets.repository;

import com.velora.markets.entity.User;
import com.velora.markets.entity.WalletLedger;
import com.velora.markets.entity.WalletLedgerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletLedgerRepository extends JpaRepository<WalletLedger, Long> {
    Page<WalletLedger> findByUserOrderByTimestampDesc(User user, Pageable pageable);
    List<WalletLedger> findByUserOrderByTimestampAsc(User user);
    boolean existsByUserAndType(User user, WalletLedgerType type);
}
