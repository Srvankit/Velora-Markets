import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import type { MarketStock } from '@/data/stocks';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceCardProps {
  stock: MarketStock;
}

export function PriceCard({ stock }: PriceCardProps) {
  const positive = stock.change >= 0;
  const afterHours = stock.price + (Math.random() - 0.5) * stock.price * 0.003;
  const open = stock.price - stock.change;
  const high = Math.max(open, stock.price) * 1.012;
  const low = Math.min(open, stock.price) * 0.988;

  const stats = [
    { label: 'After Hours', value: `$${afterHours.toFixed(2)}` },
    { label: 'Previous Close', value: `$${(stock.price - stock.change).toFixed(2)}` },
    { label: 'Open', value: `$${open.toFixed(2)}` },
    { label: 'High', value: `$${high.toFixed(2)}` },
    { label: 'Low', value: `$${low.toFixed(2)}` },
    { label: 'Volume', value: formatNumber(stock.volume, true) },
    { label: '52W High', value: stock.week52High ? `$${stock.week52High.toFixed(2)}` : '\u2014' },
    { label: '52W Low', value: stock.week52Low ? `$${stock.week52Low.toFixed(2)}` : '\u2014' },
    { label: 'Market Cap', value: formatNumber(stock.marketCap, true) },
  ];

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-end gap-3">
            <span className="font-display text-4xl font-bold tracking-tight">
              <AnimatedCounter value={stock.price} prefix="$" decimals={2} duration={1.2} />
            </span>
            <span
              className={cn(
                'mb-1.5 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold',
                positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
              )}
            >
              {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {positive ? '+' : ''}{stock.change.toFixed(2)} ({positive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {positive ? 'Up' : 'Down'} today \u00b7 Updated {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
