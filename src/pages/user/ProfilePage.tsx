import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Briefcase,
  TrendingUp,
  Pencil,
  BadgeCheck,
  Crown,
  Receipt,
  Wallet,
  GraduationCap,
  Award,
  BookOpen,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { formatCurrency, getCurrencySymbol } from '@/lib/currency';
import {
  backendApi,
  type BackendUserResponse,
  type BackendPortfolio,
  type BackendPage,
  type BackendOrder,
  type BackendAcademyOverview,
  getApiErrorMessage,
} from '@/services/backend';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<BackendUserResponse | null>(null);
  const [portfolio, setPortfolio] = useState<BackendPortfolio | null>(null);
  const [orders, setOrders] = useState<BackendPage<BackendOrder> | null>(null);
  const [academy, setAcademy] = useState<BackendAcademyOverview | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [userRes, portRes, ordRes, acadRes] = await Promise.allSettled([
        backendApi.me(),
        backendApi.portfolio(),
        backendApi.orders(0, 100),
        backendApi.academyOverview(),
      ]);

      if (userRes.status === 'fulfilled') {
        setUser(userRes.value);
      } else {
        throw new Error(getApiErrorMessage(userRes.reason, 'Unable to load profile.'));
      }

      if (portRes.status === 'fulfilled') {
        setPortfolio(portRes.value);
      }
      if (ordRes.status === 'fulfilled') {
        setOrders(ordRes.value);
      }
      if (acadRes.status === 'fulfilled') {
        setAcademy(acadRes.value);
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
      setError(err instanceof Error ? err.message : 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfileData();
  }, [loadProfileData]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-red-500 font-semibold">{error || 'Unable to load profile.'}</p>
          <Button className="mt-4" onClick={() => void loadProfileData()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const currency = user.currency || 'USD';
  const currencySymbol = getCurrencySymbol(currency);
  const activeTier = user.subscriptionTier?.toUpperCase() === 'FREE' ? 'STANDARD' : (user.subscriptionTier?.toUpperCase() || 'STANDARD');
  const planDisplay = activeTier === 'PLUS' ? 'Plus Plan' : activeTier === 'PRO' ? 'Pro Plan' : 'Standard Plan';

  const totalAccountValue = portfolio?.totalAccountValue ?? 0;
  const totalPnL = portfolio?.totalPnL ?? 0;
  const returnPercentage = portfolio?.returnPercentage ?? 0;
  const totalTrades = orders?.totalElements ?? 0;
  const availableCash = portfolio?.cashBalance ?? 0;
  const investedValue = portfolio?.investedValue ?? 0;
  const totalHoldings = portfolio?.totalHoldings ?? 0;
  const coinsBalance = academy?.coinsBalance ?? 0;
  const lessonsCompleted = academy?.totalLessonsCompleted ?? 0;
  const earnedBadges = academy?.badges ?? [];

  const quickStats = [
    {
      label: 'Portfolio Value',
      value: totalAccountValue,
      icon: Wallet,
      trend: `${totalPnL >= 0 ? '+' : ''}${formatCurrency(totalPnL, currency)} total P&L`,
      positive: totalPnL >= 0,
    },
    {
      label: 'Total P&L',
      value: totalPnL,
      icon: TrendingUp,
      trend: `${returnPercentage >= 0 ? '+' : ''}${returnPercentage.toFixed(2)}% return`,
      positive: totalPnL >= 0,
    },
    {
      label: 'Total Trades',
      value: totalTrades,
      isNumber: true,
      icon: Receipt,
      trend: `${totalTrades} simulated order${totalTrades === 1 ? '' : 's'}`,
      positive: true,
    },
    {
      label: 'Available Cash',
      value: availableCash,
      icon: DollarSign,
      trend: 'Virtual simulation capital',
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="relative overflow-hidden p-0">
          <div className="h-32 w-full bg-gradient-to-r from-primary/80 via-primary to-chart-2/80" />
          <div className="px-5 pb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                {/* Avatar */}
                <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
                  {user.fullName
                    ? user.fullName
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((name) => name[0]?.toUpperCase())
                        .join('')
                    : user.username?.slice(0, 2)?.toUpperCase()}
                </div>
                <div className="sm:pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display text-xl font-bold tracking-tight">{user.fullName || user.username}</h1>
                    {user.emailVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-semibold uppercase tracking-wider',
                        activeTier === 'PRO'
                          ? 'border-primary/50 bg-primary/10 text-primary'
                          : activeTier === 'PLUS'
                          ? 'border-chart-2/50 bg-chart-2/10 text-chart-2'
                          : 'border-muted-foreground/30 bg-muted/40 text-muted-foreground',
                      )}
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      {planDisplay}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.country ? user.country : 'Country not specified'}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Currency: {currency} ({currencySymbol})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:mb-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/billing')}>
                  <Crown className="h-3.5 w-3.5 text-primary" />
                  Plans & Billing
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/settings')}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="p-4 transition-shadow hover:shadow-card-hover">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-display text-lg font-bold tabular-nums">
                {stat.isNumber ? (
                  stat.value
                ) : (
                  <AnimatedCounter value={stat.value} prefix={currencySymbol} decimals={2} />
                )}
              </p>
              <p className={cn('mt-1 text-xs font-medium', stat.positive ? 'text-success' : 'text-danger')}>
                {stat.trend}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Main Column */}
        <div className="space-y-4">
          {/* Personal Information */}
          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-semibold">Personal Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem icon={Briefcase} label="Account Role" value={user.role || 'USER'} />
              <InfoItem icon={MapPin} label="Location" value={user.country ? user.country : 'Not specified'} />
              <InfoItem icon={DollarSign} label="Preferred Currency" value={`${currency} (${currencySymbol})`} />
              <InfoItem icon={Crown} label="Subscription Tier" value={planDisplay} />
            </div>
          </Card>

          {/* Investment & Learning Stats */}
          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-semibold">Investment & Learning Summary</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Invested Assets</p>
                  <p className="text-sm font-semibold">{formatCurrency(investedValue, currency)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Active Positions</p>
                  <p className="text-sm font-semibold">{totalHoldings} stocks</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Academy Lessons</p>
                  <p className="text-sm font-semibold">{lessonsCompleted} Completed</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Velora Coins</p>
                  <p className="text-sm font-semibold">{coinsBalance} Coins</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Earned Badges */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold">Earned Badges</h3>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate('/study')}>
                <BookOpen className="h-3.5 w-3.5" />
                Academy
              </Button>
            </div>
            {earnedBadges.length === 0 ? (
              <Card className="p-6 text-center border-dashed">
                <Award className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm font-semibold">No badges unlocked yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Complete lessons and pass interactive quizzes in the Velora Academy to unlock certification badges and earn virtual coins.
                </p>
                <Button size="sm" className="mt-3 gap-1.5" onClick={() => navigate('/study')}>
                  <GraduationCap className="h-3.5 w-3.5" />
                  Explore Academy
                </Button>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {earnedBadges.map((badge) => (
                  <Card key={badge.badgeCode} className="flex items-center gap-3 p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{badge.badgeName}</p>
                      <p className="text-xs text-muted-foreground truncate">{badge.description}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Account Details */}
          <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-semibold">Contact & Security</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-xs sm:text-sm">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium text-xs sm:text-sm">{user.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Verification</span>
                <span className={cn('text-xs font-semibold', user.emailVerified ? 'text-success' : 'text-warning')}>
                  {user.emailVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className="text-[11px] uppercase border-success/30 bg-success/10 text-success">
                  {user.subscriptionStatus || 'ACTIVE'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5 space-y-2.5">
            <h3 className="font-display text-base font-semibold mb-3">Quick Navigation</h3>
            <Button variant="outline" className="w-full justify-start text-xs gap-2" onClick={() => navigate('/portfolio')}>
              <Wallet className="h-4 w-4 text-primary" />
              View Portfolio & Holdings
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs gap-2" onClick={() => navigate('/wallet')}>
              <DollarSign className="h-4 w-4 text-primary" />
              Virtual Ledger & Wallet
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs gap-2" onClick={() => navigate('/transactions')}>
              <Receipt className="h-4 w-4 text-primary" />
              Transaction History
            </Button>
            <Button variant="outline" className="w-full justify-start text-xs gap-2" onClick={() => navigate('/study')}>
              <GraduationCap className="h-4 w-4 text-primary" />
              Velora Academy & Rewards
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
