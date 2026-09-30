package com.velora.markets.repository;

import com.velora.markets.entity.RewardLedger;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RewardLedgerRepository extends JpaRepository<RewardLedger, Long> {
    List<RewardLedger> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<RewardLedger> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    boolean existsByUserIdAndReferenceId(Long userId, String referenceId);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM RewardLedger r WHERE r.user.id = :userId")
    Long calculateCoinBalance(@Param("userId") Long userId);
}
