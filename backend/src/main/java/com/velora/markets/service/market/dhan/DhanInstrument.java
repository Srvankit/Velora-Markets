package com.velora.markets.service.market.dhan;

import com.velora.markets.entity.Exchange;

public record DhanInstrument(
    String securityId,
    String exchangeSegment,
    String instrumentType,
    String symbol,
    String companyName,
    Exchange exchange
) {
    public boolean isValid() {
        return securityId != null && !securityId.isBlank() && exchangeSegment != null && !exchangeSegment.isBlank();
    }
}
