import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartContainerProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function ChartContainer({
  title,
  action,
  children,
  className,
  bodyClassName,
}: ChartContainerProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5 shadow-card', className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="font-display text-base font-semibold">{title}</h3>}
          {action}
        </div>
      )}
      <div className={cn(bodyClassName)}>{children}</div>
    </div>
  );
}
