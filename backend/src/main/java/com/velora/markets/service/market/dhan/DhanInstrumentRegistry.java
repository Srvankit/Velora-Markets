package com.velora.markets.service.market.dhan;

import com.velora.markets.entity.Exchange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class DhanInstrumentRegistry {

    private static final Logger log = LoggerFactory.getLogger(DhanInstrumentRegistry.class);

    private final String scripMasterUrl;
    private final HttpClient httpClient;
    private final Map<String, DhanInstrument> byExchangeAndSymbol = new ConcurrentHashMap<>();
    private final Map<String, DhanInstrument> bySegmentAndSecId = new ConcurrentHashMap<>();
    private volatile boolean initialized = false;

    public DhanInstrumentRegistry(
        @Value("${velora.market.dhan.scrip-master-url:https://images.dhan.co/api-data/api-scrip-master.csv}") String scripMasterUrl
    ) {
        this.scripMasterUrl = scripMasterUrl;
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
        seedBaselineCanonicalInstruments();
    }

    private void seedBaselineCanonicalInstruments() {
        // High-reliability baseline mappings for canonical Indian bluechips and indices
        // These are enriched / verified automatically by the official Dhan Scrip Master sync.
        registerSeed("2885", "NSE_EQ", "EQUITY", "RELIANCE", "Reliance Industries Limited", Exchange.NSE);
        registerSeed("11536", "NSE_EQ", "EQUITY", "TCS", "Tata Consultancy Services Limited", Exchange.NSE);
        registerSeed("1594", "NSE_EQ", "EQUITY", "INFY", "Infosys Limited", Exchange.NSE);
        registerSeed("1333", "NSE_EQ", "EQUITY", "HDFCBANK", "HDFC Bank Limited", Exchange.NSE);
        registerSeed("4963", "NSE_EQ", "EQUITY", "ICICIBANK", "ICICI Bank Limited", Exchange.NSE);
        registerSeed("3045", "NSE_EQ", "EQUITY", "SBIN", "State Bank of India", Exchange.NSE);
        registerSeed("3456", "NSE_EQ", "EQUITY", "TATAMOTORS", "Tata Motors Limited", Exchange.NSE);
        registerSeed("10999", "NSE_EQ", "EQUITY", "MARUTI", "Maruti Suzuki India Limited", Exchange.NSE);
        registerSeed("10604", "NSE_EQ", "EQUITY", "BHARTIARTL", "Bharti Airtel Limited", Exchange.NSE);
        registerSeed("3351", "NSE_EQ", "EQUITY", "SUNPHARMA", "Sun Pharmaceutical Industries Limited", Exchange.NSE);
        registerSeed("2475", "NSE_EQ", "EQUITY", "ONGC", "Oil and Natural Gas Corporation Limited", Exchange.NSE);
        registerSeed("13", "IDX_I", "INDEX", "NIFTY50", "NIFTY 50", Exchange.NSE);
        registerSeed("13", "IDX_I", "INDEX", "NIFTY 50", "NIFTY 50", Exchange.NSE);
        registerSeed("25", "IDX_I", "INDEX", "BANKNIFTY", "NIFTY Bank", Exchange.NSE);
        registerSeed("25", "IDX_I", "INDEX", "NIFTY BANK", "NIFTY Bank", Exchange.NSE);
    }

    private void registerSeed(String secId, String segment, String instType, String symbol, String name, Exchange exch) {
        DhanInstrument inst = new DhanInstrument(secId, segment, instType, symbol.toUpperCase(Locale.ROOT), name, exch);
        byExchangeAndSymbol.put(makeKey(exch, symbol), inst);
        bySegmentAndSecId.put(makeSecKey(segment, secId), inst);
    }

    public Optional<DhanInstrument> findInstrument(String symbol, Exchange exchange) {
        if (symbol == null || exchange == null) return Optional.empty();
        String key = makeKey(exchange, symbol);
        DhanInstrument direct = byExchangeAndSymbol.get(key);
        if (direct != null) return Optional.of(direct);

        // Normalize common alias patterns (e.g. NIFTY50 vs NIFTY 50)
        String cleaned = symbol.replace(" ", "").replace("-", "").toUpperCase(Locale.ROOT);
        String aliasKey = makeKey(exchange, cleaned);
        return Optional.ofNullable(byExchangeAndSymbol.get(aliasKey));
    }

    public Optional<DhanInstrument> findBySecurityId(String exchangeSegment, String securityId) {
        if (exchangeSegment == null || securityId == null) return Optional.empty();
        return Optional.ofNullable(bySegmentAndSecId.get(makeSecKey(exchangeSegment, securityId)));
    }

    public int getRegisteredCount() {
        return byExchangeAndSymbol.size();
    }

    public boolean isInitialized() {
        return initialized;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Async
    public void onStartup() {
        log.info("Starting background Dhan Scrip Master synchronization from {}", scripMasterUrl);
        syncScripMaster();
    }

    @Scheduled(cron = "0 0 8 * * *", zone = "Asia/Kolkata")
    public void scheduledDailySync() {
        log.info("Running daily scheduled Dhan Scrip Master synchronization...");
        syncScripMaster();
    }

    public synchronized void syncScripMaster() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(scripMasterUrl))
                .timeout(Duration.ofSeconds(30))
                .GET()
                .build();

            HttpResponse<java.io.InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
            if (response.statusCode() == 200) {
                int count = parseScripMasterCsv(response.body());
                initialized = true;
                log.info("Dhan Scrip Master synced successfully. Ingested {} instruments.", count);
            } else {
                log.warn("Dhan Scrip Master HTTP request returned status {}", response.statusCode());
            }
        } catch (Exception e) {
            log.warn("Dhan Scrip Master sync failed: {}. Continuing with baseline canonical instruments.", e.getMessage());
        }
    }

    private int parseScripMasterCsv(java.io.InputStream inputStream) {
        int parsed = 0;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, java.nio.charset.StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null) return 0;

            String[] headers = headerLine.split(",");
            Map<String, Integer> colIndex = new HashMap<>();
            for (int i = 0; i < headers.length; i++) {
                colIndex.put(headers[i].trim().toUpperCase(Locale.ROOT), i);
            }

            Integer exchCol = colIndex.getOrDefault("SEM_EXM_EXCH_ID", colIndex.get("EXCH_ID"));
            Integer segCol = colIndex.getOrDefault("SEM_SEGMENT", colIndex.get("SEGMENT"));
            Integer secIdCol = colIndex.getOrDefault("SEM_SMST_SECURITY_ID", colIndex.get("SECURITY_ID"));
            Integer instNameCol = colIndex.getOrDefault("SEM_INSTRUMENT_NAME", colIndex.get("INSTRUMENT_NAME"));
            Integer symCol = colIndex.getOrDefault("SEM_TRADING_SYMBOL", colIndex.get("TRADING_SYMBOL"));
            Integer customSymCol = colIndex.getOrDefault("SEM_CUSTOM_SYMBOL", colIndex.get("CUSTOM_SYMBOL"));

            if (secIdCol == null || symCol == null) {
                log.warn("Dhan Scrip Master CSV missing required headers. Headers found: {}", Arrays.toString(headers));
                return 0;
            }

            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) continue;
                String[] parts = line.split(",", -1);
                if (parts.length <= secIdCol || parts.length <= symCol) continue;

                String secId = parts[secIdCol].trim();
                String rawSym = parts[symCol].trim();
                if (secId.isBlank() || rawSym.isBlank()) continue;

                String exchStr = (exchCol != null && parts.length > exchCol) ? parts[exchCol].trim().toUpperCase(Locale.ROOT) : "NSE";
                String segStr = (segCol != null && parts.length > segCol) ? parts[segCol].trim().toUpperCase(Locale.ROOT) : "E";
                String instType = (instNameCol != null && parts.length > instNameCol) ? parts[instNameCol].trim().toUpperCase(Locale.ROOT) : "EQUITY";
                String customSym = (customSymCol != null && parts.length > customSymCol) ? parts[customSymCol].trim() : "";

                Exchange exchange = "BSE".equalsIgnoreCase(exchStr) ? Exchange.BSE : Exchange.NSE;
                String exchangeSegment = resolveSegment(exchStr, segStr, instType);

                // Strip standard exchange suffixes if present (e.g. -EQ)
                String cleanSymbol = rawSym.replaceAll("-(EQ|BE|SM|ST)$", "").trim().toUpperCase(Locale.ROOT);
                String displayName = !customSym.isBlank() ? customSym : cleanSymbol;

                DhanInstrument inst = new DhanInstrument(secId, exchangeSegment, instType, cleanSymbol, displayName, exchange);
                byExchangeAndSymbol.put(makeKey(exchange, cleanSymbol), inst);
                bySegmentAndSecId.put(makeSecKey(exchangeSegment, secId), inst);
                parsed++;
            }
        } catch (Exception e) {
            log.warn("Error while parsing Dhan Scrip Master CSV: {}", e.getMessage());
        }
        return parsed;
    }

    private static String resolveSegment(String exch, String seg, String instType) {
        if ("INDEX".equalsIgnoreCase(instType) || "I".equalsIgnoreCase(seg)) {
            return "IDX_I";
        }
        if ("BSE".equalsIgnoreCase(exch)) {
            return "BSE_EQ";
        }
        return "NSE_EQ";
    }

    private static String makeKey(Exchange exchange, String symbol) {
        return (exchange != null ? exchange.name() : "NSE") + ":" + (symbol != null ? symbol.trim().toUpperCase(Locale.ROOT) : "");
    }

    private static String makeSecKey(String segment, String securityId) {
        return (segment != null ? segment.trim().toUpperCase(Locale.ROOT) : "") + ":" + (securityId != null ? securityId.trim() : "");
    }
}
