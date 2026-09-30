package com.velora.markets.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardResponse {
    private BigDecimal cashBalance;
    private BigDecimal investedValue;
    private BigDecimal marketValue;
    private BigDecimal totalAccountValue;
    private BigDecimal unrealizedPnL;
    private BigDecimal realizedPnL;
    private BigDecimal totalPnL;
    private BigDecimal returnPercentage;
    private int totalHoldings;
    private long totalOrders;
    private long totalTransactions;
    private List<HoldingResponse> topHoldings = new ArrayList<>();
    private List<OrderResponse> recentOrders = new ArrayList<>();
    private List<TransactionResponse> recentTransactions = new ArrayList<>();

    public BigDecimal getCashBalance() { return cashBalance; }
    public void setCashBalance(BigDecimal cashBalance) { this.cashBalance = cashBalance; }
    public BigDecimal getInvestedValue() { return investedValue; }
    public void setInvestedValue(BigDecimal investedValue) { this.investedValue = investedValue; }
    public BigDecimal getMarketValue() { return marketValue; }
    public void setMarketValue(BigDecimal marketValue) { this.marketValue = marketValue; }
    public BigDecimal getTotalAccountValue() { return totalAccountValue; }
    public void setTotalAccountValue(BigDecimal totalAccountValue) { this.totalAccountValue = totalAccountValue; }
    public BigDecimal getUnrealizedPnL() { return unrealizedPnL; }
    public void setUnrealizedPnL(BigDecimal unrealizedPnL) { this.unrealizedPnL = unrealizedPnL; }
    public BigDecimal getRealizedPnL() { return realizedPnL; }
    public void setRealizedPnL(BigDecimal realizedPnL) { this.realizedPnL = realizedPnL; }
    public BigDecimal getTotalPnL() { return totalPnL; }
    public void setTotalPnL(BigDecimal totalPnL) { this.totalPnL = totalPnL; }
    public BigDecimal getReturnPercentage() { return returnPercentage; }
    public void setReturnPercentage(BigDecimal returnPercentage) { this.returnPercentage = returnPercentage; }
    public int getTotalHoldings() { return totalHoldings; }
    public void setTotalHoldings(int totalHoldings) { this.totalHoldings = totalHoldings; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public long getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(long totalTransactions) { this.totalTransactions = totalTransactions; }
    public List<HoldingResponse> getTopHoldings() { return topHoldings; }
    public void setTopHoldings(List<HoldingResponse> topHoldings) { this.topHoldings = topHoldings; }
    public List<OrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponse> recentOrders) { this.recentOrders = recentOrders; }
    public List<TransactionResponse> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<TransactionResponse> recentTransactions) { this.recentTransactions = recentTransactions; }
}
