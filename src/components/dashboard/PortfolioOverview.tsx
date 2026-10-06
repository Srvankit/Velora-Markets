import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Zap, Briefcase, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export interface PortfolioOverviewProps {
  portfolio?: BackendPortfolio | null;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export function PortfolioOverview({
  portfolio: propPortfolio,
  loading: propLoading,
  error: propError,
  onRetry,
}: PortfolioOverviewProps = {}) {
  const { user, isAuthenticated } = useAuth();
  const currency = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currency);
  const [internalPortfolio, setInternalPortfolio] = useState<BackendPortfolio | null>(null);
  const [internalLoading, setInternalLoading] = useState(isAuthenticated && propPortfolio === undefined);
  const [internalError, setInternalError] = useState(false);

  const isControlled = propPortfolio !== undefined || propLoading !== undefined || propError !== undefined;
  const portfolio = isControlled ? propPortfolio : internalPortfolio;
  const loading = isControlled ? (propLoading ?? false) : internalLoading;
  const error = isControlled ? (propError ?? false) : internalError;

  useEffect(() => {
    if (isControlled) return;
    if (!isAuthenticated) {
      setInternalPortfolio(null);
      setInternalLoading(false);
      return;
    }

    setInternalLoading(true);
    setInternalError(false);
    backendApi
      .portfolio()
      .then(setInternalPortfolio)
      .catch((err) => {
        console.error('Failed to load portfolio:', err);
        setInternalError(true);
      })
      .finally(() => setInternalLoading(false));
  }, [isControlled, isAuthenticated]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="h-36 animate-pulse bg-muted/30" />
        ))}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Virtual Portfolio</h3>
            <p className="text-xs text-muted-foreground">Sign in to view your virtual holdings, trading balance, and live P&L.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" asChild>
          <a href="/login">Sign In</a>
        </Button>
      </Card>
    );
  }

  if (error || !portfolio) {
    return (
      <Card className="flex items-center justify-between p-5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-4 w-4 text-warning" />
          <span>Unable to load portfolio data.</span>
        </div>
        {onRetry && (
          <Button size="sm" variant="outline" className="gap-1.5" onClick={onRetry}>
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </Button>
        )}
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