package com.velora.markets.dto;

public class RewardHistoryItemResponse {
    private Long id;
    private Long amount;
    private Long balanceAfter;
    private String type;
    private String description;
    private String createdAt;

    public RewardHistoryItemResponse() {}

    public RewardHistoryItemResponse(Long id, Long amount, Long balanceAfter, String type, String description, String createdAt) {
        this.id = id;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.type = type;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
    public Long getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(Long balanceAfter) { this.balanceAfter = balanceAfter; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
