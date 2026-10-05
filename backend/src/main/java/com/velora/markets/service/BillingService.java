package com.velora.markets.service;

import com.velora.markets.dto.BillingPlanResponse;
import com.velora.markets.dto.SubscribeRequest;
import com.velora.markets.dto.SubscriptionResponse;
import com.velora.markets.entity.Portfolio;
import com.velora.markets.entity.User;
import com.velora.markets.entity.WalletLedgerType;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.PortfolioRepository;
import com.velora.markets.repository.UserRepository;
import com.velora.markets.security.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BillingService {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final WalletService walletService;

    public BillingService(
        UserRepository userRepository,
        PortfolioRepository portfolioRepository,
        WalletService walletService
    ) {
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.walletService = walletService;
    }

    @Transactional(readOnly = true)
    public List<BillingPlanResponse> getPlans() {
        User user = currentUserOrNull();
        String currentTier = user != null && user.getSubscriptionTier() != null ? user.getSubscriptionTier().toUpperCase() : "STANDARD";
        if ("FREE".equals(currentTier)) currentTier = "STANDARD";
        String currency = user != null && user.getCurrency() != null ? user.getCurrency() : "USD";
        String symbol = resolveSymbol(currency);

        return List.of(
            new BillingPlanResponse(
                "STANDARD",
                "Standard",
                "Essential virtual trading and market learning platform.",
                BigDecimal.ZERO,
                currency,
                "Forever",
                BigDecimal.valueOf(100_000),
                List.of(
                    symbol + "100,000 Starting Virtual Capital",
                    "Real Market Quotes & Charts",
                    "Full Instrument Search & Watchlist",
                    "Core Technical Indicators (SMA, EMA, RSI)",
                    "Complete Velora Study Curriculum"
                ),
                false,
                "STANDARD".equalsIgnoreCase(currentTier)
            ),
            new BillingPlanResponse(
                "PLUS",
                "Plus",
                "Amplified virtual buying power with plus analysis tools.",
                resolvePrice("PLUS", currency),
                currency,
                "monthly",
                BigDecimal.valueOf(500_000),
                List.of(
                    "+" + symbol + "500,000 Virtual Capital Top-up",
                    "Advanced Overlays & Indicators (Bollinger, VWAP, MACD)",
                    "Deep Analytics & Performance Breakdowns",
                    "Real-time Watchlist Price Alerts",
                    "Interactive Study Quizzes & Certifications"
                ),
                true,
                "PLUS".equalsIgnoreCase(currentTier)
            ),
            new BillingPlanResponse(
                "PRO",
                "Pro",
                "Maximum virtual simulation capital for high-volume pro traders.",
                resolvePrice("PRO", currency),
                currency,
                "monthly",
                BigDecimal.valueOf(2_000_000),
                List.of(
                    "+" + symbol + "2,000,000 Virtual Capital Top-up",
                    "Multi-timeframe Chart Panes & Indicator Templates",
                    "Unlimited Watchlists & Custom Screeners",
                    "Dedicated Institutional Simulation Tools",
                    "Priority Platform Feature Access"
                ),
                false,
                "PRO".equalsIgnoreCase(currentTier)
            )
        );
    }

    @Transactional(readOnly = true)
    public SubscriptionResponse getCurrentSubscription() {
        User user = currentUser();
        String tier = user.getSubscriptionTier() != null ? user.getSubscriptionTier().toUpperCase() : "STANDARD";
        if ("FREE".equals(tier)) tier = "STANDARD";
        String currency = user.getCurrency() != null ? user.getCurrency() : "USD";

        String planName = switch (tier.toUpperCase()) {
            case "PLUS" -> "Plus";
            case "PRO", "ELITE" -> "Pro";
            default -> "Standard";
        };

        BigDecimal price = resolvePrice(tier, currency);
        String renewal = Instant.now().plus(30, ChronoUnit.DAYS).toString();

        return new SubscriptionResponse(
            tier,
            planName,
            user.getSubscriptionStatus() != null ? user.getSubscriptionStatus() : "ACTIVE",
            "monthly",
            price,
            currency,
            renewal,
            "Your " + planName + " subscription is active (Virtual simulation only)."
        );
    }

    private static String resolveSymbol(String currency) {
        if (currency == null) return "$";
        return switch (currency.toUpperCase()) {
            case "INR" -> "₹";
            case "USD" -> "$";
            case "GBP" -> "£";
            case "EUR" -> "€";
            case "JPY" -> "¥";
            case "CAD" -> "CA$";
            case "AUD" -> "A$";
            case "AED" -> "AED ";
            case "SGD" -> "S$";
            default -> "$";
        };
    }

    private static BigDecimal resolvePrice(String tier, String currency) {
        String c = (currency != null ? currency : "USD").toUpperCase();
        if ("PLUS".equalsIgnoreCase(tier)) {
            return switch (c) {
                case "INR" -> BigDecimal.valueOf(999.00);
                case "GBP" -> BigDecimal.valueOf(10.00);
                case "EUR" -> BigDecimal.valueOf(11.00);
                case "JPY" -> BigDecimal.valueOf(1800.00);
                case "CAD" -> BigDecimal.valueOf(16.00);
                case "AUD" -> BigDecimal.valueOf(18.00);
                case "AED" -> BigDecimal.valueOf(45.00);
                case "SGD" -> BigDecimal.valueOf(16.00);
                default -> BigDecimal.valueOf(12.00);
            };
        }
        if ("PRO".equalsIgnoreCase(tier) || "ELITE".equalsIgnoreCase(tier)) {
            return switch (c) {
                case "INR" -> BigDecimal.valueOf(2499.00);
                case "GBP" -> BigDecimal.valueOf(24.00);
                case "EUR" -> BigDecimal.valueOf(27.00);
                case "JPY" -> BigDecimal.valueOf(4500.00);
                case "CAD" -> BigDecimal.valueOf(39.00);
                case "AUD" -> BigDecimal.valueOf(45.00);
                case "AED" -> BigDecimal.valueOf(110.00);
                case "SGD" -> BigDecimal.valueOf(39.00);
                default -> BigDecimal.valueOf(29.00);
            };
        }
        return BigDecimal.ZERO;
    }

    @Transactional
    public SubscriptionResponse subscribe(SubscribeRequest request) {
        User user = currentUser();
        String targetPlan = request.getPlanId().trim().toUpperCase();
        if ("FREE".equals(targetPlan)) targetPlan = "STANDARD";
        if ("ELITE".equals(targetPlan)) targetPlan = "PRO";

        if (!List.of("STANDARD", "PLUS", "PRO").contains(targetPlan)) {
            throw new ApiException("Invalid subscription plan selected.", HttpStatus.BAD_REQUEST);
        }

        String userTier = user.getSubscriptionTier() != null ? user.getSubscriptionTier().toUpperCase() : "STANDARD";
        if ("FREE".equals(userTier)) userTier = "STANDARD";

        if (targetPlan.equalsIgnoreCase(userTier)) {
            throw new ApiException("You are already subscribed to the " + targetPlan + " plan.", HttpStatus.BAD_REQUEST);
        }

        Portfolio portfolio = portfolioRepository.findByUser(user)
            .orElseThrow(() -> new ApiException("Portfolio not found", HttpStatus.NOT_FOUND));

        BigDecimal bonusCapital = switch (targetPlan) {
            case "PLUS" -> BigDecimal.valueOf(500_000);
            case "PRO" -> BigDecimal.valueOf(2_000_000);
            default -> BigDecimal.ZERO;
        };

        BigDecimal balanceBefore = portfolio.getCashBalance();
        BigDecimal balanceAfter = balanceBefore.add(bonusCapital);

        if (bonusCapital.compareTo(BigDecimal.ZERO) > 0) {
            portfolio.setCashBalance(balanceAfter);
            portfolioRepository.save(portfolio);

            walletService.recordLedgerEntry(
                user,
                WalletLedgerType.ADJUSTMENT,
                bonusCapital,
                balanceBefore,
                balanceAfter,
                "SUB-" + targetPlan + "-" + System.currentTimeMillis(),
                "Subscription Virtual Capital Grant (" + targetPlan + " Plan: +" + user.getCurrency() + " " + bonusCapital.toPlainString() + ")"
            );
        }

        user.setSubscriptionTier(targetPlan);
        user.setSubscriptionStatus("ACTIVE");
        userRepository.save(user);

        return getCurrentSubscription();
    }

    private User currentUser() {
        Long id = SecurityUtils.currentUser().getId();
        return userRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    private User currentUserOrNull() {
        return SecurityUtils.currentUserOptional()
            .flatMap(p -> userRepository.findById(p.getId()))
            .orElse(null);
    }
}

