package com.velora.markets.dto;

import jakarta.validation.constraints.NotBlank;

public class SubscribeRequest {
    @NotBlank
    private String planId;

    private String paymentMethodId;

    public String getPlanId() { return planId; }
    public void setPlanId(String planId) { this.planId = planId; }
    public String getPaymentMethodId() { return paymentMethodId; }
    public void setPaymentMethodId(String paymentMethodId) { this.paymentMethodId = paymentMethodId; }
}
