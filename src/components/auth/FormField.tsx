import { type ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input, type InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
}

/**
 * Accessible form field with animated label, icon, hint, and error states.
 * Built on the existing Input and Label primitives.
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, icon, trailing, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <Input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={cn(
              'h-11 rounded-lg bg-card/60 transition-colors',
              icon && 'pl-10',
              trailing && 'pr-10',
              error && 'border-danger focus-visible:ring-danger',
              className,
            )}
            {...props}
          />
          {trailing && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</span>
          )}
        </div>
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-medium text-danger"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground"
            >
              {hint}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);
FormField.displayName = 'FormField';
