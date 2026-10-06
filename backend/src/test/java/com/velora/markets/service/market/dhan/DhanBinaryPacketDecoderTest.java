package com.velora.markets.service.market.dhan;

import com.velora.markets.entity.Exchange;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class DhanBinaryPacketDecoderTest {

    private DhanInstrumentRegistry registry;
    private DhanBinaryPacketDecoder decoder;

    @BeforeEach
    void setUp() {
        registry = new DhanInstrumentRegistry("https://images.dhan.co/api-data/api-scrip-master.csv");
        decoder = new DhanBinaryPacketDecoder(registry);
    }

    @Test
    void testDecodeTickerPacket() {
        // Feed Code 2 (Ticker): 16 bytes, Little-Endian
        // byte 0: 2 (feed code)
        // byte 1-2: 16 (short length)
        // byte 3: 0 (segment: NSE_EQ)
        // byte 4-7: 2885 (int security id for RELIANCE)
        // byte 8-11: 1285.50f (float LTP)
        // byte 12-15: 1728206100 (int LTT epoch seconds)

        ByteBuffer buffer = ByteBuffer.allocate(16).order(ByteOrder.LITTLE_ENDIAN);
        buffer.put((byte) 2);
        buffer.putShort((short) 16);
        buffer.put((byte) 0);
        buffer.putInt(2885);
        buffer.putFloat(1285.50f);
        buffer.putInt(1728206100);
        buffer.flip();

        Optional<MarketTick> tickOpt = decoder.decode(buffer);
        assertTrue(tickOpt.isPresent());

        MarketTick tick = tickOpt.get();
        assertEquals("RELIANCE", tick.symbol());
        assertEquals("2885", tick.securityId());
        assertEquals("NSE_EQ", tick.exchangeSegment());
        assertEquals(new BigDecimal("1285.50"), tick.price());
        assertEquals(1728206100000L, tick.epochMilli());
    }

    @Test
    void testDecodeQuotePacket() {
        // Feed Code 4 (Quote): 50 bytes, Little-Endian
        ByteBuffer buffer = ByteBuffer.allocate(50).order(ByteOrder.LITTLE_ENDIAN);
        buffer.put((byte) 4); // Feed Code
        buffer.putShort((short) 50); // Length
        buffer.put((byte) 0); // Segment (NSE_EQ)
        buffer.putInt(1333); // Security ID for HDFCBANK
        buffer.putFloat(1680.25f); // LTP
        buffer.putShort((short) 50); // LTQ
        buffer.putInt(1728206200); // LTT
        buffer.putFloat(1678.00f); // ATP
        buffer.putInt(4500000); // Volume
        buffer.putInt(120000); // Total Sell Qty
        buffer.putInt(150000); // Total Buy Qty
        buffer.putFloat(1670.00f); // Open
        buffer.putFloat(1695.50f); // High
        buffer.putFloat(1668.00f); // Low
        buffer.putFloat(1675.00f); // Close
        buffer.flip();

        Optional<MarketTick> tickOpt = decoder.decode(buffer);
        assertTrue(tickOpt.isPresent());

        MarketTick tick = tickOpt.get();
        assertEquals("HDFCBANK", tick.symbol());
        assertEquals("1333", tick.securityId());
        assertEquals(new BigDecimal("1680.25"), tick.price());
        assertEquals(new BigDecimal("1670.00"), tick.open());
        assertEquals(new BigDecimal("1695.50"), tick.high());
        assertEquals(new BigDecimal("1668.00"), tick.low());
        assertEquals(new BigDecimal("1675.00"), tick.close());
        assertEquals(4500000L, tick.volume());
    }

    @Test
    void testSegmentMapping() {
        assertEquals("NSE_EQ", DhanBinaryPacketDecoder.mapSegment((byte) 0));
        assertEquals("NSE_FNO", DhanBinaryPacketDecoder.mapSegment((byte) 1));
        assertEquals("BSE_EQ", DhanBinaryPacketDecoder.mapSegment((byte) 3));
        assertEquals("IDX_I", DhanBinaryPacketDecoder.mapSegment((byte) 7));
    }
}
