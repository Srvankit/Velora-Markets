import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, Lock, TrendingUp, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency, getCurrencySymbol } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface WalletBalanceCardProps {
  balance: number;
  buyingPower: number;
  blockedAmount: number;
  investedAmount: number;
  profitAvailable: number;
  rewardsBalance: number;
}

export function WalletBalanceCard({
  balance,
  buyingPower,
  blockedAmount,
  investedAmount,
  profitAvailable,
  rewardsBalance,
}: WalletBalanceCardProps) {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currency);

  const items = [
    { icon: TrendingUp, label: 'Buying Power', value: buyingPower, color: 'text-primary' },
    { icon: Lock, label: 'Blocked', value: blockedAmount, color: 'text-warning' },
    { icon: Wallet, label: 'Invested', value: investedAmount, color: 'text-chart-2' },
    { icon: ArrowUpRight, label: 'Profit Available', value: profitAvailable, color: 'text-success' },
    { icon: Gift, label: 'Rewards', value: rewardsBalance, color: 'text-chart-3' },
  ];

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
            <p className="font-display text-3xl font-bold tracking-tight">
              <AnimatedCounter value={balance} prefix={currencySymbol} decimals={2} duration={1.5} />
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <item.icon className={cn('h-3 w-3', item.color)} />
                {item.label}
              </div>
              <p className={cn('text-sm font-semibold tabular-nums', item.color)}>
                {formatCurrency(item.value, currency)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
