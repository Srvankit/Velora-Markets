import { motion } from 'framer-motion';
import { Rocket, Coins, BarChart3, Landmark } from 'lucide-react';
import { ChartContainer } from '@/components/common/ChartContainer';
import { mockUpcomingEvents, type UpcomingEvent } from '@/services/dashboard-data';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const typeConfig = {
  ipo: { icon: Rocket, color: 'text-primary', bg: 'bg-primary/10', label: 'IPO' },
  dividend: { icon: Coins, color: 'text-warning', bg: 'bg-warning/10', label: 'Dividend' },
  earnings: { icon: BarChart3, color: 'text-success', bg: 'bg-success/10', label: 'Earnings' },
  economic: { icon: Landmark, color: 'text-danger', bg: 'bg-danger/10', label: 'Economic' },
};

export function UpcomingEvents() {
  return (
    <ChartContainer title="Upcoming Events">
      <div className="relative space-y-4 pl-6">
        <div className="absolute left-[7px] top-1 h-[calc(100%-0.5rem)] w-px bg-border" />
        {mockUpcomingEvents.map((event, i) => (
          <EventItem key={event.id} event={event} delay={i * 0.08} />
        ))}
      </div>
    </ChartContainer>
  );
}

function EventItem({ event, delay }: { event: UpcomingEvent; delay: number }) {
  const config = typeConfig[event.type];
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="relative"
    >
      <div className={cn('absolute -left-[22px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-background', config.bg)}>
        <span className={cn('h-1.5 w-1.5 rounded-full', config.color)} />
      </div>
      <div className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 transition-colors hover:bg-accent/40">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', config.bg, config.color)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">{event.title}</p>
            <span className="shrink-0 text-xs text-muted-foreground">{formatDate(event.date, { month: 'short', day: 'numeric' })}</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
          <span className={cn('mt-1.5 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium', config.bg, config.color)}>
            {config.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
