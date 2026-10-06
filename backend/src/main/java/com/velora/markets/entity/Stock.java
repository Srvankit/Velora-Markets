package com.velora.markets.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "stocks")
public class Stock {

    @Id
    @Column(length = 20)
    private String symbol;

    @Column(nullable = false)
    private String companyName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Exchange exchange;

    @Column(nullable = false)
    private String sector;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal price;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal previousClose;

    @Column(precision = 19, scale = 4)
    private BigDecimal openPrice;

    @Column(precision = 19, scale = 4)
    private BigDecimal highPrice;

    @Column(precision = 19, scale = 4)
    private BigDecimal lowPrice;

    @Column(length = 10)
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MarketStatus marketStatus = MarketStatus.LIVE;

    @Column(nullable = false)
    private long volume = 0L;

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public Exchange getExchange() { return exchange; }
    public void setExchange(Exchange exchange) { this.exchange = exchange; }
    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getPreviousClose() { return previousClose; }
    public void setPreviousClose(BigDecimal previousClose) { this.previousClose = previousClose; }
    public BigDecimal getOpenPrice() { return openPrice != null ? openPrice : previousClose; }
    public void setOpenPrice(BigDecimal openPrice) { this.openPrice = openPrice; }
    public BigDecimal getHighPrice() { return highPrice != null ? highPrice : (price != null && previousClose != null ? price.max(previousClose) : price); }
    public void setHighPrice(BigDecimal highPrice) { this.highPrice = highPrice; }
    public BigDecimal getLowPrice() { return lowPrice != null ? lowPrice : (price != null && previousClose != null ? price.min(previousClose) : price); }
    public void setLowPrice(BigDecimal lowPrice) { this.lowPrice = lowPrice; }
    public String getCurrency() { return currency != null ? currency : (exchange == Exchange.NSE || exchange == Exchange.BSE ? "INR" : "USD"); }
    public void setCurrency(String currency) { this.currency = currency; }
    public MarketStatus getMarketStatus() { return marketStatus != null ? marketStatus : MarketStatus.LIVE; }
    public void setMarketStatus(MarketStatus marketStatus) { this.marketStatus = marketStatus; }
    public long getVolume() { return volume; }
    public void setVolume(long volume) { this.volume = volume; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
