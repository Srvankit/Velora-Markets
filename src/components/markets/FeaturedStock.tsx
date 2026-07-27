import { motion } from 'framer-motion';
import {
  Star,
  Plus,
  GitCompareArrows,
  Filter,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Sparkline } from '@/components/common/Sparkline';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import type { MarketStock } from '@/data/stocks';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface FeaturedStockProps {
  stock: MarketStock;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
}

export function FeaturedStock({
  stock,
  isFavorite,
  onToggleFavorite,
}: FeaturedStockProps) {
  const navigate = useNavigate();
  const positive = stock.change >= 0;

  const handleTrade = () => {
    navigate(`/trade?symbol=${encodeURIComponent(stock.symbol)}`);
  };

  return (
    <Card className="relative overflow-hidden border-primary/20 p-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto]">
        {/* Stock information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: stock.logoColor }}
            >
              {stock.symbol.slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-bold tracking-tight">
                  {stock.name}
                </h3>

                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {stock.exchange}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {stock.symbol} · {stock.sector}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-4">
            <p className="font-display text-4xl font-bold tracking-tight">
              <AnimatedCounter
                value={stock.price}
                prefix="$"
                decimals={2}
                duration={1.5}
              />
            </p>

            <span
              className={cn(
                'mb-1.5 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold',
                positive
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger',
              )}
            >
              {positive ? '+' : ''}
              {stock.change.toFixed(2)} ({positive ? '+' : ''}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>

          {/* Price chart */}
          <Sparkline
            data={stock.sparkline}
            width={280}
            height={48}
            positive={positive}
            className="hidden sm:block"
          />

          {/* Company description */}
          {stock.description && (
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {stock.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <ActionButton
              icon={TrendingUp}
              label={`Trade ${stock.symbol}`}
              primary
              onClick={handleTrade}
            />

            <ActionButton
              icon={Star}
              label="Add to Watchlist"
              onClick={() => onToggleFavorite(stock.symbol)}
              active={isFavorite}
            />

            <ActionButton
              icon={GitCompareArrows}
              label="Compare Stocks"
            />

            <ActionButton
              icon={Filter}
              label="Open Screener"
            />

            <ActionButton
              icon={Briefcase}
              label="View Portfolio"
              onClick={() => navigate('/portfolio')}
            />
          </div>
        </div>

        {/* Stock statistics */}
        <div className="grid grid-cols-2 gap-3 lg:w-64">
          <StatBox
            label="52W High"
            value={
              stock.week52High
                ? formatCurrency(stock.week52High)
                : '—'
            }
          />

          <StatBox
            label="52W Low"
            value={
              stock.week52Low
                ? formatCurrency(stock.week52Low)
                : '—'
            }
          />

          <StatBox
            label="Market Cap"
            value={formatNumber(stock.marketCap, true)}
          />

          <StatBox
            label="P/E Ratio"
            value={stock.peRatio?.toFixed(1) ?? '—'}
          />

          <StatBox
            label="Dividend Yield"
            value={
              stock.dividendYield
                ? `${stock.dividendYield.toFixed(2)}%`
                : '—'
            }
          />

          <StatBox
            label="Volume"
            value={formatNumber(stock.volume, true)}
          />
        </div>
      </div>
    </Card>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-0.5 text-sm font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  primary,
  onClick,
  active,
}: {
  icon: LucideIcon;
  label: string;
  primary?: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',

        active
          ? 'border-warning/40 bg-warning/10 text-warning'
          : primary
            ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
            : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      <Icon
        className={cn(
          'h-3.5 w-3.5',
          active && 'fill-current',
        )}
      />

      {active && label.includes('Watchlist')
        ? 'Watching'
        : label}
    </motion.button>
  );
}

export { Plus };