import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 16, className, label }: LoadingSpinnerProps) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      <Loader2 className="animate-spin" style={{ width: size, height: size }} />
      {label && <span className="ml-2">{label}</span>}
    </span>
  );
}
