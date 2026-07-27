import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: string[];
  current: number;
  className?: string;
}

/**
 * Horizontal progress indicator for multi-step flows.
 * `current` is 0-indexed; completed steps show a check.
 */
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center">
        {steps.map((label, i) => {
          const completed = i < current;
          const active = i === current;
          const isLast = i === steps.length - 1;
          return (
            <div key={label} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{
                    scale: active ? 1.1 : 1,
                    backgroundColor: completed || active ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold',
                    completed || active
                      ? 'text-primary-foreground shadow-glow-sm'
                      : 'text-muted-foreground',
                  )}
                >
                  {completed ? <Check className="h-4 w-4" /> : i + 1}
                </motion.div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-muted sm:mx-3">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={false}
                    animate={{ width: i < current ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
