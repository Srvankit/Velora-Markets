import { motion } from 'framer-motion';
import { ShoppingCart, ShieldAlert, Sparkles, ArrowDownToLine, Trophy, Bell, Settings, TrendingUp, ArrowUpFromLine, DollarSign, Gift, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { AppNotification, NotificationPriority } from '@/data/notifications';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const iconMap: Record<string, typeof Bell> = {
  ShoppingCart, ShieldAlert, Sparkles, ArrowDownToLine, Trophy, Bell, Settings, TrendingUp, ArrowUpFromLine, DollarSign, Gift, Lock,
};

const priorityConfig: Record<NotificationPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-danger/10 text-danger' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning' },
  low: { label: 'Low', className: 'bg-primary/10 text-primary' },
};

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  delay?: number;
}

export function NotificationCard({ notification, onMarkRead, onDelete, delay = 0 }: NotificationCardProps) {
  const Icon = iconMap[notification.icon] ?? Bell;
  const priority = priorityConfig[notification.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={cn(
        'flex items-start gap-3 p-3 transition-colors',
        notification.read ? 'bg-card/40' : 'border-primary/20 bg-primary/5',
      )}>
        <div className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          notification.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary',
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                <p className="truncate text-sm font-semibold">{notification.title}</p>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{notification.description}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{formatRelativeTime(notification.timestamp)}</span>
                <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', priority.className)}>{priority.label}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {!notification.read && onMarkRead && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  title="Mark as read"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(notification.id)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-danger"
                  title="Delete"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
