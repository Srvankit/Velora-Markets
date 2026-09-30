package com.velora.markets.service;

import com.velora.markets.dto.DashboardResponse;
import com.velora.markets.dto.PortfolioResponse;
import com.velora.markets.entity.User;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.OrderRepository;
import com.velora.markets.repository.TransactionRepository;
import com.velora.markets.repository.UserRepository;
import com.velora.markets.security.SecurityUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final PortfolioService portfolioService;
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final MapperService mapper;

    public DashboardService(
        PortfolioService portfolioService,
        OrderRepository orderRepository,
        TransactionRepository transactionRepository,
        UserRepository userRepository,
        MapperService mapper
    ) {
        this.portfolioService = portfolioService;
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        User user = currentUser();
        PortfolioResponse portfolio = portfolioService.buildPortfolio(user);

        DashboardResponse response = new DashboardResponse();
        response.setCashBalance(portfolio.getCashBalance());
        response.setInvestedValue(portfolio.getInvestedValue());
        response.setMarketValue(portfolio.getMarketValue());
        response.setTotalAccountValue(portfolio.getTotalAccountValue());
        response.setUnrealizedPnL(portfolio.getUnrealizedPnL());
        response.setRealizedPnL(portfolio.getRealizedPnL());
        response.setTotalPnL(portfolio.getTotalPnL());
        response.setReturnPercentage(portfolio.getReturnPercentage());
        response.setTotalHoldings(portfolio.getTotalHoldings());
        response.setTotalOrders(orderRepository.countByUser(user));
        response.setTotalTransactions(transactionRepository.countByUser(user));
        response.setTopHoldings(portfolio.getHoldings().stream().limit(5).toList());
        response.setRecentOrders(
            orderRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(0, 5))
                .map(mapper::toOrder)
                .getContent()
        );
        response.setRecentTransactions(
            transactionRepository.findByUserOrderByExecutedAtDesc(user, PageRequest.of(0, 5))
                .map(mapper::toTransaction)
                .getContent()
        );
        return response;
    }

    private User currentUser() {
        Long id = SecurityUtils.currentUser().getId();
        return userRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}
