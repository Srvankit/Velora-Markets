import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search as SearchIcon, Star, TrendingUp, TrendingDown, Activity, Flame, Grid3x3, Newspaper, LayoutGrid } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { Sparkline } from '@/components/common/Sparkline';
import { SearchBar } from '@/components/markets/SearchBar';
import { IndexCard } from '@/components/markets/IndexCard';
import { StockCard, StockCardSkeleton } from '@/components/markets/StockCard';
import { CategoryCard } from '@/components/markets/CategoryCard';
import { FilterPanel, defaultFilters, type FilterState } from '@/components/markets/FilterPanel';
import { MarketHeatmap } from '@/components/markets/Heatmap';
import { NewsCard } from '@/components/markets/NewsCard';
import { FeaturedStock } from '@/components/markets/FeaturedStock';
import { type MarketStock } from '@/data/stocks';
import { marketIndices } from '@/data/marketIndices';
import { marketNews, marketCategories, popularSectors } from '@/data/news';
import { useWatchlist, useRecentSearches } from '@/hooks/use-watchlist';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { backendApi } from '@/services/backend';
import { mergeMarketStocks } from '@/services/market-data';

export default function MarketsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const { has, toggle } = useWatchlist();
  const { searches, add, clear } = useRecentSearches();

  const [stocks, setStocks] = useState<MarketStock[]>([]);
  const [gainers, setGainers] = useState<MarketStock[]>([]);
  const [losers, setLosers] = useState<MarketStock[]>([]);
  const [activeStocks, setActiveStocks] = useState<MarketStock[]>([]);
  const [marketError, setMarketError] = useState<string | null>(null);

  useEffect(() => {
  let cancelled = false;

  async function loadMarket() {
    try {
      setLoading(true);
      setMarketError(null);

      const [
        allResponse,
        gainersResponse,
        losersResponse,
        activeResponse,
      ] = await Promise.all([
        backendApi.marketStocks(),
        backendApi.marketGainers(),
        backendApi.marketLosers(),
        backendApi.marketActive(),
      ]);

      if (cancelled) return;

      setStocks(mergeMarketStocks(allResponse));
      setGainers(mergeMarketStocks(gainersResponse));
      setLosers(mergeMarketStocks(losersResponse));
      setActiveStocks(mergeMarketStocks(activeResponse));
    } catch (error) {
      console.error('Failed to load market:', error);

      if (!cancelled) {
        setMarketError('Unable to load market data.');
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadMarket();

  return () => {
    cancelled = true;
  };
}, []);

  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.symbol.toLowerCase().includes(q) &&
          !s.sector.toLowerCase().includes(q) &&
          !s.exchange.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.sectors.length > 0 && !filters.sectors.includes(s.sector)) return false;
      if (filters.capSizes.length > 0 && !filters.capSizes.includes(s.capSize)) return false;
      if (filters.exchanges.length > 0 && !filters.exchanges.includes(s.exchange)) return false;
      if (filters.performance === 'positive' && s.change < 0) return false;
      if (filters.performance === 'negative' && s.change >= 0) return false;
      return true;
    });
  }, [stocks, search, filters]);

    const trendingStocks = stocks.slice(0, 14);

  const topGainers = gainers.slice(0, 6);
  const topLosers = losers.slice(0, 6);
  const mostActive = activeStocks.slice(0, 6);

  const watchlistStocks = stocks.filter((stock) =>
    has(stock.symbol),
  );

