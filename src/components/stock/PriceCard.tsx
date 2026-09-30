import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import type { MarketStock } from '@/data/stocks';
import { formatCurrency, getCurrencySymbol } from '@/lib/currency';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceCardProps {
  stock: MarketStock;
}

export function PriceCard({ stock }: PriceCardProps) {
  const positive = stock.change >= 0;
  const currency = stock.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currency);
  const prevClose = stock.previousClose ?? (stock.price - stock.change);
  const open = stock.open ?? prevClose;
  const high = stock.high ?? Math.max(stock.price, open);
  const low = stock.low ?? Math.min(stock.price, open);

  const stats = [
    { label: 'Previous Close', value: formatCurrency(prevClose, currency) },
    { label: 'Open', value: formatCurrency(open, currency) },
    { label: 'Day High', value: formatCurrency(high, currency) },
    { label: 'Day Low', value: formatCurrency(low, currency) },
    { label: 'Volume', value: formatNumber(stock.volume, true) },
    { label: '52W High', value: stock.week52High ? formatCurrency(stock.week52High, currency) : '—' },
    { label: '52W Low', value: stock.week52Low ? formatCurrency(stock.week52Low, currency) : '—' },
    { label: 'Market Cap', value: formatNumber(stock.marketCap, true) },
    { label: 'Exchange', value: stock.exchange },
    { label: 'Status', value: stock.marketStatus || 'LIVE' },
  ];

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-end gap-3">
            <span className="font-display text-4xl font-bold tracking-tight">
              <AnimatedCounter value={stock.price} prefix={currencySymbol} decimals={2} duration={1.2} />
            </span>
            <span
              className={cn(
                'mb-1.5 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold',
                positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
              )}
            >
              {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {positive ? '+' : ''}{formatCurrency(stock.change, currency)} ({positive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {positive ? 'Up' : 'Down'} today · Updated {stock.timestamp ? new Date(stock.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
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
