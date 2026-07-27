import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Share2,
  TrendingUp,
  Newspaper,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';

import { PriceCard } from '@/components/stock/PriceCard';
import { StockChart } from '@/components/stock/StockChart';
import { CompanyOverview } from '@/components/stock/CompanyOverview';
import { FinancialHighlights } from '@/components/stock/FinancialHighlights';
import { AnalystRatingCard } from '@/components/stock/AnalystRatingCard';
import { PriceTarget } from '@/components/stock/PriceTarget';
import { MetricsGrid } from '@/components/stock/MetricsGrid';
import { AIInsightsCard } from '@/components/stock/AIInsightsCard';
import { StockNewsCard } from '@/components/stock/StockNewsCard';
import { RelatedStockCard } from '@/components/stock/RelatedStockCard';

import {
  TradePanel,
  type PreviewOrderData,
} from '@/components/trading/TradePanel';

import {
  OrderPreviewModal,
  SuccessModal,
  FailureModal,
} from '@/components/trading/OrderModals';

import {
  marketStocks,
  type MarketStock,
} from '@/data/stocks';

import { getCompanyProfile } from '@/data/companyProfiles';
import { getStockFinancials } from '@/data/financials';
import { getAnalystRating } from '@/data/analystRatings';

import {
  getKeyMetrics,
  getStockNews,
  getAIInsights,
} from '@/data/stockDetails';

import { useWatchlist } from '@/hooks/use-watchlist';
import { useTrading } from '@/contexts/trading-context';

import { cn } from '@/lib/utils';

import {
  backendApi,
  type BackendPortfolio,
} from '@/services/backend';

import { mergeMarketStock } from '@/services/market-data';

