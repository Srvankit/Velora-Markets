import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import type { MarketStock } from '@/data/stocks';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency, getCurrencySymbol, convertCurrency } from '@/lib/currency';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceCardProps {
  stock: MarketStock;
}

export function PriceCard({ stock }: PriceCardProps) {
  const { user } = useAuth();
  const positive = stock.change >= 0;
  const instrumentCurrency = stock.currency || 'INR';
  const userBaseCurrency = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(instrumentCurrency);
  const prevClose = stock.previousClose ?? (stock.price - stock.change);
  const open = stock.open ?? prevClose;
  const high = stock.high ?? Math.max(stock.price, open);
  const low = stock.low ?? Math.min(stock.price, open);

  // FX Conversion if instrument currency differs from user's base currency
  const isDifferentCurrency = instrumentCurrency.toUpperCase() !== userBaseCurrency.toUpperCase();
  const conversion = isDifferentCurrency
    ? convertCurrency(stock.price, instrumentCurrency, userBaseCurrency)
    : null;

  const stats = [
    { label: 'Previous Close', value: formatCurrency(prevClose, instrumentCurrency) },
    { label: 'Open', value: formatCurrency(open, instrumentCurrency) },
    { label: 'Day High', value: formatCurrency(high, instrumentCurrency) },
    { label: 'Day Low', value: formatCurrency(low, instrumentCurrency) },
    { label: 'Volume', value: formatNumber(stock.volume, true) },
    { label: '52W High', value: stock.week52High ? formatCurrency(stock.week52High, instrumentCurrency) : '—' },
    { label: '52W Low', value: stock.week52Low ? formatCurrency(stock.week52Low, instrumentCurrency) : '—' },
    { label: 'Market Cap', value: formatNumber(stock.marketCap, true) },
    { label: 'Exchange', value: stock.exchange },
    {
      label: 'Market Status',
      value: (
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold uppercase',
            stock.marketStatus === 'LIVE'
              ? 'bg-success/15 text-success'
              : stock.marketStatus === 'DELAYED'
              ? 'bg-warning/15 text-warning'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {stock.marketStatus || 'MARKET_CLOSED'}
        </span>
      ),
    },
  ];

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-bold tracking-tight">
              <AnimatedCounter value={stock.price} prefix={currencySymbol} decimals={2} duration={1.2} />
            </span>
            <span className="font-mono text-xs font-semibold uppercase text-muted-foreground">
              {instrumentCurrency}
            </span>

            <span
              className={cn(
                'mb-1.5 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold',
                positive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
              )}
            >
              {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {positive ? '+' : ''}
              {formatCurrency(stock.change, instrumentCurrency)} ({positive ? '+' : ''}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>

          {/* Converted Base Currency Value for Cross-Currency (e.g. AAPL USD -> INR) */}
          {conversion && (
            <div className="flex items-center gap-2 pt-0.5 text-xs">
              <Badge variant="outline" className="border-primary/30 bg-primary/5 font-mono text-xs font-semibold text-primary gap-1">
                <ArrowRightLeft className="h-3 w-3" />
                ≈ {formatCurrency(conversion.convertedAmount, userBaseCurrency)}
              </Badge>
              <span className="text-muted-foreground text-[11px]">
                (FX Rate: 1 {instrumentCurrency} = {formatCurrency(conversion.rate, userBaseCurrency)})
              </span>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {positive ? 'Up' : 'Down'} today · Updated{' '}
            {stock.timestamp ? new Date(stock.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
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
            <div className="mt-0.5 text-sm font-semibold tabular-nums">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
