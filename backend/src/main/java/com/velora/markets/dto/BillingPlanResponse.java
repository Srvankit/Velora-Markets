package com.velora.markets.dto;

import java.math.BigDecimal;
import java.util.List;

public class BillingPlanResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private String currency;
    private String billingInterval;
    private BigDecimal virtualCapitalBonus;
    private List<String> features;
    private boolean isPopular;
    private boolean isCurrent;

    public BillingPlanResponse() {}

    public BillingPlanResponse(String id, String name, String description, BigDecimal price, String currency, String billingInterval, BigDecimal virtualCapitalBonus, List<String> features, boolean isPopular, boolean isCurrent) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.billingInterval = billingInterval;
        this.virtualCapitalBonus = virtualCapitalBonus;
        this.features = features;
        this.isPopular = isPopular;
        this.isCurrent = isCurrent;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getBillingInterval() { return billingInterval; }
    public void setBillingInterval(String billingInterval) { this.billingInterval = billingInterval; }
    public BigDecimal getVirtualCapitalBonus() { return virtualCapitalBonus; }
    public void setVirtualCapitalBonus(BigDecimal virtualCapitalBonus) { this.virtualCapitalBonus = virtualCapitalBonus; }
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
    public boolean isPopular() { return isPopular; }
    public void setPopular(boolean popular) { isPopular = popular; }
    public boolean isCurrent() { return isCurrent; }
    public void setCurrent(boolean current) { isCurrent = current; }
}
