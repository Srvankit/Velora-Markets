import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { motion } from 'framer-motion';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import {
  Wallet,
  Briefcase,
  TrendingUp,
} from 'lucide-react';

import {
  ChartContainer,
} from '@/components/common/ChartContainer';

import { Card } from '@/components/ui/card';

import {
  backendApi,
  type BackendPortfolio,
} from '@/services/backend';

import {
  formatCurrency,
} from '@/lib/format';

const tooltipStyle = {
  backgroundColor:
    'hsl(var(--card))',

  border:
    '1px solid hsl(var(--border))',

  borderRadius: '0.5rem',

  fontSize: '0.75rem',
};

export function PortfolioCharts() {
  const [portfolio, setPortfolio] =
    useState<BackendPortfolio | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setError(false);

        const response =
          await backendApi.portfolio();

        setPortfolio(response);
      } catch (err) {
        console.error(
          'Failed to load portfolio charts:',
          err,
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadPortfolio();
  }, []);

  // =========================================================
  // REAL HOLDING ALLOCATION
  // =========================================================

  const allocationData =
    useMemo(() => {
      if (!portfolio) {
        return [];
      }

      const total =
        portfolio.marketValue;

      if (total <= 0) {
        return [];
      }

      return portfolio.holdings.map(
        (holding) => ({
          name: holding.symbol,

          value: Number(
            (
              (holding.marketValue /
                total) *
              100
            ).toFixed(2),
          ),

          marketValue:
            holding.marketValue,
        }),
      );
    }, [portfolio]);

  // =========================================================
  // REAL ACCOUNT COMPOSITION
  // =========================================================

  const compositionData =
    useMemo(() => {
      if (!portfolio) {
        return [];
      }

      return [
        {
          name: 'Investments',
          value:
            portfolio.marketValue,
        },
        {
          name: 'Available Cash',
          value:
            portfolio.cashBalance,
        },
      ];
    }, [portfolio]);

  // =========================================================
  // REAL P&L
  // =========================================================

  const pnlData = useMemo(() => {
    if (!portfolio) {
      return [];
    }

    return [
      {
        name: 'Realized',
        value:
          portfolio.realizedPnL,
      },
      {
        name: 'Unrealized',
        value:
          portfolio.unrealizedPnL,
      },
      {
        name: 'Total',
        value:
          portfolio.totalPnL,
      },
    ];
  }, [portfolio]);

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">

        <Card className="h-[330px] animate-pulse bg-muted/30 lg:col-span-2" />

        <Card className="h-[330px] animate-pulse bg-muted/30" />

        <Card className="h-[270px] animate-pulse bg-muted/30 lg:col-span-3" />

      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        Unable to load portfolio analytics.
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">

      {/* ============================================= */}
      {/* ACCOUNT COMPOSITION */}
      {/* ============================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
        className="lg:col-span-2"
      >
        <ChartContainer
          title="Account Composition"
          action={
            <span className="text-xs text-muted-foreground">
              Current account
            </span>
          }
        >

          <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-center">

            <ResponsiveContainer
              width="100%"
              height={240}
            >
              <PieChart>

                <Pie
                  data={
                    compositionData
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  animationDuration={
                    1000
                  }
                >
                  {compositionData.map(
                    (entry, index) => (
                      <Cell
                        key={
                          entry.name
                        }
                        fill={
                          index === 0
                            ? 'hsl(var(--primary))'
                            : 'hsl(var(--muted-foreground))'
                        }
                        stroke="hsl(var(--card))"
                        strokeWidth={
                          2
                        }
                      />
                    ),
                  )}
                </Pie>

                <Tooltip
                  contentStyle={
                    tooltipStyle
                  }
                  formatter={(
                    value: number,
                  ) => [
                    formatCurrency(
                      value,
                    ),
                    'Value',
                  ]}
                />

              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">

              <Metric
                icon={Briefcase}
                label="Investments"
                value={
                  portfolio.marketValue
                }
              />

              <Metric
                icon={Wallet}
                label="Available Cash"
                value={
                  portfolio.cashBalance
                }
              />

              <div className="border-t border-border pt-3">

                <p className="text-xs text-muted-foreground">
                  Total Account Value
                </p>

                <p className="mt-1 font-display text-xl font-bold tabular-nums">
                  {formatCurrency(
                    portfolio.totalAccountValue,
                  )}
                </p>

              </div>

            </div>

          </div>

        </ChartContainer>
      </motion.div>

      {/* ============================================= */}
      {/* HOLDING ALLOCATION */}
      {/* ============================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: 'easeOut',
        }}
      >
        <ChartContainer title="Holding Allocation">

          {allocationData.length ===
          0 ? (

            <div className="flex h-[240px] items-center justify-center">

              <p className="text-sm text-muted-foreground">
                No holdings yet.
              </p>

            </div>

          ) : (

            <div className="flex flex-col items-center gap-4">

              <ResponsiveContainer
                width="100%"
                height={180}
              >
                <PieChart>

                  <Pie
                    data={
                      allocationData
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    animationDuration={
                      1000
                    }
                  >
                    {allocationData.map(
                      (entry, index) => (
                        <Cell
                          key={
                            entry.name
                          }
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                          stroke="hsl(var(--card))"
                          strokeWidth={
                            2
                          }
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={
                      tooltipStyle
                    }
                    formatter={(
                      value: number,
                    ) => [
                      `${Number(
                        value,
                      ).toFixed(
                        2,
                      )}%`,
                      'Allocation',
                    ]}
                  />

                </PieChart>
              </ResponsiveContainer>

              <div className="grid w-full grid-cols-2 gap-x-3 gap-y-2">

                {allocationData.map(
                  (
                    holding,
                    index,
                  ) => (

                    <div
                      key={
                        holding.name
                      }
                      className="flex items-center gap-1.5"
                    >

                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                        }}
                      />

                      <span className="truncate text-xs text-muted-foreground">
                        {
                          holding.name
                        }
                      </span>

                      <span className="ml-auto text-xs font-medium tabular-nums">
                        {
                          holding.value
                        }
                        %
                      </span>

                    </div>
                  ),
                )}

              </div>

            </div>

          )}

        </ChartContainer>
      </motion.div>

      {/* ============================================= */}
      {/* REAL P&L BREAKDOWN */}
      {/* ============================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          ease: 'easeOut',
        }}
        className="lg:col-span-3"
      >
        <ChartContainer
          title="P&L Breakdown"
          action={
            <span className="text-xs text-muted-foreground">
              Current portfolio
            </span>
          }
        >

          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <BarChart
              data={pnlData}
              margin={{
                top: 8,
                right: 8,
                bottom: 0,
                left: -8,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 11,
                  fill: 'hsl(var(--muted-foreground))',
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: 'hsl(var(--muted-foreground))',
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(
                  value,
                ) =>
                  `$${Number(
                    value,
                  ).toFixed(0)}`
                }
              />

              <Tooltip
                contentStyle={
                  tooltipStyle
                }
                formatter={(
                  value: number,
                ) => [
                  formatCurrency(
                    value,
                  ),
                  'P&L',
                ]}
                cursor={{
                  fill: 'hsl(var(--accent))',
                  opacity: 0.4,
                }}
              />

              <Bar
                dataKey="value"
                radius={[
                  5,
                  5,
                  0,
                  0,
                ]}
                animationDuration={
                  1000
                }
              >
                {pnlData.map(
                  (
                    entry,
                    index,
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        entry.value >=
                        0
                          ? 'hsl(var(--success))'
                          : 'hsl(var(--danger))'
                      }
                    />
                  ),
                )}
              </Bar>

            </BarChart>
          </ResponsiveContainer>

        </ChartContainer>
      </motion.div>

    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wallet;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">

        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="font-display text-sm font-semibold tabular-nums">
          {formatCurrency(value)}
        </p>

      </div>

    </div>
  );
}