import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ActivityTimeline } from '@/components/user/ActivityTimeline';
import { activityEvents, activityTypeFilters, type ActivityType } from '@/data/activity';
import { cn } from '@/lib/utils';

export default function ActivityPage() {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return activityEvents;
    return activityEvents.filter((e) => e.type === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Activity Log</h1>
            <p className="text-sm text-muted-foreground">Complete history of your account activity</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-1.5">
        {activityTypeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f.value ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-accent',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ActivityTimeline events={filtered} />
    </div>
  );
}
