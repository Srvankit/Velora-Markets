import { motion } from 'framer-motion';
import { Gift, Users, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { rewards, rewardSummary, rewardTypeLabels, type RewardType } from '@/data/rewards';
import { formatCurrency, formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const typeIcons: Record<RewardType, typeof Gift> = {
  cashback: Gift,
  referral: Users,
  investment: TrendingUp,
  milestone: Award,
};

const typeColors: Record<RewardType, string> = {
  cashback: 'bg-success/10 text-success',
  referral: 'bg-primary/10 text-primary',
  investment: 'bg-chart-2/10 text-chart-2',
  milestone: 'bg-chart-3/10 text-chart-3',
};

export function RewardsCard() {
  const summaryStats = [
    { label: 'Total Earned', value: rewardSummary.totalEarned, prefix: '$' },
    { label: 'Available', value: rewardSummary.available, prefix: '$' },
    { label: 'Pending', value: rewardSummary.pending, prefix: '$' },
    { label: 'This Month', value: rewardSummary.thisMonth, prefix: '$' },
  ];

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <Gift className="h-4 w-4 text-primary" />
        <h3 className="font-display text-base font-semibold">Rewards</h3>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-lg border border-border bg-card/40 p-3"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-sm font-bold tabular-nums">
              <AnimatedCounter value={stat.value} prefix={stat.prefix} decimals={2} />
            </p>
          </motion.div>
        ))}
      </div>

      <p className="mb-2 text-xs font-medium text-muted-foreground">Reward History</p>
      <div className="space-y-2">
        {rewards.map((reward, i) => {
          const Icon = typeIcons[reward.type];
          const colorClass = typeColors[reward.type];
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-3 rounded-lg border border-border/50 p-2.5 transition-colors hover:bg-accent/40"
            >
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', colorClass)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{reward.title}</p>
                <p className="truncate text-xs text-muted-foreground">{reward.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums text-success">+{formatCurrency(reward.amount)}</p>
                <div className="flex items-center justify-end gap-1.5">
                  {reward.status === 'pending' && <Badge variant="outline" className="border-0 bg-warning/10 text-[10px] text-warning">Pending</Badge>}
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(reward.date)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
