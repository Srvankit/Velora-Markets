package com.velora.markets.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PortfolioResponse {
    private Long portfolioId;
    private BigDecimal cashBalance;
    private BigDecimal investedValue;
    private BigDecimal marketValue;
    private BigDecimal totalAccountValue;
    private BigDecimal unrealizedPnL;
    private BigDecimal realizedPnL;
    private BigDecimal totalPnL;
    private BigDecimal returnPercentage;
    private int totalHoldings;
    private List<HoldingResponse> holdings = new ArrayList<>();
    private String createdAt;
    private String updatedAt;

    public Long getPortfolioId() { return portfolioId; }
    public void setPortfolioId(Long portfolioId) { this.portfolioId = portfolioId; }
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
    public List<HoldingResponse> getHoldings() { return holdings; }
    public void setHoldings(List<HoldingResponse> holdings) { this.holdings = holdings; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
