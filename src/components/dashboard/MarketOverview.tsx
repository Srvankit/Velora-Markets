import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

import { Card } from '@/components/ui/card';

import {
  backendApi,
  type BackendMarketStock,
} from '@/services/backend';

import {
  formatCurrency,
} from '@/lib/format';

import { cn } from '@/lib/utils';

export function MarketOverview() {
  const [stocks, setStocks] =
    useState<BackendMarketStock[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    async function loadMarket() {
      try {
        setError(false);

        const response =
          await backendApi.marketStocks();

        /*
         * Show the most active stocks first.
         * This gives the Dashboard a useful market snapshot
         * without pretending these are market indices.
         */
        const sorted = [...response]
          .sort(
            (a, b) =>
              b.volume - a.volume,
          )
          .slice(0, 8);

        setStocks(sorted);
      } catch (err) {
        console.error(
          'Failed to load market overview:',
          err,
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadMarket();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <Card
            key={index}
            className="h-[108px] animate-pulse bg-muted/30"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        Unable to load market overview.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">

      {stocks.map((stock, i) => {
        const price = stock.price ?? 0;
        const change = stock.change ?? 0;
        const changePercent = stock.changePercent ?? 0;
        const positive = change >= 0;

        return (
          <motion.div
            key={stock.symbol}
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.04,
              ease: 'easeOut',
            }}
          >
            <Card className="group h-full p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">

              {/* SYMBOL + EXCHANGE */}

              <div className="flex items-center justify-between gap-2">

                <p className="truncate text-xs font-bold">
                  {stock.symbol}
                </p>

                <span className="text-[9px] font-medium text-muted-foreground">
                  {stock.exchange}
                </span>

              </div>

              {/* COMPANY */}

              <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                {stock.companyName}
              </p>

              {/* PRICE */}

              <p className="mt-2 font-display text-base font-bold tracking-tight">
                {formatCurrency(
                  price,
                )}
              </p>

              {/* CHANGE */}

              <div className="mt-1.5 flex items-center justify-between gap-1">

                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-semibold',

                    positive
                      ? 'text-success'
                      : 'text-danger',
                  )}
                >
                  {positive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}

                  {positive ? '+' : ''}
                  {changePercent.toFixed(
                    2,
                  )}
                  %
                </span>

                <Activity className="h-3.5 w-3.5 text-muted-foreground/60" />

              </div>

            </Card>
          </motion.div>
        );
      })}


    </div>
  );
}