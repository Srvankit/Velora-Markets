import { motion } from 'framer-motion';
import { TrendingUp, CalendarCheck, Wallet, Activity, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { walletAIInsights, type AIWalletInsight } from '@/data/wallet';
import { cn } from '@/lib/utils';

const iconMap = { TrendingUp, CalendarCheck, Wallet, Activity, Sparkles };

const typeStyles = {
  positive: { ring: 'border-success/30', chip: 'bg-success/10 text-success' },
  neutral: { ring: 'border-primary/30', chip: 'bg-primary/10 text-primary' },
  warning: { ring: 'border-warning/30', chip: 'bg-warning/10 text-warning' },
};

export function AIWalletInsights() {
  return (
    <Card className="relative overflow-hidden border-primary/20 p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">AI Wallet Insights</h3>
          <p className="text-xs text-muted-foreground">Powered by Velora Intelligence</p>
        </div>
      </div>

      <div className="relative grid gap-3 sm:grid-cols-2">
        {walletAIInsights.map((insight: AIWalletInsight, i: number) => {
          const Icon = iconMap[insight.icon as keyof typeof iconMap] ?? Activity;
          const style = typeStyles[insight.type];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn('rounded-xl border bg-card/40 p-4', style.ring)}
            >
              <div className="flex items-start gap-3">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', style.chip)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{insight.title}</p>
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">{insight.confidence}% confidence</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
                  <div className="pt-1">
                    <div className="h-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${insight.confidence}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 + 0.3 }}
                        className={cn('h-full rounded-full', style.chip.split(' ')[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
