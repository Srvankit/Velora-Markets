package com.velora.markets.dto;

import java.math.BigDecimal;
import java.util.List;

public class WalletSummaryResponse {
    private BigDecimal availableCash;
    private BigDecimal investedValue;
    private BigDecimal totalPortfolioValue;
    private BigDecimal totalVirtualCapital;
    private String currency;
    private List<WalletLedgerResponse> recentLedger;

    public BigDecimal getAvailableCash() { return availableCash; }
    public void setAvailableCash(BigDecimal availableCash) { this.availableCash = availableCash; }
    public BigDecimal getInvestedValue() { return investedValue; }
    public void setInvestedValue(BigDecimal investedValue) { this.investedValue = investedValue; }
    public BigDecimal getTotalPortfolioValue() { return totalPortfolioValue; }
    public void setTotalPortfolioValue(BigDecimal totalPortfolioValue) { this.totalPortfolioValue = totalPortfolioValue; }
    public BigDecimal getTotalVirtualCapital() { return totalVirtualCapital; }
    public void setTotalVirtualCapital(BigDecimal totalVirtualCapital) { this.totalVirtualCapital = totalVirtualCapital; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public List<WalletLedgerResponse> getRecentLedger() { return recentLedger; }
    public void setRecentLedger(List<WalletLedgerResponse> recentLedger) { this.recentLedger = recentLedger; }
}
