import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Zap, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { backendApi, type BackendPortfolio } from '@/services/backend';
import { useAuth } from '@/contexts/auth-context';
import { getCurrencySymbol, formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

const accentClasses = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

export function PortfolioOverview() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currency);
  const [portfolio, setPortfolio] = useState<BackendPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendApi
      .portfolio()
      .then(setPortfolio)
      .catch((error) => {
        console.error('Failed to load portfolio:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="h-36 animate-pulse bg-muted/30" />
        ))}
      </div>
    );
  }

  if (!portfolio) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        Unable to load portfolio data.
      </Card>
    );
  }

  const stats = [
    {
      label: 'Portfolio Value',
      value: portfolio.totalAccountValue,
      icon: Wallet,
      accent: 'primary' as const,
      trend: `Total P&L: ${portfolio.totalPnL >= 0 ? '+' : ''}${formatCurrency(portfolio.totalPnL, currency)}`,
      positive: portfolio.totalPnL >= 0,
    },
    {
      label: 'Total P&L',
      value: portfolio.totalPnL,
      icon: TrendingUp,
      accent: portfolio.totalPnL >= 0 ? 'success' as const : 'danger' as const,
      trend: `${portfolio.returnPercentage >= 0 ? '+' : ''}${portfolio.returnPercentage.toFixed(2)}% return`,
      positive: portfolio.totalPnL >= 0,
    },
    {
      label: 'Buying Power',
      value: portfolio.cashBalance,
      icon: Zap,
      accent: 'warning' as const,
      trend: 'Available to trade',
      positive: true,
    },
    {
      label: 'Total Investments',
      value: portfolio.investedValue,
      icon: Briefcase,
      accent: 'primary' as const,
      trend: `${portfolio.totalHoldings} active holding${portfolio.totalHoldings === 1 ? '' : 's'}`,
      positive: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
          >
            <Card className="group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>

                  <p className="font-display text-2xl font-bold tracking-tight">
                    <AnimatedCounter
                      value={stat.value}
                      prefix={currencySymbol}
                      decimals={2}
                    />
                  </p>

                  <p
                    className={cn(
                      'text-xs font-medium',
                      stat.positive ? 'text-success' : 'text-danger',
                    )}
                  >
                    {stat.trend}
                  </p>
                </div>

                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    accentClasses[stat.accent],
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}