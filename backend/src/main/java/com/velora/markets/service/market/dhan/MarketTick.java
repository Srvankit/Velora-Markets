package com.velora.markets.service.market.dhan;

import java.math.BigDecimal;

public record MarketTick(
    String symbol,
    String securityId,
    String exchangeSegment,
    BigDecimal price,
    BigDecimal open,
    BigDecimal high,
    BigDecimal low,
    BigDecimal close,
    long volume,
    long epochMilli
) {}
