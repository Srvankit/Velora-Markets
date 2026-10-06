package com.velora.markets.service.market.dhan;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Optional;

public class DhanBinaryPacketDecoder {

    private static final Logger log = LoggerFactory.getLogger(DhanBinaryPacketDecoder.class);

    public static final byte FEED_CODE_TICKER = 2;
    public static final byte FEED_CODE_QUOTE = 4;
    public static final byte FEED_CODE_DISCONNECT = 50;

    private final DhanInstrumentRegistry registry;

    public DhanBinaryPacketDecoder(DhanInstrumentRegistry registry) {
        this.registry = registry;
    }

    public Optional<MarketTick> decode(ByteBuffer buffer) {
        if (buffer == null || buffer.remaining() < 16) {
            return Optional.empty();
        }

        buffer.order(ByteOrder.LITTLE_ENDIAN);
        byte feedCode = buffer.get();

        if (feedCode == FEED_CODE_TICKER) {
            return decodeTicker(buffer);
        } else if (feedCode == FEED_CODE_QUOTE) {
            return decodeQuote(buffer);
        } else if (feedCode == FEED_CODE_DISCONNECT) {
            log.info("Received Dhan disconnect frame (Feed Code 50)");
            return Optional.empty();
        }

        return Optional.empty();
    }

    private Optional<MarketTick> decodeTicker(ByteBuffer buffer) {
        if (buffer.remaining() < 15) return Optional.empty();

        short msgLength = buffer.getShort();
        byte exchSegByte = buffer.get();
        int securityId = buffer.getInt();
        float ltp = buffer.getFloat();
        int ltt = buffer.getInt();

        String segment = mapSegment(exchSegByte);
        String secIdStr = String.valueOf(securityId);
        Optional<DhanInstrument> instOpt = registry.findBySecurityId(segment, secIdStr);
        String symbol = instOpt.map(DhanInstrument::symbol).orElse(secIdStr);

        long epochMilli = ltt > 0 ? ((long) ltt) * 1000L : System.currentTimeMillis();
        BigDecimal price = bd(ltp);

        return Optional.of(new MarketTick(
            symbol,
            secIdStr,
            segment,
            price,
            null, // open
            null, // high
            null, // low
            price, // close
            0L, // volume
            epochMilli
        ));
    }

    private Optional<MarketTick> decodeQuote(ByteBuffer buffer) {
        if (buffer.remaining() < 49) return Optional.empty();

        short msgLength = buffer.getShort();
        byte exchSegByte = buffer.get();
        int securityId = buffer.getInt();
        float ltp = buffer.getFloat();
        short ltq = buffer.getShort();
        int ltt = buffer.getInt();
        float atp = buffer.getFloat();
        int volume = buffer.getInt();
        int totalSellQty = buffer.getInt();
        int totalBuyQty = buffer.getInt();
        float open = buffer.getFloat();
        float high = buffer.getFloat();
        float low = buffer.getFloat();
        float close = buffer.getFloat();

        String segment = mapSegment(exchSegByte);
        String secIdStr = String.valueOf(securityId);
        Optional<DhanInstrument> instOpt = registry.findBySecurityId(segment, secIdStr);
        String symbol = instOpt.map(DhanInstrument::symbol).orElse(secIdStr);

        long epochMilli = ltt > 0 ? ((long) ltt) * 1000L : System.currentTimeMillis();
        BigDecimal price = bd(ltp);

        return Optional.of(new MarketTick(
            symbol,
            secIdStr,
            segment,
            price,
            bd(open),
            bd(high),
            bd(low),
            bd(close),
            volume > 0 ? (long) volume : 0L,
            epochMilli
        ));
    }

    public static String mapSegment(byte code) {
        return switch (code) {
            case 0 -> "NSE_EQ";
            case 1 -> "NSE_FNO";
            case 2 -> "NSE_CURR";
            case 3 -> "BSE_EQ";
            case 4 -> "MCX_COMM";
            case 5 -> "BSE_CURR";
            case 6 -> "BSE_FNO";
            case 7 -> "IDX_I";
            default -> "NSE_EQ";
        };
    }

    public static byte mapSegmentToCode(String segment) {
        if (segment == null) return 0;
        return switch (segment.toUpperCase()) {
            case "NSE_EQ" -> (byte) 0;
            case "NSE_FNO" -> (byte) 1;
            case "NSE_CURR" -> (byte) 2;
            case "BSE_EQ" -> (byte) 3;
            case "MCX_COMM" -> (byte) 4;
            case "BSE_CURR" -> (byte) 5;
            case "BSE_FNO" -> (byte) 6;
            case "IDX_I" -> (byte) 7;
            default -> (byte) 0;
        };
    }

    private static BigDecimal bd(float value) {
        if (Float.isNaN(value) || Float.isInfinite(value)) return BigDecimal.ZERO;
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP);
    }
}
