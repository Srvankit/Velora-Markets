import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StockKeyMetrics } from '@/data/stockDetails';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface MetricsGridProps {
  metrics: StockKeyMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const items = [
    { label: 'Market Cap', value: formatNumber(metrics.marketCap, true) },
    { label: 'Enterprise Value', value: formatNumber(metrics.enterpriseValue, true) },
    { label: 'Shares Outstanding', value: formatNumber(metrics.sharesOutstanding, true) },
    { label: 'Dividend Yield', value: `${metrics.dividendYield.toFixed(2)}%` },
    { label: 'P/E Ratio', value: metrics.peRatio.toFixed(1) },
    { label: 'PEG Ratio', value: metrics.pegRatio.toFixed(2) },
    { label: 'Price to Book', value: metrics.priceToBook.toFixed(2) },
    { label: 'EV/EBITDA', value: metrics.evEbitda.toFixed(1) },
    { label: 'EPS', value: `$${metrics.eps.toFixed(2)}` },
    { label: 'Beta', value: metrics.beta.toFixed(2) },
    { label: 'Book Value', value: `$${metrics.bookValue.toFixed(2)}` },
    { label: 'Revenue', value: formatNumber(metrics.revenue, true) },
    { label: 'Net Profit', value: formatNumber(metrics.netProfit, true) },
    { label: 'ROE', value: `${metrics.roe.toFixed(1)}%` },
    { label: 'ROCE', value: `${metrics.roce.toFixed(1)}%` },
    { label: 'Debt to Equity', value: metrics.debtToEquity.toFixed(2) },
  ];

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Key Metrics</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className={cn(
              'rounded-lg border border-border bg-card/40 p-3 transition-colors hover:border-primary/30',
            )}
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
