package com.velora.markets.dto;

import java.math.BigDecimal;

public class SubscriptionResponse {
    private String planId;
    private String planName;
    private String status;
    private String billingInterval;
    private BigDecimal price;
    private String currency;
    private String renewalDate;
    private String message;

    public SubscriptionResponse() {}

    public SubscriptionResponse(String planId, String planName, String status, String billingInterval, BigDecimal price, String currency, String renewalDate, String message) {
        this.planId = planId;
        this.planName = planName;
        this.status = status;
        this.billingInterval = billingInterval;
        this.price = price;
        this.currency = currency;
        this.renewalDate = renewalDate;
        this.message = message;
    }

    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }
    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBillingInterval() { return billingInterval; }
    public void setBillingInterval(String billingInterval) { this.billingInterval = billingInterval; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getRenewalDate() { return renewalDate; }
    public void setRenewalDate(String renewalDate) { this.renewalDate = renewalDate; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
