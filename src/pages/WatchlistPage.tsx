import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Star,
  Search,
  RefreshCw,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';

import { useWatchlist } from '@/hooks/use-watchlist';

import {
  backendApi,
  type BackendMarketStock,
} from '@/services/backend';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';

import { cn } from '@/lib/utils';

export default function WatchlistPage() {
  const navigate = useNavigate();

  const {
    items,
    loading: watchlistLoading,
    remove,
    refresh,
    count,
  } = useWatchlist();

  const [marketStocks, setMarketStocks] =
    useState<BackendMarketStock[]>([]);

  const [marketLoading, setMarketLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [removing, setRemoving] =
    useState<string | null>(null);

  // =========================================================
  // LOAD MARKET DATA
  // =========================================================

  useEffect(() => {
    async function loadMarketData() {
      try {
        const response =
          await backendApi.marketStocks();

        setMarketStocks(response ?? []);
      } catch (error) {
        console.error(
          'Failed to load market data:',
          error,
        );
      } finally {
        setMarketLoading(false);
      }
    }

    void loadMarketData();
  }, []);

  // =========================================================
  // MERGE WATCHLIST + MARKET DATA
  // =========================================================

  const watchlistStocks = useMemo(() => {
    return items.map((item) => {
      const market = marketStocks.find(
        (stock) =>
          stock.symbol.toUpperCase() ===
          item.symbol.toUpperCase(),
      );

      return {
        id: item.id,

        symbol: item.symbol,

        companyName:
          market?.companyName ??
          item.companyName,

        price:
          market?.price ??
          item.currentPrice,

        change:
          market?.change ?? 0,

        changePercent:
          market?.changePercent ?? 0,

        exchange:
          market?.exchange ?? null,

        currency:
          market?.currency || (market?.exchange === 'NASDAQ' || market?.exchange === 'NYSE' ? 'USD' : 'INR'),

        sector:
          market?.sector ?? null,

        volume:
          market?.volume ?? 0,

        addedAt:
          item.addedAt,
      };
    });
  }, [items, marketStocks]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return watchlistStocks;
    }

    return watchlistStocks.filter(
      (item) =>
        item.symbol
          .toLowerCase()
          .includes(query) ||
        item.companyName
          .toLowerCase()
          .includes(query),
    );
  }, [watchlistStocks, search]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const gainers = watchlistStocks.filter(
    (item) => item.changePercent > 0,
  ).length;

  const losers = watchlistStocks.filter(
    (item) => item.changePercent < 0,
  ).length;

  // =========================================================
  // REMOVE
  // =========================================================

  async function handleRemove(
    symbol: string,
  ) {
    try {
      setRemoving(symbol);

      await remove(symbol);
    } catch (error) {
      console.error(
        `Failed to remove ${symbol}:`,
        error,
      );
    } finally {
      setRemoving(null);
    }
  }

  // =========================================================
  // REFRESH EVERYTHING
  // =========================================================

  async function handleRefresh() {
    try {
      await refresh();

      const response =
        await backendApi.marketStocks();

      setMarketStocks(response ?? []);
    } catch (error) {
      console.error(
        'Failed to refresh watchlist:',
        error,
      );
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (
    watchlistLoading ||
    marketLoading
  ) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />

          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted/60" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {Array.from({
            length: 6,
          }).map((_, index) => (
            <Card
              key={index}
              className="h-[200px] animate-pulse bg-muted/20"
            />
          ))}

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="flex items-center gap-2">

            <Star className="h-5 w-5 text-primary" />

            <h1 className="font-display text-3xl font-bold tracking-tight">
              Watchlist
            </h1>

          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Track stocks you're interested
            in and monitor their market
            performance.
          </p>

        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            void handleRefresh()
          }
          className="gap-2 self-start lg:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>

      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-3">

        <Card className="p-5">

          <p className="text-xs font-medium text-muted-foreground">
            Watchlist Stocks
          </p>

          <p className="mt-2 font-display text-2xl font-bold">
            {count}
          </p>

        </Card>

        <Card className="p-5">

          <p className="text-xs font-medium text-muted-foreground">
            Gainers
          </p>

          <p className="mt-2 font-display text-2xl font-bold text-success">
            {gainers}
          </p>

        </Card>

        <Card className="p-5">

          <p className="text-xs font-medium text-muted-foreground">
            Losers
          </p>

          <p className="mt-2 font-display text-2xl font-bold text-danger">
            {losers}
          </p>

        </Card>

      </div>

      {/* SEARCH */}

      {items.length > 0 && (
        <div className="relative max-w-md">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search your watchlist..."
            className="pl-9"
          />

        </div>
      )}

      {/* EMPTY */}

      {items.length === 0 ? (

        <Card className="flex min-h-[380px] flex-col items-center justify-center border-dashed p-8 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">

            <Star className="h-7 w-7 text-primary" />

          </div>

          <h2 className="mt-5 font-display text-xl font-semibold">
            Your watchlist is empty
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Explore the market and add
            stocks to your watchlist to
            monitor their performance here.
          </p>

          <Button
            className="mt-6"
            onClick={() =>
              navigate('/markets')
            }
          >
            Explore Markets
          </Button>

        </Card>

      ) : filteredItems.length === 0 ? (

        <Card className="flex min-h-[260px] flex-col items-center justify-center border-dashed p-8 text-center">

          <Search className="h-8 w-8 text-muted-foreground" />

          <h2 className="mt-4 font-semibold">
            No stocks found
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            No watchlist stocks match
            "{search}".
          </p>

        </Card>

      ) : (

        /* WATCHLIST STOCKS */

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {filteredItems.map(
            (item) => {

              const positive =
                item.changePercent >= 0;

              return (
                <Card
                  key={item.symbol}
                  className="group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
                >

                  {/* STOCK HEADER */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <span className="font-display text-lg font-bold">
                          {item.symbol}
                        </span>

                        {item.exchange && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {
                              item.exchange
                            }
                          </span>
                        )}

                      </div>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {
                          item.companyName
                        }
                      </p>

                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={
                        removing ===
                        item.symbol
                      }
                      onClick={() =>
                        void handleRemove(
                          item.symbol,
                        )
                      }
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                      title={`Remove ${item.symbol}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </div>

                  {/* PRICE */}

                  <div className="mt-6">

                    <p className="font-display text-2xl font-bold tabular-nums">
                      {formatCurrency(
                        item.price,
                        item.currency,
                      )}
                    </p>

                    <div
                      className={cn(
                        'mt-1 flex items-center gap-1 text-sm font-semibold',

                        positive
                          ? 'text-success'
                          : 'text-danger',
                      )}
                    >

                      {positive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}

                      <span className="tabular-nums">
                        {positive
                          ? '+'
                          : ''}
                        {formatCurrency(
                          item.change,
                          item.currency,
                        )}
                      </span>

                      <span className="tabular-nums">
                        (
                        {positive
                          ? '+'
                          : ''}
                        {item.changePercent.toFixed(
                          2,
                        )}
                        %)
                      </span>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">

                    <div>
                      <p className="text-muted-foreground">
                        Sector
                      </p>

                      <p className="mt-1 truncate font-medium">
                        {item.sector ??
                          '—'}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">
                        Volume
                      </p>

                      <p className="mt-1 font-medium tabular-nums">
                        {item.volume.toLocaleString()}
                      </p>
                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-6 flex gap-2 border-t border-border/60 pt-4">

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() =>
                        navigate(
                          `/stock/${item.symbol}`,
                        )
                      }
                    >
                      View Stock

                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        navigate(
                          `/trade?symbol=${item.symbol}`,
                        )
                      }
                    >
                      Trade
                    </Button>

                  </div>

                </Card>
              );
            },
          )}

        </div>
      )}

    </div>
  );
}