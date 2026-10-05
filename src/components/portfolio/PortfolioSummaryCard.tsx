import { motion } from 'framer-motion';

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Landmark,
  BarChart3,
  DollarSign,
  Zap,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { cn } from '@/lib/utils';

interface PortfolioSummaryCardProps {
  label: string;
  value: number;
  prefix?: string;
  decimals?: number;
  change?: number;
  changePercent?: number;

  // Kept so PortfolioPage.tsx doesn't need changes.
  // We intentionally don't render the old sparkline.
  sparkline?: number[];

  delay?: number;
}

/*
 * Professional icon for each portfolio metric.
 * This replaces the old green sparkline / \__/ shape.
 */
const cardIcons: Record<string, LucideIcon> = {
  'Total Portfolio Value': Wallet,
  'Total P&L': TrendingUp,
  'Overall Return': Target,
  'Invested Amount': Landmark,
  'Current Value': BarChart3,
  'Available Cash': DollarSign,
  'Buying Power': Zap,
  'Net Worth': ShieldCheck,
};

import { getCurrencySymbol } from '@/lib/currency';

export function PortfolioSummaryCard({
  label,
  value,
  prefix = getCurrencySymbol(),
  decimals = 2,
  change,
  changePercent,
  delay = 0,
}: PortfolioSummaryCardProps) {
  const positive = (change ?? 0) >= 0;

  const hasChange =
    change !== undefined &&
    changePercent !== undefined;

  const Icon =
    cardIcons[label] ?? TrendingUp;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut',
      }}
      className="h-full"
    >
      <Card
        className="
          group
          relative
          h-full
          overflow-hidden
          p-4
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-primary/20
          hover:shadow-card-hover
        "
      >
        <div className="flex items-start justify-between gap-4">

          {/* LEFT SIDE */}

          <div className="min-w-0 flex-1">

            <p className="text-xs font-medium text-muted-foreground">
              {label}
            </p>

            <p className="mt-1 whitespace-nowrap font-display text-xl font-bold tracking-tight tabular-nums">
              <AnimatedCounter
                value={value}
                prefix={prefix}
                decimals={decimals}
                duration={1.2}
              />
            </p>

            {hasChange && (
              <div
                className={cn(
                  'mt-1 flex items-center gap-1 text-xs font-medium',
                  positive
                    ? 'text-success'
                    : 'text-danger',
                )}
              >
                {positive ? (
                  <TrendingUp className="h-3 w-3 shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 shrink-0" />
                )}

                <span className="whitespace-nowrap">
                  {positive ? '+' : '-'}
                  {prefix}
                  {Math.abs(change).toFixed(2)}

                  {' ('}

                  {positive ? '+' : '-'}
                  {Math.abs(changePercent).toFixed(2)}
                  {'%)'}
                </span>

              </div>
            )}

          </div>

          {/* PROFESSIONAL ICON — REPLACES SPARKLINE */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-border/60
              bg-primary/5
              transition-all
              duration-300
              group-hover:border-primary/30
              group-hover:bg-primary/10
            "
          >
            <Icon
              className="
                h-5
                w-5
                text-primary
                transition-transform
                duration-300
                group-hover:scale-110
              "
            />
          </div>

        </div>
      </Card>
    </motion.div>
  );
}

export function PortfolioSummarySkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-4">

      <div className="flex items-start justify-between">

        <div className="flex-1">

          <div className="h-3 w-24 rounded bg-muted" />

          <div className="mt-2 h-6 w-28 rounded bg-muted" />

          <div className="mt-2 h-3 w-24 rounded bg-muted" />

        </div>

        <div className="h-10 w-10 rounded-xl bg-muted" />

      </div>

    </div>
  );
}