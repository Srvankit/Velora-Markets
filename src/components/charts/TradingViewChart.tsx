import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  CandlestickChart as CandleIcon,
  TrendingUp,
  Activity,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  X,
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
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [indicatorModalOpen, setIndicatorModalOpen] = useState(false);
  const [rawBars, setRawBars] = useState<BackendHistoricalBar[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Zoom & Pan state
  // visibleCount: number of candles displayed in view
  // offset: index offset from the most recent candle (0 = latest candle at right edge)
  const [visibleCount, setVisibleCount] = useState(60);
  const [offset, setOffset] = useState(0);

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

  // Load bars from backend & auto-refresh during market hours
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const history = await backendApi.marketStockHistory(symbol, timeframe);
        if (isMounted) {
          if (history && history.length > 0) {
            setRawBars(history);
            // Default fit on initial timeframe load
            const initialCount = Math.min(history.length, history.length > 120 ? 80 : history.length);
            setVisibleCount(Math.max(15, initialCount));
            setOffset(0);
          } else {
            setRawBars([]);
          }
        }
      } catch {
        if (isMounted) {
          setRawBars([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    setLoading(true);
    void loadData();

    let intervalId: NodeJS.Timeout | null = null;
    if (marketStatus === 'LIVE' || timeframe === '1D') {
      intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          void loadData();
        }
      }, 15000);
    }

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [symbol, timeframe, marketStatus]);

  // Compute indicators on the entire dataset first for mathematical continuity
  const computedBars: ComputedBar[] = useMemo(() => {
    return computeIndicators(rawBars, indicators);
  }, [rawBars, indicators]);

  const totalBars = computedBars.length;

  // Compute sliced visible window based on visibleCount and offset
  const { visibleBars } = useMemo(() => {
    if (totalBars === 0) {
      return { visibleBars: [], startIndex: 0, endIndex: 0 };
    }
    const end = Math.max(1, totalBars - offset);
    const start = Math.max(0, end - visibleCount);
    return {
      visibleBars: computedBars.slice(start, end),
      startIndex: start,
      endIndex: end,
    };
  }, [computedBars, totalBars, offset, visibleCount]);

  // Reset zoom & pan to default
  const handleResetView = useCallback(() => {
    setOffset(0);
    const defaultCount = Math.min(totalBars, totalBars > 120 ? 80 : totalBars);
    setVisibleCount(Math.max(15, defaultCount || 50));
  }, [totalBars]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setVisibleCount((prev) => Math.max(10, Math.round(prev * 0.75)));
  }, []);

  const handleZoomOut = useCallback(() => {
    setVisibleCount((prev) => Math.min(totalBars, Math.round(prev * 1.35)));
  }, [totalBars]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        void containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        void document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const step = e.ctrlKey || e.metaKey ? 10 : 1;
        setOffset((prev) => Math.min(Math.max(0, totalBars - visibleCount), prev + step));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const step = e.ctrlKey || e.metaKey ? 10 : 1;
        setOffset((prev) => Math.max(0, prev - step));
      } else if (e.key === 'ArrowUp' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === 'ArrowDown' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setOffset(0);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetView();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === '1') {
        setTimeframe('1D');
      } else if (e.key === '5') {
        setTimeframe('5D');
      } else if (e.key === 'm' || e.key === 'M') {
        setTimeframe('1M');
      } else if (e.key === 'y' || e.key === 'Y') {
        setTimeframe('1Y');
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalBars, visibleCount, handleZoomIn, handleZoomOut, handleResetView, toggleFullscreen, isFullscreen]);

  // Active bar resolution for HUD
  const activeBar =
    hoverIndex !== null && visibleBars[hoverIndex]
      ? visibleBars[hoverIndex]
      : visibleBars[visibleBars.length - 1];

  const latestBar = visibleBars[visibleBars.length - 1];
  const displayPrice = activeBar ? activeBar.close : (latestBar ? latestBar.close : currentPrice);
  const change = activeBar ? activeBar.close - (previousClose || activeBar.open) : (latestBar ? latestBar.close - (previousClose || latestBar.open) : 0);
  const changePct = previousClose && previousClose > 0 ? (change / previousClose) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <Card
      ref={containerRef}
      className={cn(
        'relative flex flex-col overflow-hidden border border-border/80 bg-card/70 backdrop-blur-xl transition-all',
        isFullscreen
          ? 'fixed inset-0 z-50 h-screen w-screen rounded-none p-4 sm:p-6 bg-background'
          : 'p-4 sm:p-5 min-h-[500px]',
        className,
      )}
    >
      {/* HEADER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
        {/* Instrument Title & Market Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                {companyName}
              </h2>
              <Badge variant="outline" className="border-border/60 bg-muted/40 font-mono text-[11px] uppercase">
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
                {marketStatus === 'LIVE' ? 'LIVE' : marketStatus === 'DELAYED' ? 'DELAYED' : 'MARKET CLOSED'}
              </span>
            </div>

            {/* Price & Change Live Display */}
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {formatCurrency(displayPrice, currency)}
              </span>
              <span className={cn('flex items-center text-xs font-semibold', isPositive ? 'text-success' : 'text-danger')}>
                {isPositive ? '+' : ''}
                {formatCurrency(change, currency)} ({isPositive ? '+' : ''}
                {changePct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar: Chart types, Zoom, Indicators, Shortcuts, Fullscreen */}
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

          {/* Quick Zoom & Fit Controls */}
          <div className="flex rounded-lg border border-border/70 bg-muted/30 p-0.5">
            <button
              onClick={handleZoomIn}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              title="Zoom In (Ctrl + ↑)"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              title="Zoom Out (Ctrl + ↓)"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
              title="Reset / Fit View (R)"
            >
              <RotateCcw className="h-3.5 w-3.5" />
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

          {/* Keyboard Shortcuts Help Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShortcutsHelp((v) => !v)}
            className={cn('h-8 w-8 text-muted-foreground hover:text-foreground', showShortcutsHelp && 'text-primary bg-primary/10')}
            title="Keyboard Shortcuts"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Fullscreen Button */}
          <Button
            variant={isFullscreen ? 'default' : 'ghost'}
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 gap-1.5 text-xs font-semibold"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Expand'}</span>
          </Button>
        </div>
      </div>

      {/* TIMEFRAME SELECTOR & OHLCV HUD BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2">
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

        {/* OHLCV Crosshair HUD (Brokerage-Style live bar) */}
        {activeBar && (
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span>
              Time: <strong className="text-foreground">{activeBar.time}</strong>
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

      {/* ACTIVE INDICATOR HUD */}
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

      {/* SHORTCUTS HELP OVERLAY */}
      {showShortcutsHelp && (
        <div className="absolute right-4 top-16 z-30 w-72 rounded-xl border border-border bg-card/95 p-3.5 shadow-xl backdrop-blur-xl text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-foreground border-b border-border/50 pb-1.5">
            <span>Chart Keyboard Navigation</span>
            <button onClick={() => setShowShortcutsHelp(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-muted-foreground">
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">← / →</kbd> Pan 1 bar</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl + ← / →</kbd> Fast pan</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl + ↑ / ↓</kbd> Zoom In/Out</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Mouse Wheel</kbd> Zoom</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Shift + Wheel</kbd> Horizontal pan</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Click + Drag</kbd> Pan view</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Double-Click</kbd> Fit / Reset</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Home</kbd> Latest candle</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">R</kbd> Reset view</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">F</kbd> Fullscreen</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">1 / 5 / M / Y</kbd> Timeframes</div>
            <div><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> Exit Fullscreen</div>
          </div>
        </div>
      )}

      {/* CHART SVG CANVAS & RENDERER */}
      <div className={cn('relative w-full select-none', isFullscreen ? 'flex-1 min-h-[500px]' : 'h-[420px] sm:h-[460px]')}>
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading real market data for {symbol}...
            </div>
          </div>
        ) : (
          <ChartSvgRenderer
            bars={visibleBars}
            totalBars={totalBars}
            chartType={chartType}
            indicators={indicators}
            currency={currency}
            marketStatus={marketStatus}
            currentPrice={currentPrice}
            hoverIndex={hoverIndex}
            onHoverIndex={setHoverIndex}
            isPositive={isPositive}
            onPan={(deltaCandles) => {
              setOffset((prev) => Math.max(0, Math.min(Math.max(0, totalBars - visibleCount), prev + deltaCandles)));
            }}
            onZoom={(zoomDelta, cursorRatio) => {
              setVisibleCount((prev) => {
                const next = Math.max(10, Math.min(totalBars, prev + zoomDelta));
                const countDiff = next - prev;
                if (countDiff !== 0) {
                  setOffset((oldOffset) =>
                    Math.max(0, Math.min(Math.max(0, totalBars - next), Math.round(oldOffset - countDiff * (1 - cursorRatio))))
                  );
                }
                return next;
              });
            }}
            onResetView={handleResetView}
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
  totalBars: number;
  chartType: ChartType;
  indicators: IndicatorSettings;
  currency: string;
  marketStatus: string;
  currentPrice: number;
  hoverIndex: number | null;
  onHoverIndex: (idx: number | null) => void;
  isPositive: boolean;
  onPan: (deltaCandles: number) => void;
  onZoom: (zoomDelta: number, cursorRatio: number) => void;
  onResetView: () => void;
}

function ChartSvgRenderer({
  bars,
  chartType,
  indicators,
  marketStatus,
  currentPrice,
  hoverIndex,
  onHoverIndex,
  isPositive,
  onPan,
  onZoom,
  onResetView,
}: SvgRendererProps) {
  const [containerWidth, setContainerWidth] = useState(800);
  const [containerHeight, setContainerHeight] = useState(420);
  const svgRef = useRef<SVGSVGElement>(null);

  // Drag pan tracking
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ clientX: number } | null>(null);

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

  if (n === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <Activity className="mb-2 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-medium">Provider market data is currently unavailable for this timeframe.</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Status: <span className="font-semibold uppercase">{marketStatus}</span>. Waiting for live provider feed.
        </p>
      </div>
    );
  }

  // Panes allocation:
  // Subpanes: Volume (45px), RSI (55px), MACD (55px)
  const rsiHeight = indicators.showRsi ? 55 : 0;
  const macdHeight = indicators.showMacd ? 55 : 0;
  const volumeHeight = indicators.showVolume ? 45 : 0;
  const timeAxisHeight = 24;
  const totalSubpaneHeight = rsiHeight + macdHeight + volumeHeight + timeAxisHeight;

  const mainHeight = Math.max(containerHeight - totalSubpaneHeight - 10, 180);
  const paddingRight = 65; // Price Axis width
  const paddingLeft = 12;
  const plotWidth = Math.max(containerWidth - paddingRight - paddingLeft, 100);

  // Price Bounds Calculation across visible window
  let minPrice = Infinity;
  let maxPrice = -Infinity;

  bars.forEach((b) => {
    minPrice = Math.min(minPrice, b.low);
    maxPrice = Math.max(maxPrice, b.high);
    if (b.bbUpper != null) maxPrice = Math.max(maxPrice, b.bbUpper);
    if (b.bbLower != null) minPrice = Math.min(minPrice, b.bbLower);
    if (b.sma != null) {
      minPrice = Math.min(minPrice, b.sma);
      maxPrice = Math.max(maxPrice, b.sma);
    }
    if (b.ema != null) {
      minPrice = Math.min(minPrice, b.ema);
      maxPrice = Math.max(maxPrice, b.ema);
    }
    if (b.vwap != null) {
      minPrice = Math.min(minPrice, b.vwap);
      maxPrice = Math.max(maxPrice, b.vwap);
    }
  });

  if (!isFinite(minPrice) || !isFinite(maxPrice)) {
    minPrice = currentPrice * 0.95;
    maxPrice = currentPrice * 1.05;
  }

  const priceMargin = (maxPrice - minPrice) * 0.08 || 1;
  const priceMin = minPrice - priceMargin;
  const priceMax = maxPrice + priceMargin;
  const priceRange = priceMax - priceMin || 1;

  // Geometry coordinate transforms
  const candleSpacing = plotWidth / Math.max(n, 1);
  const candleWidth = Math.max(Math.min(candleSpacing * 0.72, 22), 2.5);

  const getX = (i: number) => paddingLeft + (i + 0.5) * candleSpacing;
  const getY = (price: number) => 12 + (1 - (price - priceMin) / priceRange) * (mainHeight - 24);

  // Volume bounds
  let maxVol = 1;
  bars.forEach((b) => {
    if (b.volume > maxVol) maxVol = b.volume;
  });

  // Paths for Line / Area
  const linePath = bars.map((b, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.close).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${getX(n - 1).toFixed(1)} ${mainHeight} L ${getX(0).toFixed(1)} ${mainHeight} Z`;

  // Indicator Paths
  const smaPath = indicators.showSma
    ? bars
        .map((b, i) => (b.sma != null ? `${i === 0 || bars[i - 1]?.sma == null ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.sma).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  const emaPath = indicators.showEma
    ? bars
        .map((b, i) => (b.ema != null ? `${i === 0 || bars[i - 1]?.ema == null ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.ema).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  const bbUpperPath = indicators.showBollinger
    ? bars
        .map((b, i) => (b.bbUpper != null ? `${i === 0 || bars[i - 1]?.bbUpper == null ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.bbUpper).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  const bbLowerPath = indicators.showBollinger
    ? bars
        .map((b, i) => (b.bbLower != null ? `${i === 0 || bars[i - 1]?.bbLower == null ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.bbLower).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  const vwapPath = indicators.showVwap
    ? bars
        .map((b, i) => (b.vwap != null ? `${i === 0 || bars[i - 1]?.vwap == null ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(b.vwap).toFixed(1)}` : ''))
        .filter(Boolean)
        .join(' ')
    : '';

  // Wheel zoom / pan handler
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    const clientX = rect ? e.clientX - rect.left - paddingLeft : plotWidth / 2;
    const cursorRatio = Math.max(0, Math.min(clientX / plotWidth, 1));

    if (e.shiftKey) {
      // Horizontal pan with Shift + Wheel
      const panDelta = Math.round(e.deltaY / 20) || (e.deltaY > 0 ? 2 : -2);
      onPan(panDelta);
    } else {
      // Zoom in/out around cursor position
      const zoomDelta = Math.round(e.deltaY / 25) || (e.deltaY > 0 ? 4 : -4);
      onZoom(zoomDelta, cursorRatio);
    }
  };

  // Mouse Drag to Pan
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    dragStartRef.current = { clientX: e.clientX };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isDragging && dragStartRef.current) {
      const deltaPixels = e.clientX - dragStartRef.current.clientX;
      const deltaCandles = Math.round(deltaPixels / candleSpacing);
      if (Math.abs(deltaCandles) >= 1) {
        onPan(deltaCandles);
        dragStartRef.current = { clientX: e.clientX };
      }
    }

    const clientX = e.clientX - rect.left - paddingLeft;
    const ratio = Math.max(0, Math.min(clientX / plotWidth, 1));
    const idx = Math.min(n - 1, Math.max(0, Math.floor(ratio * n)));
    onHoverIndex(idx);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
    onHoverIndex(null);
  };

  // Y-axis price ticks (5 evenly spaced price levels)
  const priceTicks = [0.1, 0.3, 0.5, 0.7, 0.9].map((pct) => {
    const val = priceMin + pct * priceRange;
    const y = getY(val);
    return { val, y };
  });

  // X-axis time ticks (5-6 evenly spaced timestamps across visible window)
  const timeTicks = useMemo(() => {
    if (n === 0) return [];
    const count = Math.min(n, 6);
    const step = Math.max(1, Math.floor(n / count));
    const ticks: { text: string; x: number }[] = [];
    for (let i = 0; i < n; i += step) {
      const dateStr = bars[i]?.time || '';
      // Format: if intraday (contains space or T with time), show HH:mm; else show MMM DD
      let label = dateStr;
      if (dateStr.includes(' ') || dateStr.includes('T')) {
        const timePart = dateStr.split(/[\sT]/)[1];
        label = timePart ? timePart.slice(0, 5) : dateStr;
      } else if (dateStr.length >= 10) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const m = parseInt(parts[1], 10) - 1;
          label = `${monthNames[m] || parts[1]} ${parts[2]}`;
        }
      }
      ticks.push({ text: label, x: getX(i) });
    }
    return ticks;
  }, [bars, n]);

  // Dynamic pane heights
  let currentTop = mainHeight;

  return (
    <svg
      ref={svgRef}
      className={cn(
        'h-full w-full select-none overflow-visible',
        isDragging ? 'cursor-grabbing' : 'cursor-crosshair',
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={onResetView}
    >
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.25" />
          <stop offset="100%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* BACKGROUND GRID LINES & Y-AXIS PRICE LABELS */}
      {priceTicks.map(({ val, y }, idx) => (
        <g key={`price-grid-${idx}`}>
          <line
            x1={paddingLeft}
            y1={y}
            x2={containerWidth - paddingRight}
            y2={y}
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
            strokeOpacity="0.45"
          />
          <text
            x={containerWidth - paddingRight + 8}
            y={y + 3.5}
            fill="hsl(var(--muted-foreground))"
            fontSize="10"
            fontFamily="monospace"
          >
            {val.toFixed(2)}
          </text>
        </g>
      ))}

      {/* TIME DIVISION VERTICAL GRID LINES */}
      {timeTicks.map(({ x }, idx) => (
        <line
          key={`time-grid-${idx}`}
          x1={x}
          y1={10}
          x2={x}
          y2={mainHeight}
          stroke="hsl(var(--border))"
          strokeDasharray="3 3"
          strokeOpacity="0.3"
        />
      ))}

      {/* RIGHT AXIS SEPARATOR LINE */}
      <line
        x1={containerWidth - paddingRight}
        y1={0}
        x2={containerWidth - paddingRight}
        y2={containerHeight}
        stroke="hsl(var(--border))"
        strokeOpacity="0.6"
      />

      {/* BOTTOM SEPARATOR LINE FOR MAIN PRICE PANE */}
      <line
        x1={paddingLeft}
        y1={mainHeight}
        x2={containerWidth - paddingRight}
        y2={mainHeight}
        stroke="hsl(var(--border))"
        strokeOpacity="0.8"
      />

      {/* CURRENT LIVE PRICE RAY & BADGE */}
      {bars.length > 0 && (() => {
        const lastBar = bars[bars.length - 1];
        const curY = getY(lastBar.close);
        const isUp = lastBar.close >= lastBar.open;
        return (
          <g>
            <line
              x1={paddingLeft}
              y1={curY}
              x2={containerWidth - paddingRight}
              y2={curY}
              stroke={isUp ? '#10B981' : '#EF4444'}
              strokeDasharray="2 2"
              strokeOpacity="0.7"
              strokeWidth="1.2"
            />
            {/* Live Price Tag on Right Price Axis */}
            <rect
              x={containerWidth - paddingRight + 2}
              y={curY - 9}
              width={56}
              height={18}
              fill={isUp ? '#10B981' : '#EF4444'}
              rx="3"
            />
            <text
              x={containerWidth - paddingRight + 30}
              y={curY + 3.5}
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {lastBar.close.toFixed(2)}
            </text>
          </g>
        );
      })()}

      {/* CHART CONTENT: AREA OR LINE */}
      {chartType === 'area' && (
        <g>
          <path d={areaPath} fill="url(#areaGradient)" />
          <path d={linePath} fill="none" stroke={isPositive ? '#10B981' : '#EF4444'} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {chartType === 'line' && (
        <path d={linePath} fill="none" stroke={isPositive ? '#10B981' : '#EF4444'} strokeWidth="2" strokeLinecap="round" />
      )}

      {/* CHART CONTENT: CANDLESTICKS */}
      {chartType === 'candles' &&
        bars.map((b, i) => {
          const x = getX(i);
          const isUp = b.close >= b.open;
          const openY = getY(b.open);
          const closeY = getY(b.close);
          const highY = getY(b.high);
          const lowY = getY(b.low);

          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(closeY - openY), 1.5);
          const candleColor = isUp ? '#10B981' : '#EF4444';

          return (
            <g key={`candle-${i}`}>
              {/* High - Low Wick */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={candleColor}
                strokeWidth={candleWidth > 6 ? 1.5 : 1}
                strokeLinecap="round"
              />
              {/* Candle Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={candleColor}
                rx={candleWidth > 8 ? 1 : 0}
              />
            </g>
          );
        })}

      {/* TECHNICAL INDICATOR OVERLAYS ON PRICE PANE */}
      {smaPath && <path d={smaPath} fill="none" stroke="#F59E0B" strokeWidth="1.5" />}
      {emaPath && <path d={emaPath} fill="none" stroke="#06B6D4" strokeWidth="1.5" />}
      {bbUpperPath && <path d={bbUpperPath} fill="none" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="3 3" />}
      {bbLowerPath && <path d={bbLowerPath} fill="none" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="3 3" />}
      {vwapPath && <path d={vwapPath} fill="none" stroke="#C084FC" strokeWidth="1.5" />}

      {/* SUBPANE 1: VOLUME PANEL */}
      {indicators.showVolume && (() => {
        const paneTop = currentTop + 6;
        currentTop += volumeHeight + 6;
        const volScaleY = (v: number) => paneTop + volumeHeight - (v / (maxVol || 1)) * (volumeHeight - 8);

        return (
          <g>
            <line x1={paddingLeft} y1={paneTop} x2={containerWidth - paddingRight} y2={paneTop} stroke="hsl(var(--border))" strokeOpacity="0.6" />
            <text x={paddingLeft + 4} y={paneTop + 10} fill="hsl(var(--muted-foreground))" fontSize="9" fontWeight="600">
              VOL ({(maxVol / 1000).toFixed(0)}k)
            </text>
            {bars.map((b, i) => {
              const x = getX(i);
              const isUp = b.close >= b.open;
              const y = volScaleY(b.volume);
              const h = Math.max(paneTop + volumeHeight - y, 1);
              return (
                <rect
                  key={`vol-${i}`}
                  x={x - candleWidth / 2}
                  y={y}
                  width={candleWidth}
                  height={h}
                  fill={isUp ? '#10B981' : '#EF4444'}
                  opacity="0.55"
                />
              );
            })}
          </g>
        );
      })()}

      {/* SUBPANE 2: RSI PANEL */}
      {indicators.showRsi && (() => {
        const paneTop = currentTop + 6;
        currentTop += rsiHeight + 6;
        const rsiY = (val: number) => paneTop + rsiHeight - (val / 100) * rsiHeight;

        const rsiLinePath = bars
          .map((b, i) => (b.rsi != null ? `${i === indicators.rsiPeriod ? 'M' : 'L'} ${getX(i).toFixed(1)} ${rsiY(b.rsi).toFixed(1)}` : ''))
          .filter(Boolean)
          .join(' ');

        return (
          <g>
            <line x1={paddingLeft} y1={paneTop} x2={containerWidth - paddingRight} y2={paneTop} stroke="hsl(var(--border))" strokeOpacity="0.8" />
            <text x={paddingLeft + 4} y={paneTop + 10} fill="#818CF8" fontSize="9" fontWeight="600">
              RSI ({indicators.rsiPeriod})
            </text>
            {/* Overbought 70 and Oversold 30 lines */}
            <line x1={paddingLeft} y1={rsiY(70)} x2={containerWidth - paddingRight} y2={rsiY(70)} stroke="#EF4444" strokeDasharray="2 2" strokeOpacity="0.6" />
            <line x1={paddingLeft} y1={rsiY(30)} x2={containerWidth - paddingRight} y2={rsiY(30)} stroke="#10B981" strokeDasharray="2 2" strokeOpacity="0.6" />
            <path d={rsiLinePath} fill="none" stroke="#818CF8" strokeWidth="1.5" />
          </g>
        );
      })()}

      {/* SUBPANE 3: MACD PANEL */}
      {indicators.showMacd && (() => {
        const paneTop = currentTop + 6;
        currentTop += macdHeight + 6;
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
            <text x={paddingLeft + 4} y={paneTop + 10} fill="#FB7185" fontSize="9" fontWeight="600">
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

      {/* TIME AXIS LABELS AT BOTTOM */}
      {timeTicks.map(({ text, x }, idx) => (
        <text
          key={`time-tick-${idx}`}
          x={x}
          y={containerHeight - 6}
          fill="hsl(var(--muted-foreground))"
          fontSize="10"
          textAnchor="middle"
          fontFamily="monospace"
        >
          {text}
        </text>
      ))}

      {/* INTERACTIVE CROSSHAIR CURSOR & AXIS PILLS */}
      {hoverIndex !== null && hoverIndex >= 0 && hoverIndex < n && (
        <g>
          {/* Vertical Crosshair Line */}
          <line
            x1={getX(hoverIndex)}
            y1={0}
            x2={getX(hoverIndex)}
            y2={containerHeight - timeAxisHeight}
            stroke="hsl(var(--foreground))"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
            strokeWidth="1"
          />

          {/* Horizontal Crosshair Line */}
          <line
            x1={paddingLeft}
            y1={getY(bars[hoverIndex].close)}
            x2={containerWidth - paddingRight}
            y2={getY(bars[hoverIndex].close)}
            stroke="hsl(var(--foreground))"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
            strokeWidth="1"
          />

          {/* Crosshair Price Badge on Right Axis */}
          <rect
            x={containerWidth - paddingRight + 2}
            y={getY(bars[hoverIndex].close) - 9}
            width={56}
            height={18}
            fill="hsl(var(--foreground))"
            rx="3"
          />
          <text
            x={containerWidth - paddingRight + 30}
            y={getY(bars[hoverIndex].close) + 3.5}
            fill="hsl(var(--background))"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {bars[hoverIndex].close.toFixed(2)}
          </text>

          {/* Crosshair Date/Time Pill on Bottom Time Axis */}
          <rect
            x={getX(hoverIndex) - 38}
            y={containerHeight - timeAxisHeight + 2}
            width={76}
            height={16}
            fill="hsl(var(--foreground))"
            rx="3"
          />
          <text
            x={getX(hoverIndex)}
            y={containerHeight - timeAxisHeight + 13}
            fill="hsl(var(--background))"
            fontSize="9"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {bars[hoverIndex].time.length > 10 ? bars[hoverIndex].time.split(/[\sT]/)[1]?.slice(0, 5) || bars[hoverIndex].time.slice(0, 10) : bars[hoverIndex].time}
          </text>
        </g>
      )}
    </svg>
  );
}
