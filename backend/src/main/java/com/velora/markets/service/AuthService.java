package com.velora.markets.service;

import com.velora.markets.dto.AuthResponse;
import com.velora.markets.dto.LoginRequest;
import com.velora.markets.dto.RegisterRequest;
import com.velora.markets.entity.Portfolio;
import com.velora.markets.entity.Role;
import com.velora.markets.entity.User;
import com.velora.markets.entity.WalletLedger;
import com.velora.markets.entity.WalletLedgerType;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.PortfolioRepository;
import com.velora.markets.repository.UserRepository;
import com.velora.markets.repository.WalletLedgerRepository;
import com.velora.markets.security.JwtService;
import com.velora.markets.security.UserPrincipal;
import java.math.BigDecimal;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;
    private final WalletLedgerRepository walletLedgerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MapperService mapper;
    private final BigDecimal startingCash;

    public AuthService(
        UserRepository userRepository,
        PortfolioRepository portfolioRepository,
        WalletLedgerRepository walletLedgerRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager,
        MapperService mapper,
        @Value("${velora.portfolio.starting-cash:100000.00}") BigDecimal startingCash
    ) {
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.walletLedgerRepository = walletLedgerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.mapper = mapper;
        this.startingCash = startingCash;
    }

    public static String resolveCurrency(String country, String explicitCurrency) {
        if (explicitCurrency != null && !explicitCurrency.isBlank()) {
            return explicitCurrency.trim().toUpperCase();
        }
        if (country == null) return "USD";
        String c = country.trim().toUpperCase();
        return switch (c) {
            case "IN", "INDIA" -> "INR";
            case "US", "USA", "UNITED STATES" -> "USD";
            case "GB", "UK", "UNITED KINGDOM" -> "GBP";
            case "DE", "FR", "GERMANY", "FRANCE", "EU", "EUROPE", "IT", "ES", "NL" -> "EUR";
            case "JP", "JAPAN" -> "JPY";
            case "CA", "CANADA" -> "CAD";
            case "AU", "AUSTRALIA" -> "AUD";
            case "AE", "UAE", "UNITED ARAB EMIRATES" -> "AED";
            case "SG", "SINGAPORE" -> "SGD";
            default -> "USD";
        };
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ApiException("Email is already registered", HttpStatus.CONFLICT);
        }
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new ApiException("Username is already taken", HttpStatus.CONFLICT);
        }

        String currency = resolveCurrency(request.getCountry(), request.getCurrency());

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhone(request.getPhone());
        user.setCountry(request.getCountry());
        user.setCurrency(currency);
        user.setSubscriptionTier("FREE");
        user.setSubscriptionStatus("ACTIVE");
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setEmailVerified(false);
        user = userRepository.save(user);

        // Initialize Virtual Portfolio with 100,000 starting virtual capital
        Portfolio portfolio = new Portfolio();
        portfolio.setUser(user);
        portfolio.setCashBalance(startingCash);
        portfolio.setRealizedPnL(BigDecimal.ZERO);
        portfolioRepository.save(portfolio);

        // Record Auditable INITIAL_CAPITAL Virtual Wallet Entry
        WalletLedger ledgerEntry = new WalletLedger();
        ledgerEntry.setUser(user);
        ledgerEntry.setType(WalletLedgerType.INITIAL_CAPITAL);
        ledgerEntry.setAmount(startingCash);
        ledgerEntry.setBalanceBefore(BigDecimal.ZERO);
        ledgerEntry.setBalanceAfter(startingCash);
        ledgerEntry.setReferenceId("INIT-" + user.getId());
        ledgerEntry.setDescription("Virtual starting capital initialization (" + currency + " 100,000)");
        ledgerEntry.setStatus("COMPLETED");
        ledgerEntry.setTimestamp(Instant.now());
        walletLedgerRepository.save(ledgerEntry);

        return mapper.toAuthResponse(user, null, "Account created successfully");
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
            .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        // Ensure legacy user currency is derived and persisted
        if (user.getCurrency() == null || user.getCurrency().isBlank()) {
            user.setCurrency(resolveCurrency(user.getCountry(), null));
            user = userRepository.save(user);
        }

        // Ensure portfolio and initial ledger exist idempotently for legacy accounts
        ensureVirtualCapitalInitialized(user);

        String token = jwtService.generateToken(new UserPrincipal(user));
        return mapper.toAuthResponse(user, token, "Login successful");
    }

    private void ensureVirtualCapitalInitialized(User user) {
        if (!portfolioRepository.findByUser(user).isPresent()) {
            Portfolio portfolio = new Portfolio();
            portfolio.setUser(user);
            portfolio.setCashBalance(startingCash);
            portfolio.setRealizedPnL(BigDecimal.ZERO);
            portfolioRepository.save(portfolio);
        }

        if (!walletLedgerRepository.existsByUserAndType(user, WalletLedgerType.INITIAL_CAPITAL)) {
            WalletLedger ledgerEntry = new WalletLedger();
            ledgerEntry.setUser(user);
            ledgerEntry.setType(WalletLedgerType.INITIAL_CAPITAL);
            ledgerEntry.setAmount(startingCash);
            ledgerEntry.setBalanceBefore(BigDecimal.ZERO);
            ledgerEntry.setBalanceAfter(startingCash);
            ledgerEntry.setReferenceId("INIT-" + user.getId());
            ledgerEntry.setDescription("Virtual starting capital initialization");
            ledgerEntry.setStatus("COMPLETED");
            ledgerEntry.setTimestamp(Instant.now());
            walletLedgerRepository.save(ledgerEntry);
        }
    }
}
