package com.velora.markets.service;

import com.velora.markets.dto.*;
import com.velora.markets.entity.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class MapperService {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getFullName(),
            user.getUsername(),
            user.getEmail(),
            user.getPhone(),
            user.getCountry(),
            user.getCurrency(),
            user.getSubscriptionTier(),
            user.getSubscriptionStatus(),
            user.getRole().name(),
            user.isEmailVerified()
        );
    }

    public AuthResponse toAuthResponse(User user, String token, String message) {
        return new AuthResponse(
            user.getId(),
            user.getFullName(),
            user.getUsername(),
            user.getEmail(),
            user.getCountry(),
            user.getCurrency(),
            user.getSubscriptionTier(),
            user.getRole().name(),
            token,
            token != null ? "Bearer" : null,
            message
        );
    }

    public MarketStockResponse toMarketStock(Stock stock) {
        BigDecimal change = stock.getPrice().subtract(stock.getPreviousClose());
        BigDecimal changePercent = stock.getPreviousClose().compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : change.multiply(BigDecimal.valueOf(100))
                .divide(stock.getPreviousClose(), 4, RoundingMode.HALF_UP);

        MarketStockResponse response = new MarketStockResponse();
        response.setSymbol(stock.getSymbol());
        response.setCompanyName(stock.getCompanyName());
        response.setPrice(scale(stock.getPrice()));
        response.setPreviousClose(scale(stock.getPreviousClose()));
        response.setChange(scale(change));
        response.setChangePercent(scale(changePercent));
        response.setOpen(scale(stock.getOpenPrice()));
        response.setHigh(scale(stock.getHighPrice()));
        response.setLow(scale(stock.getLowPrice()));
        response.setVolume(stock.getVolume());
        response.setExchange(stock.getExchange().name());
        response.setSector(stock.getSector());
        response.setCurrency(stock.getCurrency());
        response.setMarketStatus(stock.getMarketStatus() != null ? stock.getMarketStatus().name() : "LIVE");
        response.setTimestamp(iso(stock.getUpdatedAt()));
        return response;
    }

    public HoldingResponse toHolding(Holding holding, Stock stock) {
        BigDecimal currentPrice = stock != null ? stock.getPrice() : holding.getAverageBuyPrice();
        String companyName = stock != null ? stock.getCompanyName() : holding.getSymbol();
        BigDecimal invested = holding.getAverageBuyPrice().multiply(BigDecimal.valueOf(holding.getQuantity()));
        BigDecimal market = currentPrice.multiply(BigDecimal.valueOf(holding.getQuantity()));
        BigDecimal unrealized = market.subtract(invested);
        BigDecimal ret = invested.compareTo(BigDecimal.ZERO) == 0
            ? BigDecimal.ZERO
            : unrealized.multiply(BigDecimal.valueOf(100)).divide(invested, 4, RoundingMode.HALF_UP);

        HoldingResponse response = new HoldingResponse();
        response.setId(holding.getId());
        response.setSymbol(holding.getSymbol());
        response.setCompanyName(companyName);
        response.setQuantity(holding.getQuantity());
        response.setAverageBuyPrice(scale(holding.getAverageBuyPrice()));
        response.setCurrentPrice(scale(currentPrice));
        response.setInvestedValue(scale(invested));
        response.setMarketValue(scale(market));
        response.setUnrealizedPnL(scale(unrealized));
        response.setReturnPercentage(scale(ret));
        return response;
    }

    public OrderResponse toOrder(TradeOrder order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setSymbol(order.getSymbol());
        response.setCompanyName(order.getCompanyName());
        response.setSide(order.getSide().name());
        response.setOrderType(order.getOrderType().name());
        response.setStatus(order.getStatus().name());
        response.setQuantity(order.getQuantity());
        response.setLimitPrice(order.getLimitPrice() == null ? null : scale(order.getLimitPrice()));
        response.setExecutionPrice(order.getExecutionPrice() == null ? null : scale(order.getExecutionPrice()));
        response.setTotalAmount(order.getTotalAmount() == null ? null : scale(order.getTotalAmount()));
        response.setCreatedAt(iso(order.getCreatedAt()));
        response.setExecutedAt(order.getExecutedAt() == null ? null : iso(order.getExecutedAt()));
        return response;
    }

    public TransactionResponse toTransaction(Transaction tx) {
        TransactionResponse response = new TransactionResponse();
        response.setTransactionId(tx.getId());
        response.setOrderId(tx.getOrder().getId());
        response.setSymbol(tx.getSymbol());
        response.setSide(tx.getSide().name());
        response.setQuantity(tx.getQuantity());
        response.setPrice(scale(tx.getPrice()));
        response.setTotalAmount(scale(tx.getTotalAmount()));
        response.setRealizedPnL(tx.getRealizedPnL() == null ? null : scale(tx.getRealizedPnL()));
        response.setExecutedAt(iso(tx.getExecutedAt()));
        return response;
    }

    public WatchlistItemResponse toWatchlistItem(WatchlistItem item, Stock stock) {
        WatchlistItemResponse response = new WatchlistItemResponse();
        response.setId(item.getId());
        response.setSymbol(item.getSymbol());
        response.setCompanyName(stock != null ? stock.getCompanyName() : item.getSymbol());
        response.setCurrentPrice(stock != null ? scale(stock.getPrice()) : BigDecimal.ZERO);
        response.setAddedAt(iso(item.getAddedAt()));
        return response;
    }

    public BigDecimal scale(BigDecimal value) {
        return Optional.ofNullable(value).orElse(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
    }

    public String iso(Instant instant) {
        return instant.toString();
    }
}
