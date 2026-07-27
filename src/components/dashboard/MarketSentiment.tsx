import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

import { ChartContainer } from '@/components/common/ChartContainer';
import {
  backendApi,
  type BackendMarketStock,
} from '@/services/backend';
import { cn } from '@/lib/utils';

export function MarketSentiment() {
  const [stocks, setStocks] = useState<BackendMarketStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // =========================================================
  // LOAD REAL BACKEND MARKET DATA
  // =========================================================

  useEffect(() => {
    async function loadMarketSentiment() {
      try {
        setError(false);

        const response = await backendApi.marketStocks();

        setStocks(response ?? []);
      } catch (err) {
        console.error(
          'Failed to load market sentiment:',
          err,
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadMarketSentiment();
  }, []);

  // =========================================================
  // CALCULATE SENTIMENT FROM BACKEND STOCK PERFORMANCE
  // =========================================================

  const sentiment = useMemo(() => {
    if (stocks.length === 0) {
      return {
        bullish: 0,
        neutral: 0,
        bearish: 0,
      };
    }

    let bullishCount = 0;
    let neutralCount = 0;
    let bearishCount = 0;

    stocks.forEach((stock) => {
      /*
       * Small moves between -0.25% and +0.25%
       * are treated as neutral.
       */
      if (stock.changePercent > 0.25) {
        bullishCount++;
      } else if (stock.changePercent < -0.25) {
        bearishCount++;
      } else {
        neutralCount++;
      }
    });

    const total = stocks.length;

    const bullish = Math.round(
      (bullishCount / total) * 100,
    );

    const bearish = Math.round(
      (bearishCount / total) * 100,
    );

    /*
     * Calculate neutral from the remainder so the
     * displayed percentages always total exactly 100%.
     */
    const neutral = Math.max(
      0,
      100 - bullish - bearish,
    );

    return {
      bullish,
      neutral,
      bearish,
    };
  }, [stocks]);

  const {
    bullish,
    neutral,
    bearish,
  } = sentiment;

  // =========================================================
  // DOMINANT SENTIMENT
  // =========================================================

  const dominant =
    bullish >= neutral && bullish >= bearish
      ? 'Bullish'
      : bearish >= neutral
        ? 'Bearish'
        : 'Neutral';

  const dominantValue =
    dominant === 'Bullish'
      ? bullish
      : dominant === 'Bearish'
        ? bearish
        : neutral;

  const dominantColor =
    dominant === 'Bullish'
      ? 'hsl(var(--success))'
      : dominant === 'Bearish'
        ? 'hsl(var(--danger))'
        : 'hsl(var(--warning))';

  const data = [
    {
      name: dominant,
      value: dominantValue,
      fill: dominantColor,
    },
  ];

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <ChartContainer title="Market Sentiment">
        <div className="flex h-40 items-center justify-center">
          <div className="h-28 w-28 animate-pulse rounded-full bg-muted/40" />
        </div>
      </ChartContainer>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <ChartContainer title="Market Sentiment">
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Unable to load market sentiment.
          </p>
        </div>
      </ChartContainer>
    );
  }

  // =========================================================
  // EMPTY MARKET
  // =========================================================

  if (stocks.length === 0) {
    return (
      <ChartContainer title="Market Sentiment">
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No market data available.
          </p>
        </div>
      </ChartContainer>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <ChartContainer
      title="Market Sentiment"
      action={
        <span className="text-[10px] text-muted-foreground">
          Based on {stocks.length} tracked stocks
        </span>
      }
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">

        {/* RADIAL INDICATOR */}

        <div className="relative h-36 w-36 shrink-0">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <RadialBarChart
              innerRadius="68%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={
                90 -
                (dominantValue / 100) * 360
              }
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />

              <RadialBar
                background={{
                  fill: 'hsl(var(--muted))',
                }}
                dataKey="value"
                cornerRadius={20}
                angleAxisId={0}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span
              className="font-display text-2xl font-bold"
              style={{
                color: dominantColor,
              }}
            >
              {dominantValue}%
            </span>

            <span className="text-xs text-muted-foreground">
              {dominant}
            </span>

          </div>

        </div>

        {/* SENTIMENT DISTRIBUTION */}

        <div className="w-full space-y-2.5">

          <SentimentBar
            label="Bullish"
            value={bullish}
            color="bg-success"
          />

          <SentimentBar
            label="Neutral"
            value={neutral}
            color="bg-warning"
          />

          <SentimentBar
            label="Bearish"
            value={bearish}
            color="bg-danger"
          />

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.3,
            }}
            className="pt-1 text-center text-xs text-muted-foreground sm:text-left"
          >
            Overall market sentiment is{' '}

            <span
              className="font-semibold"
              style={{
                color: dominantColor,
              }}
            >
              {dominant}
            </span>
          </motion.p>

        </div>

      </div>
    </ChartContainer>
  );
}

function SentimentBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-1">

      <div className="flex items-center justify-between text-xs">

        <span className="text-muted-foreground">
          {label}
        </span>

        <span className="font-medium tabular-nums">
          {value}%
        </span>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">

        <motion.div
          className={cn(
            'h-full rounded-full',
            color,
          )}
          initial={{
            width: 0,
          }}
          animate={{
            width: `${value}%`,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
        />

      </div>

    </div>
  );
}