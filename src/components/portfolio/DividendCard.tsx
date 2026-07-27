import { motion } from 'framer-motion';
import { Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { dividendHistory, upcomingDividends, dividendSummary } from '@/data/dividends';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export function DividendCard() {
  const summaryStats = [
    { icon: DollarSign, label: 'Total Earned', value: dividendSummary.totalEarned, prefix: '$' },
    { icon: TrendingUp, label: 'Annual Income', value: dividendSummary.annualIncome, prefix: '$' },
    { icon: Clock, label: 'Yield', value: dividendSummary.dividendYield, suffix: '%', decimals: 2 },
  ];

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Dividend Tracker</h3>

      {/* Summary */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-lg border border-border bg-card/40 p-3"
          >
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <stat.icon className="h-3 w-3" />
              {stat.label}
            </div>
            <p className="mt-1 text-sm font-bold tabular-nums">
              <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Upcoming Dividends</p>
        <div className="space-y-2">
          {upcomingDividends.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-2 rounded-lg border border-border p-2.5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: d.logoColor }}>
                {d.symbol.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{d.symbol}</p>
                <p className="text-xs text-muted-foreground">Ex: {formatDate(d.exDate, { month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold tabular-nums">{formatCurrency(d.estimatedAmount)}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(d.perShare)}/sh</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Recent History</p>
        <div className="space-y-1.5">
          {dividendHistory.slice(0, 5).map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded text-[9px] font-bold text-white" style={{ backgroundColor: d.logoColor }}>
                  {d.symbol.slice(0, 2)}
                </div>
                <span className="font-medium">{d.symbol}</span>
                <Badge variant="outline" className="border-0 bg-muted text-[10px] capitalize">{d.frequency}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{formatDate(d.date, { month: 'short', day: 'numeric' })}</span>
                <span className="font-semibold tabular-nums text-success">+{formatCurrency(d.amount)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
