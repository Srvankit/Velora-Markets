package com.velora.markets.dto;

import java.math.BigDecimal;

public class RedemptionResponse {
    private Long id;
    private Long coinsRedeemed;
    private BigDecimal currencyAmount;
    private String currency;
    private String status;
    private String payoutMethod;
    private String payoutDestination;
    private String notes;
    private String createdAt;

    public RedemptionResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCoinsRedeemed() { return coinsRedeemed; }
    public void setCoinsRedeemed(Long coinsRedeemed) { this.coinsRedeemed = coinsRedeemed; }
    public BigDecimal getCurrencyAmount() { return currencyAmount; }
    public void setCurrencyAmount(BigDecimal currencyAmount) { this.currencyAmount = currencyAmount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPayoutMethod() { return payoutMethod; }
    public void setPayoutMethod(String payoutMethod) { this.payoutMethod = payoutMethod; }
    public String getPayoutDestination() { return payoutDestination; }
    public void setPayoutDestination(String payoutDestination) { this.payoutDestination = payoutDestination; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
