import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  CreditCard,
  Receipt,
  FileDown,
  RefreshCw,
  Download,
  Bell,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { WalletBalanceCard } from '@/components/wallet/WalletBalanceCard';
import { WalletSummaryCard } from '@/components/wallet/WalletSummaryCard';
import { CashFlowChart } from '@/components/wallet/CashFlowChart';
import { RewardsCard } from '@/components/wallet/RewardsCard';
import { SecurityCard } from '@/components/wallet/SecurityCard';
import { AIWalletInsights } from '@/components/wallet/AIWalletInsights';

import {
  walletNotifications,
} from '@/data/wallet';

import {
  formatCurrency,
  formatRelativeTime,
} from '@/lib/format';

import { cn } from '@/lib/utils';

import {
  backendApi,
  type BackendPortfolio,
  type BackendTransaction,
} from '@/services/backend';

const quickActions = [
  {
    icon: ArrowDownToLine,
    label: 'Deposit',
    color: 'bg-success/10 text-success',
    action: 'deposit',
  },
  {
    icon: ArrowUpFromLine,
    label: 'Withdraw',
    color: 'bg-danger/10 text-danger',
    action: 'withdraw',
  },
  {
    icon: ArrowLeftRight,
    label: 'Transfer',
    color: 'bg-primary/10 text-primary',
    action: 'transfer',
  },
  {
    icon: CreditCard,
    label: 'Payment Methods',
    color: 'bg-chart-2/10 text-chart-2',
    action: 'payment-methods',
  },
  {
    icon: Receipt,
    label: 'Transactions',
    color: 'bg-chart-3/10 text-chart-3',
    action: 'transactions',
  },
  {
    icon: FileDown,
    label: 'Statement',
    color: 'bg-chart-4/10 text-chart-4',
    action: 'statement',
  },
];

