import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, MailWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scaleIn } from '@/lib/animations';

type Variant = 'success' | 'failed' | 'warning';

const config: Record<Variant, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  failed: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' },
  warning: { icon: MailWarning, color: 'text-warning', bg: 'bg-warning/10' },
};

interface AuthSuccessProps {
  variant?: Variant;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
}

export function AuthSuccess({
  variant = 'success',
  title,
  description,
  action,
  secondaryAction,
}: AuthSuccessProps) {
  const { icon: Icon, color, bg } = config[variant];
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-5 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className={`flex h-20 w-20 items-center justify-center rounded-full ${bg}`}
      >
        <Icon className={`h-10 w-10 ${color}`} strokeWidth={2} />
      </motion.div>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">{description}</p>
      </div>
      {(action || secondaryAction) && (
        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {action}
          {secondaryAction}
        </div>
      )}
    </motion.div>
  );
}

export function AuthSuccessCard({
  variant = 'success',
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: {
  variant?: Variant;
  title: string;
  description: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <AuthSuccess
      variant={variant}
      title={title}
      description={description}
      action={actionLabel ? <Button onClick={onAction} className="w-full sm:w-auto">{actionLabel}</Button> : undefined}
      secondaryAction={secondaryLabel ? <Button variant="outline" onClick={onSecondary} className="w-full sm:w-auto">{secondaryLabel}</Button> : undefined}
    />
  );
}
