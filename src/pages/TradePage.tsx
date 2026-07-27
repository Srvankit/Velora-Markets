import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShieldAlert, Layers, Clock, Receipt, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkline } from '@/components/common/Sparkline';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { TradePanel, type PreviewOrderData } from '@/components/trading/TradePanel';
import { OrderPreviewModal, SuccessModal, FailureModal } from '@/components/trading/OrderModals';
import { MarketDepth } from '@/components/trading/MarketDepth';
import { TradeHistory } from '@/components/trading/TradeHistory';
import { ChargesBreakdown } from '@/components/trading/ChargesBreakdown';
import { marketStocks } from '@/data/stocks';
import { generateMarketDepth, generateRecentTrades, tradingTips } from '@/data/trades';
import { useTrading } from '@/contexts/trading-context';
import { useWatchlist } from '@/hooks/use-watchlist';
import { calculateCharges, calculateTotal } from '@/lib/trading-calc';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TradeOrder } from '@/types/trading';
import {
  backendApi,
  type BackendPortfolio,
} from '@/services/backend';

const tipIcons: Record<string, typeof ShieldAlert> = { ShieldAlert, Layers, Clock, Receipt };

export default function TradePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {placeOrder } = useTrading();
  const { has, toggle } = useWatchlist();
  const [portfolio, setPortfolio] =
    useState<BackendPortfolio | null>(null);

  const [portfolioLoading, setPortfolioLoading] =
    useState(true);

  const [portfolioError, setPortfolioError] =
    useState<string | null>(null);

  const symbol = searchParams.get('symbol') ?? 'AAPL';
  const stock = useMemo(
    () => marketStocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase()) ?? marketStocks[0],
    [symbol],
  );

useEffect(() => {
  let cancelled = false;

  async function loadPortfolio() {
    try {
      setPortfolioLoading(true);
      setPortfolioError(null);

      const response =
        await backendApi.portfolio();

      if (!cancelled) {
        setPortfolio(response);
      }
    } catch (err) {
      console.error(
        'Failed to load trading balance:',
        err,
      );

      if (!cancelled) {
        setPortfolioError(
          'Unable to load available balance.',
        );
      }
    } finally {
      if (!cancelled) {
        setPortfolioLoading(false);
      }
    }
  }

  void loadPortfolio();

  return () => {
    cancelled = true;
  };
}, []);

  const [previewOrder, setPreviewOrder] = useState<TradeOrder | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<TradeOrder | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const depth = useMemo(() => generateMarketDepth(stock.price), [stock.price]);
  const trades = useMemo(() => generateRecentTrades(stock.price), [stock.price]);
  const isFavorite = has(stock.symbol);
  const positive = stock.change >= 0;

  const handlePreview = (data: PreviewOrderData) => {
    const order: TradeOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      symbol: data.symbol,
      name: data.name,
      side: data.side,
      quantity: data.quantity,
      price: data.price,
      orderType: data.orderType,
      productType: data.productType,
      validity: data.validity,
      stopLoss: data.stopLoss,
      targetPrice: data.targetPrice,
      charges: data.charges,
      total: data.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      timeline: [{ status: 'submitted', timestamp: new Date().toISOString(), note: 'Order submitted' }],
    };
    setPreviewOrder(order);
    setPreviewOpen(true);
  };

  const handleConfirm = async () => {
    if (!previewOrder) return;
    setLoading(true);
    try {
      const result = await placeOrder({
        symbol: previewOrder.symbol,
        name: previewOrder.name,
        side: previewOrder.side,
        quantity: previewOrder.quantity,
        price: previewOrder.price,
        orderType: previewOrder.orderType,
        productType: previewOrder.productType,
        validity: previewOrder.validity,
        stopLoss: previewOrder.stopLoss,
        targetPrice: previewOrder.targetPrice,
      });
      setPreviewOpen(false);

      if (result.success) {
        setSuccessOrder(result.order);
        setSuccessOpen(true);

        try {
          const updatedPortfolio =
            await backendApi.portfolio();

          setPortfolio(updatedPortfolio);
        } catch (portfolioErr) {
          console.error(
            'Order succeeded but portfolio refresh failed:',
            portfolioErr,
          );
        }
      } else {
        setError(result.error ?? 'Order failed');
        setErrorOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: stock.logoColor }}>
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight">{stock.symbol}</h1>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{stock.exchange}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stock.name} \u00b7 {stock.sector}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={() => toggle(stock.symbol)}>
          <Star className={cn('h-4 w-4', isFavorite && 'fill-warning text-warning')} />
        </Button>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Left column: stock info + depth + trades */}
        <div className="space-y-4">
          {/* Stock Summary */}
          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-3xl font-bold tracking-tight">
                  <AnimatedCounter value={stock.price} prefix="$" decimals={2} />
                </p>
                <p className={cn('mt-1 text-sm font-semibold', positive ? 'text-success' : 'text-danger')}>
                  {positive ? '+' : ''}{stock.change.toFixed(2)} ({positive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </p>
              </div>
              <Sparkline data={stock.sparkline} width={160} height={40} positive={positive} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-xs sm:grid-cols-5">
              <Stat label="Open" value={formatCurrency(stock.price - stock.change)} />
              <Stat label="High" value={formatCurrency(stock.price * 1.012)} />
              <Stat label="Low" value={formatCurrency(stock.price * 0.988)} />
              <Stat label="Volume" value={formatNumber(stock.volume, true)} />
              <Stat label="Mkt Cap" value={formatNumber(stock.marketCap, true)} />
            </div>
          </Card>

          {/* Market Depth + Recent Trades */}
          <div className="grid gap-4 sm:grid-cols-2">
            <MarketDepth depth={depth} />
            <TradeHistory trades={trades} />
          </div>

          {/* Trading Tips */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold">Trading Tips</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tradingTips.map((tip, i) => {
                const Icon = tipIcons[tip.icon] ?? Lightbulb;
                return (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    className="flex items-start gap-2.5 rounded-lg border border-border bg-card/40 p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tip.title}</p>
                      <p className="text-xs text-muted-foreground">{tip.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column: Trade Panel */}
        <div className="space-y-4">
          {portfolioLoading && (
              <p className="text-xs text-muted-foreground">
                Loading available balance...
              </p>
            )}

            {portfolioError && (
              <p className="text-xs text-danger">
                {portfolioError}
              </p>
            )}
          <TradePanel
          symbol={stock.symbol}
          name={stock.name}
          currentPrice={stock.price}
          availableBalance={
            portfolio?.cashBalance ?? 0
          }
          onPreview={handlePreview}
        />
          <ChargesBreakdown
            charges={calculateCharges('buy', 10, stock.price, 'market', 'delivery')}
            investment={10 * stock.price}
            total={calculateTotal(10, stock.price, calculateCharges('buy', 10, stock.price, 'market', 'delivery'))}
            side="buy"
          />
        </div>
      </div>

      {/* Modals */}
      <OrderPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        order={previewOrder}
        onConfirm={handleConfirm}
        loading={loading}
      />
      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        order={successOrder}
        onContinueTrading={() => setSuccessOpen(false)}
        onViewOrders={() => { setSuccessOpen(false); navigate('/orders'); }}
        onDashboard={() => { setSuccessOpen(false); navigate('/dashboard'); }}
      />
      <FailureModal
        open={errorOpen}
        onOpenChange={setErrorOpen}
        error={error}
        onRetry={() => { setErrorOpen(false); setPreviewOpen(true); }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold tabular-nums">{value}</p>
    </div>
  );
}
