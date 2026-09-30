package com.velora.markets.repository;

import com.velora.markets.entity.BadgeReward;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeRewardRepository extends JpaRepository<BadgeReward, Long> {
    List<BadgeReward> findByUserId(Long userId);
    boolean existsByUserIdAndBadgeCode(Long userId, String badgeCode);
}
