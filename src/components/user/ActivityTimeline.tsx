import { motion } from 'framer-motion';
import { ShoppingCart, ArrowDownToLine, ArrowUpFromLine, Sparkles, LogIn, Settings, Lock, User, UserPlus, MessageSquare, Palette, ShieldCheck, ShieldAlert, Bell, DollarSign, Gift, TrendingUp, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ActivityEvent, ActivityType } from '@/data/activity';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof ShoppingCart> = {
  ShoppingCart, ArrowDownToLine, ArrowUpFromLine, Sparkles, LogIn, Settings, Lock, User, UserPlus, MessageSquare, Palette, ShieldCheck,
};

const typeConfig: Record<ActivityType, { color: string; bg: string }> = {
  profile: { color: 'text-primary', bg: 'bg-primary/10' },
  trade: { color: 'text-chart-2', bg: 'bg-chart-2/10' },
  deposit: { color: 'text-success', bg: 'bg-success/10' },
  withdraw: { color: 'text-danger', bg: 'bg-danger/10' },
  ai: { color: 'text-chart-3', bg: 'bg-chart-3/10' },
  login: { color: 'text-chart-4', bg: 'bg-chart-4/10' },
  settings: { color: 'text-muted-foreground', bg: 'bg-muted' },
  security: { color: 'text-warning', bg: 'bg-warning/10' },
};

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  return (
    <Card className="p-5">
      <div className="relative space-y-4 pl-6">
        <div className="absolute left-[11px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
        {events.map((event, i) => {
          const config = typeConfig[event.type];
          const Icon = iconMap[event.icon] ?? Settings;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="relative"
            >
              <div className={cn('absolute -left-[24px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background', config.bg)}>
                <Icon className={cn('h-3 w-3', config.color)} />
              </div>
              <div>
                <p className="text-sm font-semibold">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(event.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
