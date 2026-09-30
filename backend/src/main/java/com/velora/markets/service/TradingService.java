package com.velora.markets.service;

import com.velora.markets.dto.OrderExecutionResponse;
import com.velora.markets.dto.OrderResponse;
import com.velora.markets.dto.PlaceOrderRequest;
import com.velora.markets.dto.TransactionResponse;
import com.velora.markets.entity.*;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.*;
import com.velora.markets.security.SecurityUtils;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TradingService {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final HoldingRepository holdingRepository;
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final PortfolioService portfolioService;
    private final WalletService walletService;
    private final MapperService mapper;

    public TradingService(
        UserRepository userRepository,
        StockRepository stockRepository,
        HoldingRepository holdingRepository,
        OrderRepository orderRepository,
        TransactionRepository transactionRepository,
        PortfolioService portfolioService,
        WalletService walletService,
        MapperService mapper
    ) {
        this.userRepository = userRepository;
        this.stockRepository = stockRepository;
        this.holdingRepository = holdingRepository;
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.portfolioService = portfolioService;
        this.walletService = walletService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrders(int page, int size) {
        int capped = Math.min(Math.max(size, 1), 100);
        int pageIndex = Math.max(page, 0);
        User user = currentUser();
        return orderRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(pageIndex, capped))
            .map(mapper::toOrder);
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> getTransactions(int page, int size) {
        int capped = Math.min(Math.max(size, 1), 100);
        int pageIndex = Math.max(page, 0);
        User user = currentUser();
        return transactionRepository.findByUserOrderByExecutedAtDesc(user, PageRequest.of(pageIndex, capped))
            .map(mapper::toTransaction);
    }

    @Transactional
    public OrderExecutionResponse placeOrder(PlaceOrderRequest request) {
        if (request.getOrderType() != OrderType.MARKET) {
            throw new ApiException("Only MARKET orders are currently supported", HttpStatus.BAD_REQUEST);
        }
        if (request.getQuantity() <= 0) {
            throw new ApiException("Quantity must be at least 1", HttpStatus.BAD_REQUEST);
        }

        String symbol = request.getSymbol().trim().toUpperCase();
        User user = currentUser();
        Stock stock = stockRepository.findById(symbol)
            .orElseThrow(() -> new ApiException("Stock not found: " + symbol, HttpStatus.NOT_FOUND));
        Portfolio portfolio = portfolioService.requirePortfolio(user);

        BigDecimal executionPrice = stock.getPrice();
        BigDecimal totalAmount = executionPrice.multiply(BigDecimal.valueOf(request.getQuantity()))
            .setScale(4, RoundingMode.HALF_UP);

        TradeOrder order = new TradeOrder();
        order.setUser(user);
        order.setSymbol(symbol);
        order.setCompanyName(stock.getCompanyName());
        order.setSide(request.getSide());
        order.setOrderType(OrderType.MARKET);
        order.setQuantity(request.getQuantity());
        order.setLimitPrice(null);
        order.setCreatedAt(Instant.now());

        BigDecimal realizedPnL = null;
        BigDecimal balanceBefore = portfolio.getCashBalance();
        BigDecimal balanceAfter;

        if (request.getSide() == OrderSide.BUY) {
            if (balanceBefore.compareTo(totalAmount) < 0) {
                throw new ApiException("Insufficient cash balance", HttpStatus.BAD_REQUEST);
            }
            balanceAfter = balanceBefore.subtract(totalAmount);
            portfolio.setCashBalance(balanceAfter);
            upsertBuyHolding(portfolio, stock, request.getQuantity(), executionPrice);
        } else {
            Holding holding = holdingRepository.findByPortfolioAndSymbolIgnoreCase(portfolio, symbol)
                .orElseThrow(() -> new ApiException("You do not hold " + symbol, HttpStatus.BAD_REQUEST));
            if (holding.getQuantity() < request.getQuantity()) {
                throw new ApiException("Insufficient holdings to sell", HttpStatus.BAD_REQUEST);
            }
            realizedPnL = executionPrice.subtract(holding.getAverageBuyPrice())
                .multiply(BigDecimal.valueOf(request.getQuantity()))
                .setScale(4, RoundingMode.HALF_UP);
            balanceAfter = balanceBefore.add(totalAmount);
            portfolio.setCashBalance(balanceAfter);
            portfolio.setRealizedPnL(portfolio.getRealizedPnL().add(realizedPnL));

            int remaining = holding.getQuantity() - request.getQuantity();
            if (remaining == 0) {
                holdingRepository.delete(holding);
            } else {
                holding.setQuantity(remaining);
                holdingRepository.save(holding);
            }
        }

        Instant executedAt = Instant.now();
        order.setStatus(OrderStatus.EXECUTED);
        order.setExecutionPrice(executionPrice);
        order.setTotalAmount(totalAmount);
        order.setExecutedAt(executedAt);
        order = orderRepository.save(order);

        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setOrder(order);
        tx.setSymbol(symbol);
        tx.setSide(request.getSide());
        tx.setQuantity(request.getQuantity());
        tx.setPrice(executionPrice);
        tx.setTotalAmount(totalAmount);
        tx.setRealizedPnL(realizedPnL);
        tx.setExecutedAt(executedAt);
        transactionRepository.save(tx);

        // Record in auditable virtual wallet ledger
        walletService.recordLedgerEntry(
            user,
            request.getSide() == OrderSide.BUY ? WalletLedgerType.BUY : WalletLedgerType.SELL,
            totalAmount,
            balanceBefore,
            balanceAfter,
            "ORD-" + order.getId(),
            (request.getSide() == OrderSide.BUY ? "Bought " : "Sold ") + request.getQuantity() + " shares of " + stock.getCompanyName() + " (" + symbol + ")"
        );

        OrderExecutionResponse response = new OrderExecutionResponse();
        response.setOrderId(order.getId());
        response.setSymbol(symbol);
        response.setCompanyName(stock.getCompanyName());
        response.setSide(request.getSide().name());
        response.setOrderType(OrderType.MARKET.name());
        response.setStatus(OrderStatus.EXECUTED.name());
        response.setQuantity(request.getQuantity());
        response.setExecutionPrice(mapper.scale(executionPrice));
        response.setTotalAmount(mapper.scale(totalAmount));
        response.setRemainingCashBalance(mapper.scale(portfolio.getCashBalance()));
        response.setExecutedAt(mapper.iso(executedAt));
        response.setMessage(request.getSide() == OrderSide.BUY
            ? "Buy order executed successfully"
            : "Sell order executed successfully");
        return response;
    }

    private void upsertBuyHolding(Portfolio portfolio, Stock stock, int quantity, BigDecimal price) {
        Holding holding = holdingRepository.findByPortfolioAndSymbolIgnoreCase(portfolio, stock.getSymbol())
            .orElse(null);
        if (holding == null) {
            holding = new Holding();
            holding.setPortfolio(portfolio);
            holding.setSymbol(stock.getSymbol());
            holding.setQuantity(quantity);
            holding.setAverageBuyPrice(price);
        } else {
            BigDecimal existingCost = holding.getAverageBuyPrice().multiply(BigDecimal.valueOf(holding.getQuantity()));
            BigDecimal newCost = price.multiply(BigDecimal.valueOf(quantity));
            int newQty = holding.getQuantity() + quantity;
            BigDecimal avg = existingCost.add(newCost)
                .divide(BigDecimal.valueOf(newQty), 4, RoundingMode.HALF_UP);
            holding.setQuantity(newQty);
            holding.setAverageBuyPrice(avg);
        }
        holdingRepository.save(holding);
    }

    private User currentUser() {
        Long id = SecurityUtils.currentUser().getId();
        return userRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}
