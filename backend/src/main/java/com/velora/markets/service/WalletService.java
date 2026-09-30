package com.velora.markets.service;

import com.velora.markets.dto.PortfolioResponse;
import com.velora.markets.dto.WalletLedgerResponse;
import com.velora.markets.dto.WalletSummaryResponse;
import com.velora.markets.entity.User;
import com.velora.markets.entity.WalletLedger;
import com.velora.markets.entity.WalletLedgerType;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.UserRepository;
import com.velora.markets.repository.WalletLedgerRepository;
import com.velora.markets.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class WalletService {

    private final WalletLedgerRepository walletLedgerRepository;
    private final UserRepository userRepository;
    private final PortfolioService portfolioService;
    private final MapperService mapper;

    public WalletService(
        WalletLedgerRepository walletLedgerRepository,
        UserRepository userRepository,
        PortfolioService portfolioService,
        MapperService mapper
    ) {
        this.walletLedgerRepository = walletLedgerRepository;
        this.userRepository = userRepository;
        this.portfolioService = portfolioService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public WalletSummaryResponse getWalletSummary() {
        User user = currentUser();
        PortfolioResponse portfolio = portfolioService.getPortfolio();

        Page<WalletLedger> recent = walletLedgerRepository.findByUserOrderByTimestampDesc(
            user, PageRequest.of(0, 10)
        );

        List<WalletLedgerResponse> ledgerResponses = recent.getContent().stream()
            .map(this::toLedgerResponse)
            .toList();

        WalletSummaryResponse response = new WalletSummaryResponse();
        response.setAvailableCash(portfolio.getCashBalance());
        response.setInvestedValue(portfolio.getInvestedValue());
        response.setTotalPortfolioValue(portfolio.getTotalAccountValue());
        response.setTotalVirtualCapital(portfolio.getCashBalance().add(portfolio.getInvestedValue()));
        response.setCurrency(user.getCurrency() != null ? user.getCurrency() : "INR");
        response.setRecentLedger(ledgerResponses);
        return response;
    }

    @Transactional(readOnly = true)
    public Page<WalletLedgerResponse> getLedger(int page, int size) {
        int capped = Math.min(Math.max(size, 1), 100);
        int pageIndex = Math.max(page, 0);
        User user = currentUser();
        return walletLedgerRepository.findByUserOrderByTimestampDesc(user, PageRequest.of(pageIndex, capped))
            .map(this::toLedgerResponse);
    }

    @Transactional
    public WalletLedger recordLedgerEntry(
        User user,
        WalletLedgerType type,
        BigDecimal amount,
        BigDecimal balanceBefore,
        BigDecimal balanceAfter,
        String referenceId,
        String description
    ) {
        WalletLedger entry = new WalletLedger();
        entry.setUser(user);
        entry.setType(type);
        entry.setAmount(mapper.scale(amount));
        entry.setBalanceBefore(mapper.scale(balanceBefore));
        entry.setBalanceAfter(mapper.scale(balanceAfter));
        entry.setReferenceId(referenceId);
        entry.setDescription(description);
        entry.setStatus("COMPLETED");
        entry.setTimestamp(Instant.now());
        return walletLedgerRepository.save(entry);
    }

    public WalletLedgerResponse toLedgerResponse(WalletLedger entry) {
        WalletLedgerResponse response = new WalletLedgerResponse();
        response.setId(entry.getId());
        response.setUserId(entry.getUser().getId());
        response.setType(entry.getType().name());
        response.setAmount(mapper.scale(entry.getAmount()));
        response.setBalanceBefore(mapper.scale(entry.getBalanceBefore()));
        response.setBalanceAfter(mapper.scale(entry.getBalanceAfter()));
        response.setReferenceId(entry.getReferenceId());
        response.setDescription(entry.getDescription());
        response.setStatus(entry.getStatus());
        response.setTimestamp(mapper.iso(entry.getTimestamp()));
        return response;
    }

    private User currentUser() {
        Long id = SecurityUtils.currentUser().getId();
        return userRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}