export default function WalletPage() {
  const navigate = useNavigate();

  const [portfolio, setPortfolio] =
    useState<BackendPortfolio | null>(null);

  const [transactions, setTransactions] =
    useState<BackendTransaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // =========================================================
  // LOAD REAL BACKEND DATA
  // =========================================================

  const loadWalletData = useCallback(
    async (manualRefresh = false) => {
      try {
        if (manualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const [
          portfolioResponse,
          transactionResponse,
        ] = await Promise.all([
          backendApi.portfolio(),
          backendApi.transactions(0, 5),
        ]);

        setPortfolio(portfolioResponse);

        setTransactions(
          transactionResponse.content,
        );
      } catch (err) {
        console.error(
          'Failed to load wallet data:',
          err,
        );

        setError(
          'Unable to load wallet data.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadWalletData();
  }, [loadWalletData]);

  // =========================================================
  // REAL VALUES
  // =========================================================

  const cashBalance =
    portfolio?.cashBalance ?? 0;

  const investedAmount =
    portfolio?.investedValue ?? 0;

  const buyingPower =
    portfolio?.cashBalance ?? 0;

  const totalPnL =
    portfolio?.totalPnL ?? 0;

  const realizedPnL =
    portfolio?.realizedPnL ?? 0;

  const unrealizedPnL =
    portfolio?.unrealizedPnL ?? 0;

  const accountValue =
    portfolio?.totalAccountValue ?? 0;

  // We do NOT have wallet APIs for these yet.
  const blockedAmount = 0;
  const rewardsBalance = 0;

  const summaryCards = [
    {
      label: 'Cash Balance',
      value: cashBalance,
      sparkline: [
        cashBalance,
        cashBalance,
        cashBalance,
        cashBalance,
        cashBalance,
        cashBalance,
      ],
    },
    {
      label: 'Buying Power',
      value: buyingPower,
      sparkline: [
        buyingPower,
        buyingPower,
        buyingPower,
        buyingPower,
        buyingPower,
        buyingPower,
      ],
    },
    {
      label: 'Invested',
      value: investedAmount,
      sparkline: [
        investedAmount,
        investedAmount,
        investedAmount,
        investedAmount,
        investedAmount,
        investedAmount,
      ],
    },
    {
      label: 'Account Value',
      value: accountValue,
      sparkline: [
        accountValue,
        accountValue,
        accountValue,
        accountValue,
        accountValue,
        accountValue,
      ],
    },
    {
      label: 'Realized P&L',
      value: realizedPnL,
      change: realizedPnL,
      sparkline: [
        0,
        0,
        0,
        realizedPnL,
        realizedPnL,
        realizedPnL,
      ],
    },
    {
      label: 'Unrealized P&L',
      value: unrealizedPnL,
      change: unrealizedPnL,
      sparkline: [
        0,
        0,
        0,
        unrealizedPnL,
        unrealizedPnL,
        unrealizedPnL,
      ],
    },
  ];

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  const handleAction = (action: string) => {
    switch (action) {
      case 'transactions':
        navigate('/transactions');
        break;

      case 'statement':
        navigate('/transactions');
        break;

      case 'payment-methods':
        navigate('/payment-methods');
        break;

      case 'deposit':
      case 'withdraw':
      case 'transfer':
        // No real backend wallet endpoints yet.
        console.info(
          `${action} backend is not implemented yet.`,
        );
        break;
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-xl bg-muted/30" />
        <div className="h-44 animate-pulse rounded-xl bg-muted/30" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl bg-muted/30"
              />
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >

        <div className="space-y-1">

          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Wallet
          </h1>

          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString(
              'en-US',
              {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              },
            )}
          </p>

        </div>

        <div className="flex items-center gap-2">

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              void loadWalletData(true)
            }
            disabled={refreshing}
          >
            <RefreshCw
              className={cn(
                'h-3.5 w-3.5',
                refreshing &&
                  'animate-spin',
              )}
            />

            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              navigate('/transactions')
            }
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>

        </div>

      </motion.div>

      {/* ERROR */}

      {error && (
        <Card className="border-danger/30 bg-danger/5 p-4">
          <p className="text-sm text-danger">
            {error}
          </p>
        </Card>
      )}

      {/* =====================================================
          REAL WALLET / PORTFOLIO BALANCE
      ====================================================== */}

      <WalletBalanceCard
        balance={cashBalance}
        buyingPower={buyingPower}
        blockedAmount={blockedAmount}
        investedAmount={investedAmount}
        profitAvailable={totalPnL}
        rewardsBalance={rewardsBalance}
      />

      {/* =====================================================
          REAL KPI CARDS
      ====================================================== */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

        {summaryCards.map(
          (card, i) => (
            <WalletSummaryCard
              key={card.label}
              {...card}
              delay={i * 0.04}
            />
          ),
        )}

      </div>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <section>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">

          {quickActions.map(
            (action, i) => {
              const unsupported =
                action.action ===
                  'deposit' ||
                action.action ===
                  'withdraw' ||
                action.action ===
                  'transfer';

              return (
                <motion.button
                  key={action.label}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.04,
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  onClick={() =>
                    handleAction(
                      action.action,
                    )
                  }
                  className="relative flex flex-col items-center gap-2 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-primary/30 hover:bg-accent/40"
                >

                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      action.color,
                    )}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-medium">
                    {action.label}
                  </span>

                  {unsupported && (
                    <Badge
                      variant="outline"
                      className="absolute right-1 top-1 text-[9px]"
                    >
                      Soon
                    </Badge>
                  )}

                </motion.button>
              );
            },
          )}

        </div>

      </section>

      {/* =====================================================
          CASH FLOW + NOTIFICATIONS

          These remain visual/demo modules until we build
          wallet ledger/deposit/withdraw backend APIs.
      ====================================================== */}

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">

        <CashFlowChart />

        <Card className="p-5">

          <div className="mb-4 flex items-center gap-2">

            <Bell className="h-4 w-4 text-primary" />

            <h3 className="font-display text-base font-semibold">
              Notifications
            </h3>

            <Badge
              variant="outline"
              className="ml-auto text-[10px]"
            >
              Demo
            </Badge>

          </div>

          <div className="space-y-2">

            {walletNotifications.map(
              (notif, i) => (
                <motion.div
                  key={notif.id}
                  initial={{
                    opacity: 0,
                    x: 8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                  }}
                  className={cn(
                    'rounded-lg border p-3',
                    notif.read
                      ? 'border-border/50 bg-card/20'
                      : 'border-primary/20 bg-primary/5',
                  )}
                >

                  <div className="flex items-start justify-between gap-2">

                    <p className="text-sm font-medium">
                      {notif.title}
                    </p>

                    {!notif.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}

                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {notif.message}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(
                      notif.timestamp,
                    )}
                  </p>

                </motion.div>
              ),
            )}

          </div>

        </Card>

      </div>

      {/* AI INSIGHTS - CURRENTLY FRONTEND FEATURE */}

      <AIWalletInsights />

      {/* =====================================================
          REAL TRADING TRANSACTIONS
      ====================================================== */}

      <div className="grid gap-4 lg:grid-cols-2">

        <Card className="p-5">

          <div className="mb-4 flex items-center justify-between">

            <h3 className="font-display text-base font-semibold">
              Recent Trading Transactions
            </h3>

            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() =>
                navigate('/transactions')
              }
            >
              View All
            </Button>

          </div>

          {transactions.length === 0 ? (

            <p className="py-8 text-center text-sm text-muted-foreground">
              No trading transactions yet.
            </p>

          ) : (

            <div className="space-y-2">

              {transactions.map(
                (txn, i) => {
                  const buy =
                    txn.side === 'BUY';

                  return (
                    <motion.div
                      key={
                        txn.transactionId
                      }
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.04,
                      }}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/50 p-2.5"
                    >

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium">
                          {buy
                            ? 'Bought'
                            : 'Sold'}{' '}
                          {txn.quantity}{' '}
                          {txn.symbol}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(
                            txn.executedAt,
                          )}
                        </p>

                      </div>

                      <div className="text-right">

                        <p
                          className={cn(
                            'text-sm font-semibold tabular-nums',
                            buy
                              ? 'text-danger'
                              : 'text-success',
                          )}
                        >
                          {buy ? '-' : '+'}
                          {formatCurrency(
                            txn.totalAmount,
                          )}
                        </p>

                        <Badge
                          variant="outline"
                          className={cn(
                            'border-0 text-[10px]',
                            buy
                              ? 'bg-primary/10 text-primary'
                              : 'bg-success/10 text-success',
                          )}
                        >
                          {txn.side}
                        </Badge>

                      </div>

                    </motion.div>
                  );
                },
              )}

            </div>

          )}

        </Card>

        {/* Rewards backend doesn't exist yet */}

        <div className="relative">

          <div className="absolute right-3 top-3 z-10">
            <Badge
              variant="outline"
              className="text-[10px]"
            >
              Demo
            </Badge>
          </div>

          <RewardsCard />

        </div>

      </div>

      <SecurityCard />

    </div>
  );
}