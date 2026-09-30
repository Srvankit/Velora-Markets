import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getGoalProgress, getEstimatedCompletion, type InvestmentGoal } from '@/data/goals';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: InvestmentGoal;
  delay?: number;
}

export function GoalCard({ goal, delay = 0 }: GoalCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currency = user?.currency || 'INR';
  const progress = getGoalProgress(goal);
  const completion = getEstimatedCompletion(goal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
    >
      <Card className="p-4 transition-shadow hover:shadow-card-hover">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{goal.name}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(goal.targetAmount, currency, { compact: true })} target</p>
          </div>
          <span
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold"
            style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
          >
            {progress.toFixed(0)}%
          </span>
        </div>

        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: delay + 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: goal.color }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="font-medium tabular-nums">{formatCurrency(goal.currentAmount, currency, { compact: true })}</span>
            <span className="text-muted-foreground">Est. {completion}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
          <span className="text-muted-foreground">
            {formatCurrency(goal.monthlyContribution, currency, { compact: true })}/mo
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => navigate('/trade')}
          >
            Contribute
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export function GoalCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-card p-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
        </div>
        <div className="h-6 w-12 rounded bg-muted" />
      </div>
      <div className="mt-4 h-2 rounded-full bg-muted" />
      <div className="mt-3 flex justify-between">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-3 w-12 rounded bg-muted" />
      </div>
    </div>
  );
}
