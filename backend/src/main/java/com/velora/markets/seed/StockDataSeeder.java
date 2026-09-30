package com.velora.markets.seed;

import com.velora.markets.entity.Exchange;
import com.velora.markets.entity.MarketStatus;
import com.velora.markets.entity.Stock;
import com.velora.markets.repository.StockRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StockDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(StockDataSeeder.class);

    private final StockRepository stockRepository;

    public StockDataSeeder(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @Override
    public void run(String... args) {
        List<SeedRow> rows = List.of(
            // US Equities
            row("AAPL", "Apple Inc.", Exchange.NASDAQ, "Technology", "USD", 232.41, 230.10, 234.15, 229.80, 3.18, 48_120_000L),
            row("MSFT", "Microsoft Corporation", Exchange.NASDAQ, "Technology", "USD", 421.27, 418.50, 423.80, 417.90, 2.94, 12_840_000L),
            row("NVDA", "NVIDIA Corporation", Exchange.NASDAQ, "Technology", "USD", 138.60, 140.20, 141.50, 137.40, -1.42, 210_330_000L),
            row("TSLA", "Tesla Inc.", Exchange.NASDAQ, "Automobile", "USD", 251.44, 256.00, 258.90, 249.10, -3.66, 89_410_000L),
            row("AMZN", "Amazon.com Inc.", Exchange.NASDAQ, "Retail", "USD", 201.88, 203.10, 204.50, 200.75, -0.84, 24_910_000L),
            row("META", "Meta Platforms Inc.", Exchange.NASDAQ, "Technology", "USD", 595.94, 591.20, 599.80, 590.10, 4.21, 9_820_000L),
            row("GOOGL", "Alphabet Inc. (Class A)", Exchange.NASDAQ, "Technology", "USD", 179.18, 177.80, 180.40, 176.90, 1.12, 18_240_000L),
            row("NFLX", "Netflix Inc.", Exchange.NASDAQ, "Technology", "USD", 892.50, 883.00, 897.20, 881.50, 8.34, 4_120_000L),
            row("JPM", "JPMorgan Chase & Co.", Exchange.NYSE, "Financials", "USD", 241.82, 240.50, 243.10, 239.90, 0.92, 6_120_000L),
            row("JNJ", "Johnson & Johnson", Exchange.NYSE, "Healthcare", "USD", 155.87, 155.40, 156.80, 154.90, 0.34, 4_820_000L),
            row("WMT", "Walmart Inc.", Exchange.NYSE, "Retail", "USD", 85.42, 84.60, 86.10, 84.30, 0.78, 14_210_000L),
            row("V", "Visa Inc.", Exchange.NYSE, "Financials", "USD", 286.31, 287.00, 288.40, 285.10, -0.51, 5_410_000L),

            // Indian Equities (NSE)
            row("RELIANCE", "Reliance Industries Limited", Exchange.NSE, "Energy", "INR", 1284.50, 1265.00, 1292.00, 1262.30, 18.75, 8_240_000L),
            row("TCS", "Tata Consultancy Services Limited", Exchange.NSE, "Technology", "INR", 4125.30, 4160.00, 4175.50, 4110.00, -32.40, 2_140_000L),
            row("INFY", "Infosys Limited", Exchange.NSE, "Technology", "INR", 1864.20, 1850.00, 1872.40, 1845.00, 12.85, 5_820_000L),
            row("ICICIBANK", "ICICI Bank Limited", Exchange.NSE, "Financials", "INR", 948.65, 942.00, 953.40, 940.10, 6.42, 12_410_000L),
            row("HDFCBANK", "HDFC Bank Limited", Exchange.NSE, "Financials", "INR", 1685.40, 1695.00, 1702.00, 1680.00, -8.12, 9_820_000L),
            row("SBIN", "State Bank of India", Exchange.NSE, "Financials", "INR", 812.30, 807.50, 818.00, 805.00, 4.18, 15_240_000L),
            row("SUNPHARMA", "Sun Pharmaceutical Industries Limited", Exchange.NSE, "Healthcare", "INR", 1782.40, 1758.00, 1790.00, 1754.20, 22.18, 3_410_000L),
            row("TATAMOTORS", "Tata Motors Limited", Exchange.NSE, "Automobile", "INR", 712.40, 723.00, 726.50, 708.90, -9.85, 18_240_000L),
            row("MARUTI", "Maruti Suzuki India Limited", Exchange.NSE, "Automobile", "INR", 11240.50, 11080.00, 11310.00, 11050.00, 145.30, 1_840_000L),
            row("ONGC", "Oil and Natural Gas Corporation Limited", Exchange.NSE, "Energy", "INR", 248.60, 245.00, 251.20, 244.50, 3.42, 7_120_000L),
            row("BHARTIARTL", "Bharti Airtel Limited", Exchange.NSE, "Communication", "INR", 1582.30, 1562.00, 1590.00, 1558.00, 18.40, 6_240_000L),

            // Major Market Indices
            row("NIFTY50", "NIFTY 50", Exchange.NSE, "Index", "INR", 25790.20, 25710.00, 25840.50, 25680.00, 142.60, 245_000_000L),
            row("BANKNIFTY", "NIFTY Bank", Exchange.NSE, "Index", "INR", 54120.40, 53950.00, 54300.00, 53880.00, 310.20, 112_000_000L),
            row("SPX", "S&P 500 Index", Exchange.NYSE, "Index", "USD", 5751.13, 5740.00, 5765.20, 5732.10, 28.45, 1_840_000_000L),
            row("NDX", "NASDAQ-100 Index", Exchange.NASDAQ, "Index", "USD", 20042.80, 19980.00, 20110.00, 19940.00, 114.60, 950_000_000L),
            row("DJI", "Dow Jones Industrial Average", Exchange.NYSE, "Index", "USD", 42313.00, 42180.00, 42420.00, 42110.00, 182.10, 410_000_000L)
        );

        for (SeedRow row : rows) {
            Stock stock = stockRepository.findById(row.symbol()).orElseGet(Stock::new);
            stock.setSymbol(row.symbol());
            stock.setCompanyName(row.companyName());
            stock.setExchange(row.exchange());
            stock.setSector(row.sector());
            stock.setCurrency(row.currency());
            stock.setPrice(bd(row.price()));
            stock.setPreviousClose(bd(row.price() - row.change()));
            stock.setOpenPrice(bd(row.open()));
            stock.setHighPrice(bd(row.high()));
            stock.setLowPrice(bd(row.low()));
            stock.setVolume(row.volume());
            stock.setMarketStatus(MarketStatus.LIVE);
            stockRepository.save(stock);
        }

        log.info("Upserted {} canonical market instruments & indices", rows.size());
    }

    private static SeedRow row(
        String symbol, String companyName, Exchange exchange, String sector, String currency,
        double price, double open, double high, double low, double change, long volume
    ) {
        return new SeedRow(symbol, companyName, exchange, sector, currency, price, open, high, low, change, volume);
    }

    private static BigDecimal bd(double value) {
        return BigDecimal.valueOf(value).setScale(4, RoundingMode.HALF_UP);
    }

    private record SeedRow(
        String symbol,
        String companyName,
        Exchange exchange,
        String sector,
        String currency,
        double price,
        double open,
        double high,
        double low,
        double change,
        long volume
    ) {}
}
