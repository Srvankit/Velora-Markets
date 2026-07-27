import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Plus, Trophy, DollarSign, Activity, Scale } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { insightTimeline, type InsightTimelineEvent } from '@/data/aiInsights';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof ShieldCheck> = {
  ShieldCheck, AlertTriangle, Plus, Trophy, DollarSign, Activity, Scale,
};

const typeConfig = {
  positive: { color: 'bg-success/10 text-success', ring: 'ring-success/20' },
  neutral: { color: 'bg-primary/10 text-primary', ring: 'ring-primary/20' },
  warning: { color: 'bg-warning/10 text-warning', ring: 'ring-warning/20' },
};

export function AITimeline() {
  const sorted = [...insightTimeline].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">AI Insight Timeline</h3>
      <div className="relative space-y-4 pl-6">
        <div className="absolute left-[11px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
        {sorted.map((event, i) => {
          const Icon = iconMap[event.icon] ?? Activity;
          const config = typeConfig[event.type];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="relative"
            >
              <div className={cn('absolute -left-[24px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background', config.color)}>
                <Icon className="h-3 w-3" />
              </div>
              <div>
                <p className="text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(event.date)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