import type { TradeOrder } from '@/types/trading';

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();

  const { has, toggle } = useWatchlist();
  const { placeOrder } = useTrading();

  // =========================================================
  // BACKEND DATA
  // =========================================================

  const [stock, setStock] = useState<MarketStock | null>(null);

  const [portfolio, setPortfolio] =
    useState<BackendPortfolio | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // =========================================================
  // ORDER MODAL STATE
  // =========================================================

  const [previewOrder, setPreviewOrder] =
    useState<TradeOrder | null>(null);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [successOrder, setSuccessOrder] =
    useState<TradeOrder | null>(null);

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [orderError, setOrderError] =
    useState<string | null>(null);

  const [errorOpen, setErrorOpen] =
    useState(false);

  const [orderLoading, setOrderLoading] =
    useState(false);

  // =========================================================
  // LOAD STOCK + PORTFOLIO
  // =========================================================

  async function loadStockDetails() {
    if (!symbol) {
      setError('Stock symbol is missing.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [stockResponse, portfolioResponse] =
        await Promise.all([
          backendApi.marketStock(symbol),
          backendApi.portfolio(),
        ]);

      setStock(
        mergeMarketStock(stockResponse),
      );

      setPortfolio(portfolioResponse);
    } catch (err) {
      console.error(
        'Failed to load stock details:',
        err,
      );

      setError(
        'Unable to load this stock from the market service.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStockDetails();
  }, [symbol]);

  // =========================================================
  // PREVIEW ORDER
  // =========================================================

  const handlePreview = (
    data: PreviewOrderData,
  ) => {
    const order: TradeOrder = {
      id: `ORD-${Date.now()
        .toString()
        .slice(-6)}`,

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

      timeline: [
        {
          status: 'submitted',
          timestamp:
            new Date().toISOString(),
          note: 'Order submitted',
        },
      ],
    };

    setPreviewOrder(order);
    setPreviewOpen(true);
  };

  // =========================================================
  // CONFIRM REAL ORDER
  // =========================================================

  const handleConfirm = async () => {
    if (!previewOrder) return;

    setOrderLoading(true);

    try {
      const result = await placeOrder({
        symbol: previewOrder.symbol,
        name: previewOrder.name,
        side: previewOrder.side,
        quantity: previewOrder.quantity,
        price: previewOrder.price,
        orderType: previewOrder.orderType,
        productType:
          previewOrder.productType,
        validity: previewOrder.validity,
        stopLoss: previewOrder.stopLoss,
        targetPrice:
          previewOrder.targetPrice,
      });

      setPreviewOpen(false);

      if (result.success) {
        setSuccessOrder(result.order);
        setSuccessOpen(true);

        // IMPORTANT:
        // Refresh portfolio after successful trade
        // so buying power updates immediately.
        try {
          const updatedPortfolio =
            await backendApi.portfolio();

          setPortfolio(updatedPortfolio);
        } catch (portfolioError) {
          console.error(
            'Order succeeded but portfolio refresh failed:',
            portfolioError,
          );
        }
      } else {
        setOrderError(
          result.error ?? 'Order failed',
        );

        setErrorOpen(true);
      }
    } catch (err) {
      console.error(
        'Failed to place order:',
        err,
      );

      setPreviewOpen(false);

      setOrderError(
        'Unable to place the order.',
      );

      setErrorOpen(true);
    } finally {
      setOrderLoading(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-xl bg-muted/30" />

        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="h-36 animate-pulse rounded-xl bg-muted/30" />
            <div className="h-96 animate-pulse rounded-xl bg-muted/30" />
          </div>

          <div className="h-96 animate-pulse rounded-xl bg-muted/30" />
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !stock) {
    return (
      <EmptyState
        icon={
          <TrendingUp className="h-5 w-5" />
        }
        title="Stock unavailable"
        description={
          error ??
          `We couldn't find "${symbol}".`
        }
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate('/markets')
            }
          >
            Back to Markets
          </Button>
        }
      />
    );
  }

  // =========================================================
  // FRONTEND ENRICHMENT
  // =========================================================

  const profile =
    getCompanyProfile(stock.symbol);

  const financials =
    getStockFinancials(stock.symbol);

  const rating =
    getAnalystRating(
      stock.symbol,
      stock.price,
    );

  const metrics =
    getKeyMetrics(stock.symbol);

  const news =
    getStockNews(stock.symbol);

  const insights =
    getAIInsights(
      stock.symbol,
      stock.price,
      rating.averageTarget,
    );

  const related = marketStocks
    .filter(
      (s) =>
        s.sector === stock.sector &&
        s.symbol !== stock.symbol,
    )
    .slice(0, 4);

  const isFavorite =
    has(stock.symbol);

  const positive =
    stock.change >= 0;

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="sticky top-16 z-20 -mx-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6"
      >
        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(-1)
              }
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{
                backgroundColor:
                  stock.logoColor,
              }}
            >
              {stock.symbol.slice(0, 2)}
            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <h1 className="truncate font-display text-lg font-bold tracking-tight">
                  {stock.name}
                </h1>

                <span className="hidden rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline">
                  {stock.exchange}
                </span>

              </div>

              <p className="truncate text-xs text-muted-foreground">
                {stock.symbol}
                {' · '}
                {stock.sector}
                {' · '}
                {profile.industry}
              </p>

            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2">

            <div className="hidden items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 sm:flex">

              <span
                className={cn(
                  'text-xs font-medium',
                  positive
                    ? 'text-success'
                    : 'text-danger',
                )}
              >
                {positive
                  ? 'OPEN'
                  : 'CLOSED'}
              </span>

            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                void toggle(stock.symbol);
              }}
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  isFavorite &&
                    'fill-warning text-warning',
                )}
              />
            </Button>

            <Button
              variant="outline"
              size="icon"
            >
              <Share2 className="h-4 w-4" />
            </Button>

          </div>

        </div>
      </motion.div>

      {/* STOCK + REAL TRADING */}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">

        <div className="space-y-4">

          <PriceCard stock={stock} />

          <StockChart
            symbol={stock.symbol}
            basePrice={stock.price}
          />

        </div>

        <div className="xl:sticky xl:top-32 xl:self-start">

          <TradePanel
            symbol={stock.symbol}
            name={stock.name}
            currentPrice={stock.price}
            availableBalance={
              portfolio?.cashBalance ?? 0
            }
            onPreview={handlePreview}
          />

        </div>

      </div>

      {/* QUICK STATS */}

      <MetricsGrid
        metrics={metrics}
      />

      {/* AI */}

      <AIInsightsCard
        insights={insights}
      />

      {/* COMPANY */}

      <div className="grid gap-4 lg:grid-cols-2">

        <CompanyOverview
          profile={profile}
        />

        <FinancialHighlights
          financials={financials}
        />

      </div>

      {/* ANALYSTS */}

      <div className="grid gap-4 lg:grid-cols-2">

        <AnalystRatingCard
          rating={rating}
          currentPrice={stock.price}
        />

        <PriceTarget
          rating={rating}
          currentPrice={stock.price}
        />

      </div>

      {/* NEWS */}

      <section>

        <div className="mb-3 flex items-center gap-2">

          <Newspaper className="h-4 w-4 text-primary" />

          <h2 className="font-display text-base font-semibold tracking-tight">
            Latest News
          </h2>

        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {news.map((item, i) => (
            <StockNewsCard
              key={item.id}
              item={item}
              delay={i * 0.05}
            />
          ))}

        </div>

      </section>

      {/* RELATED */}

      <section>

        <div className="mb-3 flex items-center gap-2">

          <TrendingUp className="h-4 w-4 text-primary" />

          <h2 className="font-display text-base font-semibold tracking-tight">
            Related Companies
          </h2>

        </div>

        {related.length === 0 ? (

          <Card className="p-5">
            <p className="text-sm text-muted-foreground">
              No related companies found.
            </p>
          </Card>

        ) : (

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {related.map((rel, i) => (
              <RelatedStockCard
                key={rel.symbol}
                stock={rel}
                delay={i * 0.05}
              />
            ))}

          </div>

        )}

      </section>

      {/* =====================================================
          REAL TRADING MODALS
      ====================================================== */}

      <OrderPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        order={previewOrder}
        onConfirm={handleConfirm}
        loading={orderLoading}
      />

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        order={successOrder}
        onContinueTrading={() =>
          setSuccessOpen(false)
        }
        onViewOrders={() => {
          setSuccessOpen(false);
          navigate('/orders');
        }}
        onDashboard={() => {
          setSuccessOpen(false);
          navigate('/dashboard');
        }}
      />

      <FailureModal
        open={errorOpen}
        onOpenChange={setErrorOpen}
        error={orderError}
        onRetry={() => {
          setErrorOpen(false);
          setPreviewOpen(true);
        }}
      />

    </div>
  );
}