import { motion } from 'framer-motion';
import { PieChart, Activity, TrendingUp, ShieldCheck, Sparkles, DollarSign, AlertTriangle, Scale, Plus, Trophy, HeartPulse, Cpu, Landmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof TrendingUp> = {
  PieChart, Activity, TrendingUp, ShieldCheck, Sparkles, DollarSign, AlertTriangle, Scale, Plus, Trophy, HeartPulse, Cpu, Landmark,
};

const typeStyles = {
  positive: { ring: 'border-success/30', chip: 'bg-success/10 text-success', bar: 'bg-success' },
  neutral: { ring: 'border-primary/30', chip: 'bg-primary/10 text-primary', bar: 'bg-primary' },
  warning: { ring: 'border-warning/30', chip: 'bg-warning/10 text-warning', bar: 'bg-warning' },
};

interface AIInsightCardProps {
  insight: {
    id: string;
    title: string;
    description: string;
    type: 'positive' | 'neutral' | 'warning';
    confidence: number;
    icon: string;
    category?: string;
  };
  delay?: number;
  showCategory?: boolean;
}

export function AIInsightCard({ insight, delay = 0, showCategory = false }: AIInsightCardProps) {
  const Icon = iconMap[insight.icon] ?? Activity;
  const style = typeStyles[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <Card className={cn('h-full p-4 transition-shadow hover:shadow-card-hover', style.ring)}>
        <div className="flex items-start gap-3">
          <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', style.chip)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">{insight.title}</p>
              {showCategory && insight.category && (
                <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{insight.category}</span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">Confidence</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${insight.confidence}%` }}
                  transition={{ duration: 0.6, delay: delay + 0.3 }}
                  className={cn('h-full rounded-full', style.bar)}
                />
              </div>
              <span className="text-xs font-medium tabular-nums">{insight.confidence}%</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
