package com.velora.markets.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "redemption_requests")
public class RedemptionRequest {

    public enum Status {
        PENDING_PAYOUT,
        APPROVED,
        REJECTED,
        PROCESSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "coins_redeemed", nullable = false)
    private Long coinsRedeemed;

    @Column(name = "currency_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal currencyAmount;

    @Column(nullable = false, length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.PENDING_PAYOUT;

    @Column(name = "payout_method", length = 60)
    private String payoutMethod;

    @Column(name = "payout_destination", length = 120)
    private String payoutDestination;

    @Column(length = 255)
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public RedemptionRequest() {}

    public RedemptionRequest(User user, Long coinsRedeemed, BigDecimal currencyAmount, String currency, String payoutMethod, String payoutDestination, String notes) {
        this.user = user;
        this.coinsRedeemed = coinsRedeemed;
        this.currencyAmount = currencyAmount;
        this.currency = currency;
        this.payoutMethod = payoutMethod;
        this.payoutDestination = payoutDestination;
        this.notes = notes;
        this.status = Status.PENDING_PAYOUT;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Long getCoinsRedeemed() { return coinsRedeemed; }
    public void setCoinsRedeemed(Long coinsRedeemed) { this.coinsRedeemed = coinsRedeemed; }
    public BigDecimal getCurrencyAmount() { return currencyAmount; }
    public void setCurrencyAmount(BigDecimal currencyAmount) { this.currencyAmount = currencyAmount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public String getPayoutMethod() { return payoutMethod; }
    public void setPayoutMethod(String payoutMethod) { this.payoutMethod = payoutMethod; }
    public String getPayoutDestination() { return payoutDestination; }
    public void setPayoutDestination(String payoutDestination) { this.payoutDestination = payoutDestination; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
