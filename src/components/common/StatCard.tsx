import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  accent?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
  delay?: number;
}

const accentMap = {
  primary: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-danger bg-danger/10',
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  accent = 'primary',
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      <Card className={cn('relative overflow-hidden p-5 transition-shadow hover:shadow-card-hover', className)}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="font-display text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className={cn('text-xs font-medium', trend.positive ? 'text-success' : 'text-danger')}>
                {trend.value}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', accentMap[accent])}>
              {icon}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
