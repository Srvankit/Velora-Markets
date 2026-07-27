import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpFromLine, ShoppingCart, Banknote, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { recentActivity, type PortfolioActivity } from '@/data/portfolio';
import { formatCurrency, formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const typeConfig: Record<PortfolioActivity['type'], { icon: typeof ShoppingCart; color: string; bg: string }> = {
  buy: { icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/10' },
  sell: { icon: ShoppingCart, color: 'text-chart-2', bg: 'bg-chart-2/10' },
  deposit: { icon: ArrowDownToLine, color: 'text-success', bg: 'bg-success/10' },
  withdraw: { icon: ArrowUpFromLine, color: 'text-danger', bg: 'bg-danger/10' },
  dividend: { icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
};

export function ActivityFeed() {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Recent Activity</h3>
      <div className="space-y-2">
        {recentActivity.map((activity, i) => {
          const config = typeConfig[activity.type];
          const positive = activity.amount >= 0;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-lg border border-border/50 p-2.5 transition-colors hover:bg-accent/40"
            >
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                <config.icon className={cn('h-4 w-4', config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{activity.name}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.date)}</p>
              </div>
              <span className={cn('text-sm font-semibold tabular-nums', positive ? 'text-success' : 'text-danger')}>
                {positive ? '+' : ''}{formatCurrency(activity.amount)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
