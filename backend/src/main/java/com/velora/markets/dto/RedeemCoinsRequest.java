package com.velora.markets.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class RedeemCoinsRequest {

    @NotNull
    @Min(10)
    private Long coins;

    private String payoutMethod;
    private String payoutDestination;
    private String notes;

    public RedeemCoinsRequest() {}

    public Long getCoins() { return coins; }
    public void setCoins(Long coins) { this.coins = coins; }
    public String getPayoutMethod() { return payoutMethod; }
    public void setPayoutMethod(String payoutMethod) { this.payoutMethod = payoutMethod; }
    public String getPayoutDestination() { return payoutDestination; }
    public void setPayoutDestination(String payoutDestination) { this.payoutDestination = payoutDestination; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
