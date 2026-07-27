import { motion } from 'framer-motion';
import { Rocket, ShoppingBag, DollarSign, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { portfolioTimeline, type TimelineEvent } from '@/data/portfolio';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const typeConfig: Record<TimelineEvent['type'], { icon: typeof Rocket; color: string; bg: string }> = {
  investment: { icon: Rocket, color: 'text-primary', bg: 'bg-primary/10' },
  purchase: { icon: ShoppingBag, color: 'text-chart-2', bg: 'bg-chart-2/10' },
  dividend: { icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
  deposit: { icon: ArrowDownToLine, color: 'text-success', bg: 'bg-success/10' },
  withdraw: { icon: ArrowUpFromLine, color: 'text-danger', bg: 'bg-danger/10' },
};

export function Timeline() {
  const sorted = [...portfolioTimeline].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Portfolio Timeline</h3>
      <div className="relative space-y-4 pl-6">
        <div className="absolute left-[11px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
        {sorted.map((event, i) => {
          const config = typeConfig[event.type];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="relative"
            >
              <div className={cn('absolute -left-[24px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background', config.bg)}>
                <config.icon className={cn('h-3 w-3', config.color)} />
              </div>
              <div>
                <p className="text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.description}</p>
                <div className="mt-0.5 flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">{formatDate(event.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  {event.amount !== undefined && (
                    <span className={cn('font-medium tabular-nums', event.amount >= 0 ? 'text-success' : 'text-danger')}>
                      {event.amount >= 0 ? '+' : ''}{formatCurrency(event.amount)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
