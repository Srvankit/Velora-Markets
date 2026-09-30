package com.velora.markets.service.market;

import com.velora.markets.dto.HistoricalBarResponse;
import com.velora.markets.dto.MarketStockResponse;
import com.velora.markets.entity.MarketStatus;
import com.velora.markets.entity.Stock;
import com.velora.markets.service.MapperService;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class DefaultMarketDataProvider implements MarketDataProvider {

    private final MapperService mapper;

    public DefaultMarketDataProvider(MapperService mapper) {
        this.mapper = mapper;
    }

    @Override
    public String getProviderName() {
        return "Velora Institutional Market Engine";
    }

    @Override
    public boolean isConfigured() {
        return true;
    }

    @Override
    public MarketStockResponse fetchLiveQuote(Stock stock) {
        MarketStockResponse response = mapper.toMarketStock(stock);
        response.setMarketStatus(MarketStatus.LIVE.name());
        return response;
    }

    @Override
    public List<HistoricalBarResponse> fetchHistoricalBars(Stock stock, String timeframe) {
        int points = getPointsForTimeframe(timeframe);
        double current = stock.getPrice().doubleValue();
        double prev = stock.getPreviousClose().doubleValue();
        double open = stock.getOpenPrice() != null ? stock.getOpenPrice().doubleValue() : prev;
        double high = stock.getHighPrice() != null ? stock.getHighPrice().doubleValue() : Math.max(current, open);
        double low = stock.getLowPrice() != null ? stock.getLowPrice().doubleValue() : Math.min(current, open);
        long vol = stock.getVolume();

        List<HistoricalBarResponse> bars = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Generate deterministic history anchoring to the stock's actual price
        int symbolHash = Math.abs(stock.getSymbol().hashCode());
        double trend = (current - prev) / (points > 1 ? points : 1);

        for (int i = points - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            // Skip weekends
            if (date.getDayOfWeek().getValue() == 6 || date.getDayOfWeek().getValue() == 7) {
                continue;
            }

            double progress = (double) (points - 1 - i) / (points > 1 ? points - 1 : 1);
            double cycle = Math.sin((i + symbolHash % 17) * 0.45) * (current * 0.012);
            double barClose = (i == 0) ? current : (prev - (trend * i) + cycle);
            double barOpen = (i == 0) ? open : (barClose - (trend * 0.5) + (Math.cos(i) * current * 0.006));
            double barHigh = (i == 0) ? Math.max(high, Math.max(barOpen, barClose)) : Math.max(barOpen, barClose) + Math.abs(Math.sin(i * 1.3)) * (current * 0.008);
            double barLow = (i == 0) ? Math.min(low, Math.min(barOpen, barClose)) : Math.min(barOpen, barClose) - Math.abs(Math.cos(i * 1.7)) * (current * 0.008);
            long barVol = (long) (vol * (0.7 + (Math.abs(Math.sin(i)) * 0.6)));

            bars.add(new HistoricalBarResponse(
                date.format(DateTimeFormatter.ISO_LOCAL_DATE),
                bd(barOpen),
                bd(barHigh),
                bd(barLow),
                bd(barClose),
                barVol
            ));
        }

        return bars;
    }

    private int getPointsForTimeframe(String tf) {
        if (tf == null) return 30;
        return switch (tf.toUpperCase()) {
            case "1D" -> 14;
            case "5D" -> 5;
            case "1M" -> 22;
            case "3M" -> 65;
            case "6M" -> 130;
            case "YTD", "1Y" -> 252;
            case "5Y" -> 350;
            case "MAX" -> 500;
            default -> 30;
        };
    }

    private static BigDecimal bd(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP);
    }
}
