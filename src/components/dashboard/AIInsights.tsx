import { motion } from 'framer-motion';
import { Cpu, Activity, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockAIInsights } from '@/services/dashboard-data';
import { cn } from '@/lib/utils';

const iconMap = { Cpu, Activity, ShieldCheck, Scale };

const typeStyles = {
  info: { ring: 'border-primary/30', chip: 'bg-primary/10 text-primary' },
  warning: { ring: 'border-warning/30', chip: 'bg-warning/10 text-warning' },
  positive: { ring: 'border-success/30', chip: 'bg-success/10 text-success' },
};

export function AIInsights() {
  return (
    <Card className="relative overflow-hidden border-primary/20 p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">AI Insights</h3>
          <p className="text-xs text-muted-foreground">Powered by Velora Intelligence</p>
        </div>
      </div>

      <div className="relative mt-4 grid gap-3 sm:grid-cols-2">
        {mockAIInsights.map((insight, i) => {
          const Icon = iconMap[insight.icon as keyof typeof iconMap] ?? Activity;
          const style = typeStyles[insight.type];
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              className={cn('rounded-xl border bg-card/40 p-4', style.ring)}
            >
              <div className="flex items-start gap-3">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', style.chip)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
