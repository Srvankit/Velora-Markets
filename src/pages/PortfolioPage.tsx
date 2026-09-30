import {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Share2, TrendingUp, TrendingDown, PieChart, Shield, Target, Clock, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkline } from '@/components/common/Sparkline';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { EmptyState } from '@/components/common/EmptyState';
import { PortfolioSummaryCard } from '@/components/portfolio/PortfolioSummaryCard';
import { PerformanceChart } from '@/components/portfolio/PerformanceChart';
import { AllocationChart } from '@/components/portfolio/AllocationChart';
import { SectorChart } from '@/components/portfolio/SectorChart';
import { RiskCard } from '@/components/portfolio/RiskCard';
import { GoalCard } from '@/components/portfolio/GoalCard';
import { DividendCard } from '@/components/portfolio/DividendCard';
import { Timeline } from '@/components/portfolio/Timeline';
import { ActivityFeed } from '@/components/portfolio/ActivityFeed';
import { AIInsightsCard } from '@/components/portfolio/AIInsightsCard';
import { topPerformers, worstPerformers, pnlSummary } from '@/data/portfolio';
import { investmentGoals } from '@/data/goals';
import {
  backendApi,
  type BackendPortfolio,
} from '@/services/backend';
import { useAuth } from '@/contexts/auth-context';
import { getCurrencySymbol, formatCurrency } from '@/lib/currency';
import { formatPercent, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';
  const currencySymbol = getCurrencySymbol(currency);
  const [portfolio, setPortfolio] =
  useState<BackendPortfolio | null>(null);

const [loading, setLoading] =
  useState(true);

const [refreshing, setRefreshing] =
  useState(false);

const [error, setError] =
  useState<string | null>(null);

const loadPortfolio = useCallback(
  async (manualRefresh = false) => {
    try {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response =
        await backendApi.portfolio();

      setPortfolio(response);
    } catch (err) {
      console.error(
        'Failed to load portfolio:',
        err,
      );

      setError(
        'Unable to load portfolio.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  },
  [],
);

useEffect(() => {
  void loadPortfolio();
}, [loadPortfolio]);

const holdings =
  portfolio?.holdings ?? [];

const hasHoldings =
  holdings.length > 0;

  const summaryCards = useMemo(() => {
  if (!portfolio) {
    return [];
  }

  const totalPnL =
    portfolio.totalPnL ?? 0;

  const returnPercentage =
    portfolio.returnPercentage ?? 0;

  const values = [
    portfolio.totalAccountValue,
    portfolio.marketValue,
    portfolio.investedValue,
    portfolio.cashBalance,
  ];

  return [
    {
      label: 'Total Portfolio Value',
      value:
        portfolio.totalAccountValue,
      change: totalPnL,
      changePercent:
        returnPercentage,
      sparkline: values,
    },

    {
      label: 'Total P&L',
      value: totalPnL,
      change: totalPnL,
      changePercent:
        returnPercentage,
      sparkline: values,
    },

    {
      label: 'Overall Return',
      value: totalPnL,
      change: totalPnL,
      changePercent:
        returnPercentage,
      sparkline: values,
    },

    {
      label: 'Invested Amount',
      value:
        portfolio.investedValue,
      sparkline: values,
    },

    {
      label: 'Current Value',
      value:
        portfolio.marketValue,
      change:
        portfolio.unrealizedPnL,
      changePercent:
        returnPercentage,
      sparkline: values,
    },

    {
      label: 'Available Cash',
      value:
        portfolio.cashBalance,
      sparkline: values,
    },

    {
      label: 'Buying Power',
      value:
        portfolio.cashBalance,
      sparkline: values,
    },

    {
      label: 'Net Worth',
      value:
        portfolio.totalAccountValue,
      change: totalPnL,
      changePercent:
        returnPercentage,
      sparkline: values,
    },
  ];
}, [portfolio]);

  const pnlStats = [
  {
    label: 'Realized P&L',
    value:
      portfolio?.realizedPnL ?? 0,
    positive:
      (portfolio?.realizedPnL ?? 0) >=
      0,
  },

  {
    label: 'Unrealized P&L',
    value:
      portfolio?.unrealizedPnL ?? 0,
    positive:
      (portfolio?.unrealizedPnL ??
        0) >= 0,
  },

  {
    label: 'Total P&L',
    value:
      portfolio?.totalPnL ?? 0,
    positive:
      (portfolio?.totalPnL ?? 0) >=
      0,
  },
];

 const handleRefresh = () => {
  void loadPortfolio(true);
};

  return (
    <div className="space-y-6">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-success">Market Open</span>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </motion.div>

      {!hasHoldings ? (
        <EmptyState
          icon={<PieChart className="h-5 w-5" />}
          title="Your portfolio is empty"
          description="Start trading to build your portfolio and unlock detailed analytics, performance charts, and AI insights."
          action={<Button size="sm" onClick={() => (window.location.href = '/trade')}>Start Trading</Button>}
          className="py-16"
        />
      ) : (
        <>
          {/* Portfolio Overview KPI Cards */}
          <section>
            <SectionTitle icon={TrendingUp} title="Portfolio Overview" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card, i) => (
                <PortfolioSummaryCard key={card.label} {...card} prefix={currencySymbol} delay={i * 0.04} />
              ))}
            </div>
          </section>

          {/* Performance Chart + Asset Allocation */}
          <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
            <PerformanceChart />
            <AllocationChart />
          </div>

          {/* P&L Summary */}
          <section>
            <SectionTitle icon={Activity} title="Profit & Loss" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {pnlStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className={cn('mt-1 text-sm font-bold tabular-nums', stat.positive ? 'text-success' : 'text-danger')}>
                      <AnimatedCounter value={stat.value} prefix={currencySymbol} decimals={2} />
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Card className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Best Day</p>
                  <p className="mt-0.5 text-sm font-bold text-success">
                    +<AnimatedCounter value={pnlSummary.bestDay.amount} prefix={currencySymbol} decimals={2} />
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(pnlSummary.bestDay.date)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success/30" />
              </Card>
              <Card className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Worst Day</p>
                  <p className="mt-0.5 text-sm font-bold text-danger">
                    <AnimatedCounter value={pnlSummary.worstDay.amount} prefix={currencySymbol} decimals={2} />
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(pnlSummary.worstDay.date)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-danger/30" />
              </Card>
            </div>
          </section>

          {/* Sector Allocation */}
          <section>
            <SectionTitle icon={PieChart} title="Sector Allocation" />
            <SectorChart />
          </section>

          {/* Top Performers + Worst Performers */}
          <div className="grid gap-4 lg:grid-cols-2">
            <PerformerSection title="Top Performers" performers={topPerformers} positive />
            <PerformerSection title="Worst Performers" performers={worstPerformers} positive={false} />
          </div>

          {/* Risk Analysis */}
          <section>
            <SectionTitle icon={Shield} title="Risk Analysis" />
            <RiskCard />
          </section>

          {/* AI Insights */}
          <AIInsightsCard />

          {/* Investment Goals */}
          <section>
            <SectionTitle icon={Target} title="Investment Goals" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {investmentGoals.map((goal, i) => (
                <GoalCard key={goal.id} goal={goal} delay={i * 0.05} />
              ))}
            </div>
          </section>

          {/* Dividend Tracker + Recent Activity */}
          <div className="grid gap-4 lg:grid-cols-2">
            <DividendCard />
            <ActivityFeed />
          </div>

          {/* Portfolio Timeline */}
          <section>
            <SectionTitle icon={Clock} title="Portfolio Timeline" />
            <Timeline />
          </section>
        </>
      )}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: typeof TrendingUp; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function PerformerSection({ title, performers, positive }: { title: string; performers: typeof topPerformers; positive: boolean }) {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  return (
    <section>
      <SectionTitle icon={positive ? TrendingUp : TrendingDown} title={title} />
      <div className="space-y-2">
        {performers.map((stock, i) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: positive ? -8 : 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/40">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: stock.logoColor }}>
                {stock.symbol.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{stock.symbol}</p>
                <p className="truncate text-xs text-muted-foreground">{stock.name}</p>
              </div>
              <Sparkline data={stock.sparkline} width={56} height={24} positive={stock.returnPercent >= 0} />
              <div className="text-right">
                <p className={cn('text-sm font-bold tabular-nums', positive ? 'text-success' : 'text-danger')}>
                  {formatPercent(stock.returnPercent)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(stock.profit, currency, { compact: true })}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