const featuredStock = stocks[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Markets</h1>
          <p className="text-sm text-muted-foreground">
            Explore global financial markets \u00b7{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <MarketStatusBadge />
      </motion.div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} recentSearches={searches} onAddRecent={add} onClearRecent={clear} />

      {/* Market Summary */}
      <section>
        <SectionTitle icon={TrendingUp} title="Market Summary" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {marketIndices.map((idx, i) => (
            <IndexCard key={idx.symbol} index={idx} delay={i * 0.04} />
          ))}
        </div>
      </section>

      {/* Featured Stock */}
      <section>
              {marketError && (
          <Card className="border-danger/30 bg-danger/5 p-4">
            <p className="text-sm text-danger">
              {marketError}
            </p>
          </Card>
        )}
      <SectionTitle icon={Flame} title="Featured Stock" />
        {featuredStock ? (
  <FeaturedStock
    stock={featuredStock}
    isFavorite={has(featuredStock.symbol)}
    onToggleFavorite={toggle}
  />
) : loading ? (
  <Card className="h-64 animate-pulse bg-muted/30" />
) : (
  <EmptyState
    icon={<TrendingUp className="h-5 w-5" />}
    title="No featured stock available"
    description="Market data is currently unavailable."
  />
)}
      </section>

      {/* Market Categories */}
      <section>
        <SectionTitle icon={LayoutGrid} title="Market Categories" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {marketCategories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* Trending Stocks */}
      <section>
        <SectionTitle icon={Flame} title="Trending Stocks" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trendingStocks.map((stock, i) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              isFavorite={has(stock.symbol)}
              onToggleFavorite={toggle}
              delay={i * 0.04}
              compact
            />
          ))}
        </div>
      </section>

      {/* Top Gainers / Losers / Most Active */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section>
          <SectionTitle icon={TrendingUp} title="Top Gainers" />
          <MoverList stocks={topGainers} positive />
        </section>
        <section>
          <SectionTitle icon={TrendingDown} title="Top Losers" />
          <MoverList stocks={topLosers} positive={false} />
        </section>
        <section>
          <SectionTitle icon={Activity} title="Most Active" />
          <MoverList stocks={mostActive} showVolume />
        </section>
      </div>

      {/* All Stocks Grid with Filter Panel */}
      <section>
        <div className="flex items-center justify-between gap-3">
          <SectionTitle icon={Grid3x3} title="All Stocks" />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 lg:hidden"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          {/* Desktop filter panel */}
          <div className="hidden lg:block">
            <Card className="sticky top-20 p-5">
              <FilterPanel filters={filters} onChange={setFilters} />
            </Card>
          </div>

          {/* Mobile filter drawer */}
          {filterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto border-l border-border bg-card p-5"
              >
                <FilterPanel filters={filters} onChange={setFilters} onClose={() => setFilterOpen(false)} />
              </motion.div>
            </div>
          )}

          {/* Stock grid */}
          <div>
            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <StockCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredStocks.length === 0 ? (
              <EmptyState
                icon={<SearchIcon className="h-5 w-5" />}
                title="No stocks found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch('');
                      setFilters(defaultFilters);
                    }}
                  >
                    Clear all
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredStocks.map((stock, i) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    isFavorite={has(stock.symbol)}
                    onToggleFavorite={toggle}
                    delay={i * 0.03}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Watchlist Preview */}
      <section>
        <SectionTitle icon={Star} title="Your Watchlist" />
        {watchlistStocks.length === 0 ? (
          <EmptyState
            icon={<Star className="h-5 w-5" />}
            title="No stocks in your watchlist"
            description="Tap the star icon on any stock to add it to your watchlist."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {watchlistStocks.map((stock, i) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                isFavorite
                onToggleFavorite={toggle}
                delay={i * 0.04}
                compact
              />
            ))}
          </div>
        )}
      </section>

      {/* Market Heatmap */}
      <section>
        <SectionTitle icon={LayoutGrid} title="Market Heatmap" />
        <Card className="p-5">
          <MarketHeatmap />
        </Card>
      </section>

      {/* Popular Sectors */}
      <section>
        <SectionTitle icon={TrendingUp} title="Popular Sectors" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {popularSectors.map((sector, i) => {
            const positive = sector.changePercent >= 0;
            return (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="p-4 transition-all hover:shadow-card-hover hover:-translate-y-0.5">
                  <p className="text-sm font-semibold">{sector.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatNumber(sector.stockCount, true)} stocks</p>
                  <p className={cn('mt-2 text-sm font-bold', positive ? 'text-success' : 'text-danger')}>
                    {positive ? '+' : ''}{sector.changePercent.toFixed(2)}%
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Market News */}
      <section>
        <SectionTitle icon={Newspaper} title="Market News" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {marketNews.map((item, i) => (
            <NewsCard key={item.id} item={item} delay={i * 0.05} />
          ))}
        </div>
      </section>
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

function MarketStatusBadge() {
  const now = new Date();
  const day = now.getDay();
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && utcHour >= 14.5 && utcHour < 21;

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card/60 px-4 py-2.5 backdrop-blur-md">
      <span className="relative flex h-2.5 w-2.5">
        {isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />}
        <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', isOpen ? 'bg-success' : 'bg-muted-foreground')} />
      </span>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">US Market</span>
        <span className={cn('text-sm font-semibold', isOpen ? 'text-success' : 'text-muted-foreground')}>
          {isOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </div>
    </div>
  );
}

function MoverList({
  stocks,
  positive,
  showVolume,
}: {
  stocks: MarketStock[];
  positive?: boolean;
  showVolume?: boolean;
}) {
  const navigate = useNavigate();

  const handleTrade = (symbol: string) => {
    navigate(`/trade?symbol=${encodeURIComponent(symbol)}`);
  };

  return (
    <div className="space-y-2">
      {stocks.map((stock, i) => {
        const isPositive = stock.change >= 0;

        return (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.04,
            }}
          >
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleTrade(stock.symbol)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {
                  event.preventDefault();
                  handleTrade(stock.symbol);
                }
              }}
              className="group flex cursor-pointer items-center gap-3 p-3 transition-all hover:-translate-y-0.5 hover:bg-accent/40 hover:shadow-sm"
            >
              {/* Stock logo */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                style={{
                  backgroundColor: stock.logoColor,
                }}
              >
                {stock.symbol.slice(0, 2)}
              </div>

              {/* Stock name */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                  {stock.symbol}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {stock.name}
                </p>
              </div>

              {/* Volume */}
              {showVolume && (
                <span className="hidden text-xs text-muted-foreground sm:block">
                  Vol:{' '}
                  {formatNumber(
                    stock.volume,
                    true,
                  )}
                </span>
              )}

              {/* Price */}
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {formatCurrency(stock.price)}
                </p>

                <p
                  className={cn(
                    'text-xs font-medium',
                    isPositive
                      ? 'text-success'
                      : 'text-danger',
                  )}
                >
                  {isPositive ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </p>
              </div>

              {/* Sparkline */}
              <Sparkline
                data={stock.sparkline}
                width={48}
                height={24}
                positive={isPositive}
              />

              {/* Trade indicator */}
              <span className="hidden text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 xl:inline">
                Trade →
              </span>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}