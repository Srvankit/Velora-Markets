import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  CandlestickChart as CandleIcon,
  TrendingUp,
  Activity,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { backendApi, type BackendHistoricalBar } from '@/services/backend';
import {
  computeIndicators,
  DEFAULT_INDICATOR_SETTINGS,
  type IndicatorSettings,
  type ComputedBar,
} from '@/lib/indicators';
import { IndicatorModal } from './IndicatorModal';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

export interface TradingViewChartProps {
  symbol: string;
  companyName: string;
  exchange?: string;
  currentPrice: number;
  previousClose?: number;
  currency?: string;
  marketStatus?: string;
  className?: string;
}

const TIMEFRAMES = [
  { label: '1D', value: '1D' },
  { label: '5D', value: '5D' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: 'YTD', value: 'YTD' },
  { label: '1Y', value: '1Y' },
  { label: '5Y', value: '5Y' },
  { label: 'MAX', value: 'MAX' },
];

type ChartType = 'candles' | 'area' | 'line';

const STORAGE_KEY_INDICATORS = 'velora_chart_indicators';

export function TradingViewChart({
  symbol,
  companyName,
  exchange = 'NSE',
  currentPrice,
  previousClose,
  currency = 'INR',
  marketStatus = 'LIVE',
  className,
}: TradingViewChartProps) {
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [indicatorModalOpen, setIndicatorModalOpen] = useState(false);
  const [rawBars, setRawBars] = useState<BackendHistoricalBar[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Indicators state from localStorage
  const [indicators, setIndicators] = useState<IndicatorSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INDICATORS);
      return saved ? JSON.parse(saved) : DEFAULT_INDICATOR_SETTINGS;
    } catch {
      return DEFAULT_INDICATOR_SETTINGS;
    }
  });

  const saveIndicators = (newSettings: IndicatorSettings) => {
    setIndicators(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY_INDICATORS, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  // Count active indicators
  const activeIndicatorCount = useMemo(() => {
    let count = 0;
    if (indicators.showSma) count++;
    if (indicators.showEma) count++;
    if (indicators.showBollinger) count++;
    if (indicators.showVwap) count++;
    if (indicators.showRsi) count++;
    if (indicators.showMacd) count++;
    return count;
  }, [indicators]);

  // Load bars from backend
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const history = await backendApi.marketStockHistory(symbol, timeframe);
        if (isMounted) {
          if (history && history.length > 0) {
            setRawBars(history);
          } else {
            // Fallback deterministic bar
            setRawBars([
              {
                time: new Date().toISOString().split('T')[0],
                open: previousClose || currentPrice,
                high: Math.max(currentPrice, previousClose || currentPrice),
                low: Math.min(currentPrice, previousClose || currentPrice),
                close: currentPrice,
                volume: 1_000_000,
              },
            ]);
          }
        }
      } catch {
        if (isMounted) {
          setRawBars([
            {
              time: new Date().toISOString().split('T')[0],
              open: previousClose || currentPrice,
              high: currentPrice * 1.01,
              low: currentPrice * 0.99,
              close: currentPrice,
              volume: 1_000_000,
            },
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    void loadData();
    return () => {
      isMounted = false;
    };
  }, [symbol, timeframe, currentPrice, previousClose]);

  // Computed bars with indicators
  const bars: ComputedBar[] = useMemo(() => {
    return computeIndicators(rawBars, indicators);
  }, [rawBars, indicators]);

  const activeBar = hoverIndex !== null && bars[hoverIndex] ? bars[hoverIndex] : bars[bars.length - 1];

  const change = activeBar ? activeBar.close - (previousClose || activeBar.open) : 0;
  const changePct = previousClose && previousClose > 0 ? (change / previousClose) * 100 : 0;
  const isPositive = change >= 0;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        void containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        void document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <Card
      ref={containerRef}
      className={cn(
        'relative flex flex-col overflow-hidden border border-border/80 bg-card/60 backdrop-blur-xl',
        isFullscreen ? 'h-screen w-screen rounded-none p-6 z-50' : 'p-5',
        className,
      )}
    >
      {/* HEADER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
        {/* Instrument Title & Market Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                {companyName}
              </h2>
              <Badge variant="outline" className="border-border/60 bg-muted/30 font-mono text-[11px] uppercase">
                {symbol} · {exchange}
              </Badge>
              <span
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  marketStatus === 'LIVE'
                    ? 'bg-success/15 text-success animate-pulse'
                    : marketStatus === 'DELAYED'
                    ? 'bg-warning/15 text-warning'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', marketStatus === 'LIVE' ? 'bg-success' : 'bg-muted-foreground')} />
                {marketStatus}
              </span>
            </div>

            {/* Price & Change Live Display */}
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {formatCurrency(activeBar ? activeBar.close : currentPrice, currency)}
              </span>
              <span className={cn('flex items-center text-xs font-semibold', isPositive ? 'text-success' : 'text-danger')}>
                {isPositive ? '+' : ''}
                {formatCurrency(change, currency)} ({isPositive ? '+' : ''}
                {changePct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Chart types, Indicators, Fullscreen */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Chart Type Toggle */}
          <div className="flex rounded-lg border border-border/70 bg-muted/30 p-0.5">
            <button
              onClick={() => setChartType('candles')}
              className={cn(
                'flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors',
                chartType === 'candles' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground',
              )}
              title="Candlestick Chart"
            >
              <CandleIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Candles</span>
            </button>
            <button
              onClick={() => setChartType('area')}
              className={cn(
                'flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors',
                chartType === 'area' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground',
              )}
              title="Area Chart"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Area</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={cn(
                'flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors',
                chartType === 'line' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground',
              )}
              title="Line Chart"
            >
              <Activity className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Line</span>
            </button>
          </div>

          {/* Indicators Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIndicatorModalOpen(true)}
            className={cn('h-8 gap-1.5 text-xs', activeIndicatorCount > 0 && 'border-primary/50 text-primary')}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Indicators</span>
            {activeIndicatorCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeIndicatorCount}
              </span>
            )}
          </Button>

          {/* Fullscreen Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* TIMEFRAME SELECTOR BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2.5">
        <div className="flex flex-wrap items-center gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                timeframe === tf.value
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* OHLCV Hover HUD (TradingView Style Bar) */}
        {activeBar && (
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span>
              Date: <strong className="text-foreground">{activeBar.time}</strong>
            </span>
            <span>
              O: <strong className="text-foreground">{activeBar.open.toFixed(2)}</strong>
            </span>
            <span>
              H: <strong className="text-foreground">{activeBar.high.toFixed(2)}</strong>
            </span>
            <span>
              L: <strong className="text-foreground">{activeBar.low.toFixed(2)}</strong>
            </span>
            <span>
              C: <strong className={activeBar.close >= activeBar.open ? 'text-success' : 'text-danger'}>{activeBar.close.toFixed(2)}</strong>
            </span>
            <span>
              Vol: <strong className="text-foreground">{(activeBar.volume / 1_000).toFixed(0)}k</strong>
            </span>
          </div>
        )}
      </div>

      {/* ACTIVE INDICATOR TAGS HUD */}
      {activeIndicatorCount > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
          {indicators.showSma && activeBar?.sma != null && (
            <span className="flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 font-medium text-amber-500">
              SMA ({indicators.smaPeriod}): {activeBar.sma.toFixed(2)}
            </span>
          )}
          {indicators.showEma && activeBar?.ema != null && (
            <span className="flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 font-medium text-cyan-500">
              EMA ({indicators.emaPeriod}): {activeBar.ema.toFixed(2)}
            </span>
          )}
          {indicators.showBollinger && activeBar?.bbUpper != null && activeBar?.bbLower != null && (
            <span className="flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 font-medium text-blue-400">
              BB ({indicators.bbPeriod}, {indicators.bbStdDev}): [{activeBar.bbLower.toFixed(2)} - {activeBar.bbUpper.toFixed(2)}]
            </span>
          )}
          {indicators.showVwap && activeBar?.vwap != null && (
            <span className="flex items-center gap-1 rounded bg-purple-500/10 px-2 py-0.5 font-medium text-purple-400">
              VWAP: {activeBar.vwap.toFixed(2)}
            </span>
          )}
          {indicators.showRsi && activeBar?.rsi != null && (
            <span className="flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 font-medium text-indigo-400">
              RSI ({indicators.rsiPeriod}): {activeBar.rsi.toFixed(2)}
            </span>
          )}
          {indicators.showMacd && activeBar?.macd != null && (
            <span className="flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 font-medium text-rose-400">
              MACD: {activeBar.macd.toFixed(2)} / Sig: {activeBar.macdSignal?.toFixed(2) ?? '—'}
            </span>
          )}
        </div>
      )}

      {/* CHART SVG CANVAS */}
      <div className={cn('relative w-full select-none', isFullscreen ? 'flex-1 min-h-[500px]' : 'h-[360px]')}>
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading real market data for {symbol}...
            </div>
          </div>
        ) : (
          <ChartSvgRenderer
            bars={bars}
            chartType={chartType}
            indicators={indicators}
            currency={currency}
            hoverIndex={hoverIndex}
            onHoverIndex={setHoverIndex}
            isPositive={isPositive}
          />
        )}
      </div>

      {/* INDICATOR CONFIG MODAL */}
      <IndicatorModal
        open={indicatorModalOpen}
        onOpenChange={setIndicatorModalOpen}
        settings={indicators}
        onSave={saveIndicators}
      />
    </Card>
  );
}

