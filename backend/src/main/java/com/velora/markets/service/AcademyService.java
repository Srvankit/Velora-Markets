package com.velora.markets.service;

import com.velora.markets.dto.*;
import com.velora.markets.entity.*;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.*;
import com.velora.markets.security.SecurityUtils;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AcademyService {

    private final UserRepository userRepository;
    private final UserLessonProgressRepository progressRepository;
    private final RewardLedgerRepository rewardRepository;
    private final BadgeRewardRepository badgeRepository;
    private final RedemptionRequestRepository redemptionRepository;

    public AcademyService(
        UserRepository userRepository,
        UserLessonProgressRepository progressRepository,
        RewardLedgerRepository rewardRepository,
        BadgeRewardRepository badgeRepository,
        RedemptionRequestRepository redemptionRepository
    ) {
        this.userRepository = userRepository;
        this.progressRepository = progressRepository;
        this.rewardRepository = rewardRepository;
        this.badgeRepository = badgeRepository;
        this.redemptionRepository = redemptionRepository;
    }

    @Transactional
    public AcademyOverviewResponse getOverview() {
        User user = currentUser();
        ensureWelcomeBonus(user);

        Long balance = rewardRepository.calculateCoinBalance(user.getId());
        List<UserLessonProgress> progresses = progressRepository.findByUserId(user.getId());
        List<BadgeReward> badges = badgeRepository.findByUserId(user.getId());
        List<RedemptionRequest> redemptions = redemptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        AcademyOverviewResponse response = new AcademyOverviewResponse();
        response.setCoinsBalance(balance != null ? balance : 0L);
        response.setTotalLessonsCompleted(progresses.stream().filter(UserLessonProgress::isCompleted).count());
        response.setCompletedLessonIds(progresses.stream().filter(UserLessonProgress::isCompleted).map(UserLessonProgress::getLessonId).toList());

        Map<String, Integer> scoreMap = new HashMap<>();
        for (UserLessonProgress p : progresses) {
            if (p.getQuizScore() != null) {
                scoreMap.put(p.getLessonId(), p.getQuizScore());
            }
        }
        response.setQuizScores(scoreMap);

        response.setBadges(badges.stream().map(b -> new BadgeResponse(
            b.getBadgeCode(),
            b.getBadgeName(),
            b.getDescription(),
            b.getIcon(),
            b.getUnlockedAt().toString()
        )).toList());

        response.setRecentRedemptions(redemptions.stream().limit(10).map(this::toRedemptionResponse).toList());

        return response;
    }

    @Transactional
    public AcademyOverviewResponse completeLesson(CompleteLessonRequest request) {
        User user = currentUser();
        ensureWelcomeBonus(user);

        UserLessonProgress progress = progressRepository.findByUserIdAndLessonId(user.getId(), request.getLessonId())
            .orElseGet(() -> new UserLessonProgress(user, request.getLessonId(), request.getCourseId()));

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(Instant.now());
            progress.setAttempts(progress.getAttempts() + 1);
            progressRepository.save(progress);

            // Award 50 coins if not already awarded
            String refId = "LESSON_" + request.getLessonId();
            if (!rewardRepository.existsByUserIdAndReferenceId(user.getId(), refId)) {
                creditCoins(user, 50L, RewardType.LESSON_COMPLETION, "Completed lesson: " + request.getLessonId(), refId);
            }

            // Check badges
            unlockBadgeIfAbsent(user, "FIRST_LESSON", "First Step", "Completed your first Academy lesson", "GraduationCap");

            long completedCount = progressRepository.countByUserIdAndCompletedTrue(user.getId());
            if (completedCount >= 5) {
                unlockBadgeIfAbsent(user, "SCHOLAR_5", "Curious Scholar", "Completed 5 Academy lessons", "BookOpen");
            }
            if (completedCount >= 10) {
                unlockBadgeIfAbsent(user, "SCHOLAR_10", "Dedicated Student", "Completed 10 Academy lessons", "Award");
            }
            if (completedCount >= 20) {
                unlockBadgeIfAbsent(user, "ACADEMY_MASTER", "Market Maestro", "Mastered the complete Academy curriculum", "Crown");
            }
        }

        return getOverview();
    }

    @Transactional
    public QuizResultResponse submitQuiz(SubmitQuizRequest request) {
        User user = currentUser();
        ensureWelcomeBonus(user);

        UserLessonProgress progress = progressRepository.findByUserIdAndLessonId(user.getId(), request.getQuizId())
            .orElseGet(() -> new UserLessonProgress(user, request.getQuizId(), request.getCourseId()));

        progress.setQuizScore(request.getScore());
        progress.setQuizPassed(request.isPassed());
        progress.setAttempts(progress.getAttempts() + 1);
        if (request.isPassed()) {
            progress.setCompleted(true);
            if (progress.getCompletedAt() == null) {
                progress.setCompletedAt(Instant.now());
            }
        }
        progressRepository.save(progress);

        long awarded = 0;
        List<BadgeResponse> newBadges = new ArrayList<>();

        if (request.isPassed()) {
            String refId = "QUIZ_" + request.getQuizId();
            if (!rewardRepository.existsByUserIdAndReferenceId(user.getId(), refId)) {
                awarded = 100L;
                creditCoins(user, awarded, RewardType.QUIZ_PASS, "Passed quiz with " + request.getScore() + "%: " + request.getQuizId(), refId);
            }

            BadgeReward b1 = unlockBadgeIfAbsent(user, "FIRST_QUIZ", "Quiz Initiate", "Passed your first knowledge check", "CheckCircle2");
            if (b1 != null) newBadges.add(toBadgeResponse(b1));

            if (request.getScore() == 100) {
                BadgeReward b2 = unlockBadgeIfAbsent(user, "PERFECT_SCORE", "Flawless Analysis", "Scored 100% on a module quiz", "Sparkles");
                if (b2 != null) newBadges.add(toBadgeResponse(b2));
            }
        }

        Long totalCoins = rewardRepository.calculateCoinBalance(user.getId());
        return new QuizResultResponse(
            request.getQuizId(),
            request.getScore(),
            request.isPassed(),
            awarded,
            totalCoins != null ? totalCoins : 0L,
            newBadges
        );
    }

    @Transactional
    public RedemptionResponse redeemCoins(RedeemCoinsRequest request) {
        User user = currentUser();
        ensureWelcomeBonus(user);

        Long balance = rewardRepository.calculateCoinBalance(user.getId());
        long currentCoins = balance != null ? balance : 0L;

        if (request.getCoins() == null || request.getCoins() < 10) {
            throw new ApiException("Minimum redemption is 10 coins", HttpStatus.BAD_REQUEST);
        }

        if (currentCoins < request.getCoins()) {
            throw new ApiException("Insufficient coin balance. You have " + currentCoins + " coins.", HttpStatus.BAD_REQUEST);
        }

        String currency = user.getCurrency() != null ? user.getCurrency().toUpperCase() : "INR";
        BigDecimal currencyAmount = calculateEquivalent(request.getCoins(), currency);

        // Deduct coins from ledger
        long nextBalance = currentCoins - request.getCoins();
        RewardLedger ledger = new RewardLedger(
            user,
            -request.getCoins(),
            nextBalance,
            RewardType.REDEMPTION,
            "Redemption request: " + request.getCoins() + " coins for " + currency + " " + currencyAmount,
            "RED_" + System.currentTimeMillis()
        );
        rewardRepository.save(ledger);

        // Record redemption request with PENDING_PAYOUT status
        RedemptionRequest redReq = new RedemptionRequest(
            user,
            request.getCoins(),
            currencyAmount,
            currency,
            request.getPayoutMethod() != null ? request.getPayoutMethod() : "UPI / Bank Account",
            request.getPayoutDestination() != null ? request.getPayoutDestination() : "Primary Account",
            request.getNotes() != null ? request.getNotes() : "Standard redemption queued"
        );
        redemptionRepository.save(redReq);

        return toRedemptionResponse(redReq);
    }

    @Transactional(readOnly = true)
    public List<RewardHistoryItemResponse> getRewardHistory() {
        User user = currentUser();
        return rewardRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(r -> new RewardHistoryItemResponse(
                r.getId(),
                r.getAmount(),
                r.getBalanceAfter(),
                r.getType().name(),
                r.getDescription(),
                r.getCreatedAt().toString()
            )).toList();
    }

    private User currentUser() {
        Long id = SecurityUtils.currentUser().getId();
        return userRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    private void ensureWelcomeBonus(User user) {
        if (!rewardRepository.existsByUserIdAndReferenceId(user.getId(), "WELCOME_BONUS")) {
            creditCoins(user, 100L, RewardType.LESSON_COMPLETION, "Welcome to Velora Academy bonus", "WELCOME_BONUS");
        }
    }

    private void creditCoins(User user, Long amount, RewardType type, String description, String refId) {
        Long currentBalance = rewardRepository.calculateCoinBalance(user.getId());
        long prev = currentBalance != null ? currentBalance : 0L;
        long next = prev + amount;

        RewardLedger entry = new RewardLedger(user, amount, next, type, description, refId);
        rewardRepository.save(entry);
    }

    private BadgeReward unlockBadgeIfAbsent(User user, String code, String name, String desc, String icon) {
        if (!badgeRepository.existsByUserIdAndBadgeCode(user.getId(), code)) {
            BadgeReward badge = new BadgeReward(user, code, name, desc, icon);
            return badgeRepository.save(badge);
        }
        return null;
    }

    private BigDecimal calculateEquivalent(Long coins, String currency) {
        // Base rule: 10 coins = 1.00 INR
        BigDecimal rupees = BigDecimal.valueOf(coins).divide(BigDecimal.valueOf(10), 2, RoundingMode.HALF_UP);
        if ("INR".equalsIgnoreCase(currency)) {
            return rupees;
        }
        if ("USD".equalsIgnoreCase(currency)) {
            // FX conversion: 84.15 INR per USD
            return rupees.divide(BigDecimal.valueOf(84.15), 2, RoundingMode.HALF_UP);
        }
        if ("EUR".equalsIgnoreCase(currency)) {
            return rupees.divide(BigDecimal.valueOf(91.50), 2, RoundingMode.HALF_UP);
        }
        if ("GBP".equalsIgnoreCase(currency)) {
            return rupees.divide(BigDecimal.valueOf(109.20), 2, RoundingMode.HALF_UP);
        }
        return rupees;
    }

    private RedemptionResponse toRedemptionResponse(RedemptionRequest req) {
        RedemptionResponse r = new RedemptionResponse();
        r.setId(req.getId());
        r.setCoinsRedeemed(req.getCoinsRedeemed());
        r.setCurrencyAmount(req.getCurrencyAmount());
        r.setCurrency(req.getCurrency());
        r.setStatus(req.getStatus().name());
        r.setPayoutMethod(req.getPayoutMethod());
        r.setPayoutDestination(req.getPayoutDestination());
        r.setNotes(req.getNotes());
        r.setCreatedAt(req.getCreatedAt().toString());
        return r;
    }

    private BadgeResponse toBadgeResponse(BadgeReward b) {
        return new BadgeResponse(b.getBadgeCode(), b.getBadgeName(), b.getDescription(), b.getIcon(), b.getUnlockedAt().toString());
    }
}
