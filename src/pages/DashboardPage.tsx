import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Newspaper, Sparkles, Calendar, Gauge } from 'lucide-react';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { WatchlistPreview } from '@/components/dashboard/WatchlistPreview';
import { HoldingsTable } from '@/components/dashboard/HoldingsTable';
import { PortfolioCharts } from '@/components/dashboard/PortfolioCharts';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { MarketNews } from '@/components/dashboard/MarketNews';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { MarketSentiment } from '@/components/dashboard/MarketSentiment';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { useAuth } from '@/contexts/auth-context';
import { backendApi, type BackendPortfolio } from '@/services/backend';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState<BackendPortfolio | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(isAuthenticated);
  const [portfolioError, setPortfolioError] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    if (!isAuthenticated) {
      setPortfolio(null);
      setPortfolioLoading(false);
      setPortfolioError(false);
      return;
    }

    try {
      setPortfolioLoading(true);
      setPortfolioError(false);
      const data = await backendApi.portfolio();
      setPortfolio(data);
    } catch (err) {
      console.error('Failed to load portfolio on dashboard:', err);
      setPortfolioError(true);
    } finally {
      setPortfolioLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void fetchPortfolio();
  }, [fetchPortfolio]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <WelcomeSection />
      </motion.div>

      <motion.div variants={staggerItem}>
        <PortfolioOverview
          portfolio={portfolio}
          loading={portfolioLoading}
          error={portfolioError}
          onRetry={fetchPortfolio}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <SectionHeading icon={TrendingUp} title="Market Overview" />
        <MarketOverview />
      </motion.div>

      <motion.div variants={staggerItem}>
        <SectionHeading icon={Star} title="Watchlist" action={<a href="/watchlist" className="text-xs font-medium text-primary hover:text-primary/80">View all</a>} />
        <WatchlistPreview />
      </motion.div>

      <motion.div variants={staggerItem}>
        <QuickActions />
      </motion.div>

      <motion.div variants={staggerItem}>
        <AIInsights />
      </motion.div>

      <motion.div variants={staggerItem}>
        <PortfolioCharts
          portfolio={portfolio}
          loading={portfolioLoading}
          error={portfolioError}
        />
      </motion.div>

      <motion.div variants={staggerItem}>
        <HoldingsTable
          portfolio={portfolio}
          loading={portfolioLoading}
          error={portfolioError}
          onRetry={fetchPortfolio}
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <SectionHeading icon={Gauge} title="Market Sentiment" />
          <MarketSentiment />
        </motion.div>
        <motion.div variants={staggerItem}>
          <SectionHeading icon={Calendar} title="Upcoming Events" />
          <UpcomingEvents />
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={staggerItem}>
          <SectionHeading icon={Sparkles} title="Recent Transactions" />
          <RecentTransactions />
        </motion.div>
        <motion.div variants={staggerItem}>
          <SectionHeading icon={Newspaper} title="Market News" />
          <MarketNews />
        </motion.div>
      </div>
    </motion.div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  action,
}: {
  icon: typeof TrendingUp;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}
