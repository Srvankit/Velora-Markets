package com.velora.markets.service.market.dhan;

import com.velora.markets.entity.Exchange;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class DhanInstrumentRegistryTest {

    @Test
    void testBaselineCanonicalInstrumentsLookup() {
        DhanInstrumentRegistry registry = new DhanInstrumentRegistry("https://images.dhan.co/api-data/api-scrip-master.csv");

        Optional<DhanInstrument> reliance = registry.findInstrument("RELIANCE", Exchange.NSE);
        assertTrue(reliance.isPresent());
        assertEquals("2885", reliance.get().securityId());
        assertEquals("NSE_EQ", reliance.get().exchangeSegment());
        assertEquals("RELIANCE", reliance.get().symbol());

        Optional<DhanInstrument> tcs = registry.findInstrument("TCS", Exchange.NSE);
        assertTrue(tcs.isPresent());
        assertEquals("11536", tcs.get().securityId());

        Optional<DhanInstrument> nifty50 = registry.findInstrument("NIFTY50", Exchange.NSE);
        assertTrue(nifty50.isPresent());
        assertEquals("13", nifty50.get().securityId());
        assertEquals("IDX_I", nifty50.get().exchangeSegment());

        Optional<DhanInstrument> reverse = registry.findBySecurityId("NSE_EQ", "2885");
        assertTrue(reverse.isPresent());
        assertEquals("RELIANCE", reverse.get().symbol());
    }

    @Test
    void testUnsupportedSymbolReturnsEmpty() {
        DhanInstrumentRegistry registry = new DhanInstrumentRegistry("https://images.dhan.co/api-data/api-scrip-master.csv");
        Optional<DhanInstrument> aapl = registry.findInstrument("AAPL", Exchange.NASDAQ);
        assertTrue(aapl.isEmpty());
    }
}
