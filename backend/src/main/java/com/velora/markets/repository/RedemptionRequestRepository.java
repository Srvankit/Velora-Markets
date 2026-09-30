package com.velora.markets.repository;

import com.velora.markets.entity.RedemptionRequest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedemptionRequestRepository extends JpaRepository<RedemptionRequest, Long> {
    List<RedemptionRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
}
