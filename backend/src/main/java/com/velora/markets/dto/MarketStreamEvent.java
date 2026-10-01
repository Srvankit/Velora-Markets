package com.velora.markets.dto;

import java.math.BigDecimal;

public record MarketStreamEvent(
    String symbol,
    String interval,
    String status,
    String timestamp,
    BigDecimal price,
    BigDecimal open,
    BigDecimal high,
    BigDecimal low,
    BigDecimal close,
    long volume
) {}