interface SvgRendererProps {
  bars: ComputedBar[];
  chartType: ChartType;
  indicators: IndicatorSettings;
  currency: string;
  hoverIndex: number | null;
  onHoverIndex: (idx: number | null) => void;
  isPositive: boolean;
}

function ChartSvgRenderer({
  bars,
  chartType,
  indicators,
  currency,
  hoverIndex,
  onHoverIndex,
  isPositive,
}: SvgRendererProps) {
  const [containerWidth, setContainerWidth] = useState(800);
  const [containerHeight, setContainerHeight] = useState(360);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  const n = bars.length;
  if (n === 0) return null;

  // Split height into panes:
  // Main Price Pane: 65% (or 85% if no subpanes)
  // Subpanes: Volume (15%), RSI (20%), MACD (20%)
  const hasSubpanes = indicators.showRsi || indicators.showMacd || indicators.showVolume;
  const rsiHeight = indicators.showRsi ? 60 : 0;
  const macdHeight = indicators.showMacd ? 60 : 0;
  const volumeHeight = indicators.showVolume ? 45 : 0;
  const totalSubpaneHeight = rsiHeight + macdHeight + volumeHeight;

  const mainHeight = Math.max(containerHeight - totalSubpaneHeight - 30, 160);
  const paddingRight = 60;
  const paddingLeft = 10;
  const plotWidth = containerWidth - paddingRight - paddingLeft;

  // Price Bounds
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  bars.forEach((b) => {
    minPrice = Math.min(minPrice, b.low);
    maxPrice = Math.max(maxPrice, b.high);
    if (b.bbUpper) maxPrice = Math.max(maxPrice, b.bbUpper);
    if (b.bbLower) minPrice = Math.min(minPrice, b.bbLower);
    if (b.sma) {
      minPrice = Math.min(minPrice, b.sma);
      maxPrice = Math.max(maxPrice, b.sma);
    }
    if (b.ema) {
      minPrice = Math.min(minPrice, b.ema);
      maxPrice = Math.max(maxPrice, b.ema);
    }
  });

  const priceMargin = (maxPrice - minPrice) * 0.08 || 1;
  const priceMin = minPrice - priceMargin;
  const priceMax = maxPrice + priceMargin;
  const priceRange = priceMax - priceMin || 1;

  const getX = (i: number) => paddingLeft + (i / Math.max(n - 1, 1)) * plotWidth;
  const getY = (price: number) => 15 + (1 - (price - priceMin) / priceRange) * (mainHeight - 30);

  // Candlestick geometry
  const candleWidth = Math.max(Math.min((plotWidth / n) * 0.75, 16), 3);

  // Volume Bounds
  let maxVol = 1;
  bars.forEach((b) => {
    if (b.volume > maxVol) maxVol = b.volume;
  });

  // Generate Area / Line paths
  const linePath = bars.map((b, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.close).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${getX(n - 1).toFixed(1)} ${mainHeight} L ${getX(0).toFixed(1)} ${mainHeight} Z`;

  // Overlay Paths
  const smaPath = indicators.showSma
    ? bars
        .map((b, i) => (b.sma != null ? `${i === indicators.smaPeriod - 1 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.sma).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  const emaPath = indicators.showEma
    ? bars
        .map((b, i) => (b.ema != null ? `${i === indicators.emaPeriod - 1 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.ema).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  const bbUpperPath = indicators.showBollinger
    ? bars
        .map((b, i) => (b.bbUpper != null ? `${i === indicators.bbPeriod - 1 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.bbUpper).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  const bbLowerPath = indicators.showBollinger
    ? bars
        .map((b, i) => (b.bbLower != null ? `${i === indicators.bbPeriod - 1 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.bbLower).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  const vwapPath = indicators.showVwap
    ? bars
        .map((b, i) => (b.vwap != null ? `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.vwap).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  // Handle Mouse Move for Crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = e.clientX - rect.left - paddingLeft;
    const ratio = Math.max(0, Math.min(clientX / plotWidth, 1));
    const idx = Math.round(ratio * (n - 1));
    onHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    onHoverIndex(null);
  };

  // Y-axis grid ticks
  const gridTicks = [0.1, 0.35, 0.65, 0.9].map((pct) => {
    const val = priceMin + pct * priceRange;
    const y = getY(val);
    return { val, y };
  });

  const currentSubpaneTop = mainHeight + 10;

  return (
    <svg
      ref={svgRef}
      className="h-full w-full cursor-crosshair overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* GRID LINES & Y-AXIS LABELS */}
      {gridTicks.map(({ val, y }, idx) => (
        <g key={idx}>
          <line
            x1={paddingLeft}
            y1={y}
            x2={containerWidth - paddingRight}
            y2={y}
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
          />
          <text
            x={containerWidth - paddingRight + 8}
            y={y + 4}
            fill="hsl(var(--muted-foreground))"
            fontSize="10"
            fontFamily="monospace"
          >
            {val.toFixed(2)}
          </text>
        </g>
      ))}

      {/* BOLLINGER BANDS CLOUD & LINES */}
      {indicators.showBollinger && (
        <>
          <path d={bbUpperPath} fill="none" stroke="#60A5FA" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
          <path d={bbLowerPath} fill="none" stroke="#60A5FA" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.8" />
        </>
      )}

      {/* VWAP LINE */}
      {indicators.showVwap && (
        <path d={vwapPath} fill="none" stroke="#A855F7" strokeWidth="1.5" strokeOpacity="0.9" />
      )}

      {/* SMA LINE */}
      {indicators.showSma && (
        <path d={smaPath} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.9" />
      )}

      {/* EMA LINE */}
      {indicators.showEma && (
        <path d={emaPath} fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.9" />
      )}

      {/* MAIN CHART SERIES */}
      {chartType === 'area' && (
        <>
          <path d={areaPath} fill="url(#areaGradient)" />
          <path d={linePath} fill="none" stroke={isPositive ? '#10B981' : '#EF4444'} strokeWidth="2" />
        </>
      )}

      {chartType === 'line' && (
        <path d={linePath} fill="none" stroke={isPositive ? '#10B981' : '#EF4444'} strokeWidth="2" />
      )}

      {chartType === 'candles' &&
        bars.map((bar, i) => {
          const x = getX(i);
          const yOpen = getY(bar.open);
          const yClose = getY(bar.close);
          const yHigh = getY(bar.high);
          const yLow = getY(bar.low);

          const candlePositive = bar.close >= bar.open;
          const color = candlePositive ? '#10B981' : '#EF4444';
          const top = Math.min(yOpen, yClose);
          const height = Math.max(Math.abs(yClose - yOpen), 1.5);

          return (
            <g key={i}>
              {/* Wick */}
              <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.2" strokeOpacity="0.9" />
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={top}
                width={candleWidth}
                height={height}
                fill={color}
                rx="1"
              />
            </g>
          );
        })}

      {/* VOLUME PANE */}
      {indicators.showVolume && (
        <g>
          <line
            x1={paddingLeft}
            y1={currentSubpaneTop}
            x2={containerWidth - paddingRight}
            y2={currentSubpaneTop}
            stroke="hsl(var(--border))"
            strokeOpacity="0.8"
          />
          <text
            x={paddingLeft + 4}
            y={currentSubpaneTop + 12}
            fill="hsl(var(--muted-foreground))"
            fontSize="9"
            fontWeight="600"
          >
            VOL
          </text>
          {bars.map((b, i) => {
            const x = getX(i);
            const vHeight = (b.volume / maxVol) * (volumeHeight - 14);
            const y = currentSubpaneTop + volumeHeight - vHeight;
            const candlePositive = b.close >= b.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x - candleWidth / 2}
                y={y}
                width={candleWidth}
                height={vHeight}
                fill={candlePositive ? '#10B981' : '#EF4444'}
                opacity={hoverIndex === i ? '0.9' : '0.4'}
              />
            );
          })}
        </g>
      )}

      {/* RSI PANE */}
      {indicators.showRsi && (() => {
        const paneTop = indicators.showVolume ? currentSubpaneTop + volumeHeight + 10 : currentSubpaneTop;
        const rsiY = (val: number) => paneTop + (1 - val / 100) * rsiHeight;
        const rsiPath = bars
          .map((b, i) => (b.rsi != null ? `${i === indicators.rsiPeriod ? 'M' : 'L'} ${getX(i).toFixed(1)} ${rsiY(b.rsi).toFixed(1)}` : ''))
          .filter(Boolean)
          .join(' ');

        return (
          <g>
            <line x1={paddingLeft} y1={paneTop} x2={containerWidth - paddingRight} y2={paneTop} stroke="hsl(var(--border))" strokeOpacity="0.8" />
            <text x={paddingLeft + 4} y={paneTop + 12} fill="#818CF8" fontSize="9" fontWeight="600">
              RSI ({indicators.rsiPeriod})
            </text>
            {/* 70/30 reference lines */}
            <line x1={paddingLeft} y1={rsiY(70)} x2={containerWidth - paddingRight} y2={rsiY(70)} stroke="#EF4444" strokeDasharray="2 2" strokeOpacity="0.5" />
            <line x1={paddingLeft} y1={rsiY(30)} x2={containerWidth - paddingRight} y2={rsiY(30)} stroke="#10B981" strokeDasharray="2 2" strokeOpacity="0.5" />
            <text x={containerWidth - paddingRight + 4} y={rsiY(70) + 3} fill="#EF4444" fontSize="8">70</text>
            <text x={containerWidth - paddingRight + 4} y={rsiY(30) + 3} fill="#10B981" fontSize="8">30</text>
            <path d={rsiPath} fill="none" stroke="#818CF8" strokeWidth="1.5" />
          </g>
        );
      })()}

      {/* MACD PANE */}
      {indicators.showMacd && (() => {
        const paneTop =
          currentSubpaneTop +
          (indicators.showVolume ? volumeHeight + 10 : 0) +
          (indicators.showRsi ? rsiHeight + 10 : 0);

        let macdMax = 1;
        bars.forEach((b) => {
          if (b.macd != null) macdMax = Math.max(macdMax, Math.abs(b.macd));
          if (b.macdSignal != null) macdMax = Math.max(macdMax, Math.abs(b.macdSignal));
          if (b.macdHist != null) macdMax = Math.max(macdMax, Math.abs(b.macdHist));
        });

        const macdY = (val: number) => paneTop + macdHeight / 2 - (val / (macdMax * 1.2 || 1)) * (macdHeight / 2);

        const macdLinePath = bars
          .map((b, i) => (b.macd != null ? `${i === indicators.macdSlow ? 'M' : 'L'} ${getX(i).toFixed(1)} ${macdY(b.macd).toFixed(1)}` : ''))
          .filter(Boolean)
          .join(' ');

        const macdSigPath = bars
          .map((b, i) => (b.macdSignal != null ? `${i === indicators.macdSlow + indicators.macdSignal ? 'M' : 'L'} ${getX(i).toFixed(1)} ${macdY(b.macdSignal).toFixed(1)}` : ''))
          .filter(Boolean)
          .join(' ');

        return (
          <g>
            <line x1={paddingLeft} y1={paneTop} x2={containerWidth - paddingRight} y2={paneTop} stroke="hsl(var(--border))" strokeOpacity="0.8" />
            <text x={paddingLeft + 4} y={paneTop + 12} fill="#F43F5E" fontSize="9" fontWeight="600">
              MACD (12, 26, 9)
            </text>
            <line x1={paddingLeft} y1={paneTop + macdHeight / 2} x2={containerWidth - paddingRight} y2={paneTop + macdHeight / 2} stroke="hsl(var(--border))" strokeDasharray="2 2" strokeOpacity="0.5" />

            {/* Histogram bars */}
            {bars.map((b, i) => {
              if (b.macdHist == null) return null;
              const x = getX(i);
              const zeroY = paneTop + macdHeight / 2;
              const targetY = macdY(b.macdHist);
              const h = Math.abs(targetY - zeroY);
              const isHistPos = b.macdHist >= 0;
              return (
                <rect
                  key={`macd-h-${i}`}
                  x={x - candleWidth / 2}
                  y={isHistPos ? targetY : zeroY}
                  width={candleWidth}
                  height={Math.max(h, 1)}
                  fill={isHistPos ? '#10B981' : '#EF4444'}
                  opacity="0.6"
                />
              );
            })}

            <path d={macdLinePath} fill="none" stroke="#3B82F6" strokeWidth="1.5" />
            <path d={macdSigPath} fill="none" stroke="#F97316" strokeWidth="1.5" />
          </g>
        );
      })()}

      {/* CROSSHAIR CURSOR & TRACKER */}
      {hoverIndex !== null && hoverIndex >= 0 && hoverIndex < n && (
        <g>
          {/* Vertical line */}
          <line
            x1={getX(hoverIndex)}
            y1={0}
            x2={getX(hoverIndex)}
            y2={containerHeight}
            stroke="hsl(var(--foreground))"
            strokeDasharray="3 3"
            strokeOpacity="0.6"
            strokeWidth="1"
          />
          {/* Horizontal line */}
          <line
            x1={paddingLeft}
            y1={getY(bars[hoverIndex].close)}
            x2={containerWidth - paddingRight}
            y2={getY(bars[hoverIndex].close)}
            stroke="hsl(var(--foreground))"
            strokeDasharray="3 3"
            strokeOpacity="0.6"
            strokeWidth="1"
          />
          {/* Active Price Badge on Right Axis */}
          <rect
            x={containerWidth - paddingRight + 2}
            y={getY(bars[hoverIndex].close) - 9}
            width={52}
            height={18}
            fill="hsl(var(--foreground))"
            rx="3"
          />
          <text
            x={containerWidth - paddingRight + 28}
            y={getY(bars[hoverIndex].close) + 3}
            fill="hsl(var(--background))"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {bars[hoverIndex].close.toFixed(2)}
          </text>
        </g>
      )}
    </svg>
  );
}
