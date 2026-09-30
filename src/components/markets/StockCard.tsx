import { motion } from 'framer-motion';
import { Star, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Sparkline } from '@/components/common/Sparkline';
import type { MarketStock } from '@/data/stocks';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface StockCardProps {
  stock: MarketStock;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
  delay?: number;
  compact?: boolean;
}

export function StockCard({
  stock,
  isFavorite,
  onToggleFavorite,
  delay = 0,
  compact = false,
}: StockCardProps) {
  const navigate = useNavigate();
  const positive = stock.change >= 0;

  const handleTrade = () => {
    navigate(`/trade?symbol=${encodeURIComponent(stock.symbol)}`);
  };

  const handleViewDetails = () => {
    navigate(`/stocks/${encodeURIComponent(stock.symbol)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      whileHover={{ y: -3 }}
    >
      <Card className="group h-full p-4 transition-shadow hover:shadow-card-hover">

        {/* Stock Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{
                backgroundColor: stock.logoColor,
              }}
            >
              {stock.symbol.slice(0, 2)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground" title={stock.name}>
                {stock.name}
              </p>

              <p className="truncate text-xs font-mono text-muted-foreground">
                {stock.symbol} · {stock.exchange}
              </p>
            </div>
          </div>

          {/* Watchlist Star */}
          <button
            type="button"
            onClick={() =>
              onToggleFavorite(stock.symbol)
            }
            aria-label={`${
              isFavorite ? 'Remove' : 'Add'
            } ${stock.symbol} ${
              isFavorite ? 'from' : 'to'
            } watchlist`}
            className="text-muted-foreground transition-colors hover:text-warning"
          >
            <Star
              className={cn(
                'h-4 w-4',
                isFavorite &&
                  'fill-warning text-warning',
              )}
            />
          </button>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-lg font-bold tracking-tight">
              {formatCurrency(stock.price, stock.currency || (stock.exchange === 'NASDAQ' || stock.exchange === 'NYSE' ? 'USD' : 'INR'))}
            </p>

            <p
              className={cn(
                'text-xs font-medium',
                positive
                  ? 'text-success'
                  : 'text-danger',
              )}
            >
              {positive ? '+' : ''}
              {stock.change.toFixed(2)} (
              {positive ? '+' : ''}
              {stock.changePercent.toFixed(2)}%)
            </p>
          </div>

          <Sparkline
            data={stock.sparkline}
            width={72}
            height={28}
            positive={positive}
          />
        </div>

        {/* Additional Stock Information */}
        {!compact && (
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span>
              Mkt Cap:{' '}
              {formatNumber(
                stock.marketCap,
                true,
              )}
            </span>

            <span className="rounded-md bg-muted px-1.5 py-0.5">
              {stock.exchange}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">

          {/* View Details */}
          <button
            type="button"
            onClick={handleViewDetails}
            className="flex items-center justify-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Eye className="h-3 w-3" />
            Details
          </button>

          {/* Trade */}
          <button
            type="button"
            onClick={handleTrade}
            className="flex items-center justify-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <TrendingUp className="h-3 w-3" />
            Trade
          </button>
        </div>

        {/* Watchlist Action */}
        <button
          type="button"
          onClick={() =>
            onToggleFavorite(stock.symbol)
          }
          className={cn(
            'mt-2 flex w-full items-center justify-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',

            isFavorite
              ? 'border-warning/40 bg-warning/10 text-warning'
              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
          )}
        >
          <Star
            className={cn(
              'h-3 w-3',
              isFavorite && 'fill-current',
            )}
          />

          {isFavorite
            ? 'Watching'
            : 'Add to Watchlist'}
        </button>
      </Card>
    </motion.div>
  );
}

export function StockCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-lg bg-muted" />

        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-2.5 w-24 rounded bg-muted" />
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-3 w-28 rounded bg-muted" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="h-7 rounded-lg bg-muted" />
        <div className="h-7 rounded-lg bg-muted" />
      </div>

      <div className="mt-2 h-7 rounded-lg bg-muted" />
    </div>
  );
}