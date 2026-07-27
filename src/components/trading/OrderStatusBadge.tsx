import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/trading';

const config: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success border-success/20' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground border-border' },
  rejected: { label: 'Rejected', className: 'bg-danger/10 text-danger border-danger/20' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const c = config[status];
  return (
    <Badge variant="outline" className={cn('border text-xs font-medium', c.className)}>
      {c.label}
    </Badge>
  );
}
