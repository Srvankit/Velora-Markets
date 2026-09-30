package com.velora.markets.dto;

import java.math.BigDecimal;

public class OrderExecutionResponse {
    private Long orderId;
    private String symbol;
    private String companyName;
    private String side;
    private String orderType;
    private String status;
    private int quantity;
    private BigDecimal executionPrice;
    private BigDecimal totalAmount;
    private BigDecimal remainingCashBalance;
    private String executedAt;
    private String message;

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getSide() { return side; }
    public void setSide(String side) { this.side = side; }
    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getExecutionPrice() { return executionPrice; }
    public void setExecutionPrice(BigDecimal executionPrice) { this.executionPrice = executionPrice; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getRemainingCashBalance() { return remainingCashBalance; }
    public void setRemainingCashBalance(BigDecimal remainingCashBalance) { this.remainingCashBalance = remainingCashBalance; }
    public String getExecutedAt() { return executedAt; }
    public void setExecutedAt(String executedAt) { this.executedAt = executedAt; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
