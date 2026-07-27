import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  backendApi,
  type BackendWatchlistItem,
} from '@/services/backend';
import { formatCurrency } from '@/lib/format';

export function WatchlistPreview() {
  const [items, setItems] = useState<BackendWatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    try {
      const response = await backendApi.watchlist();
      setItems(response);
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(symbol: string) {
    try {
      setRemoving(symbol);

      await backendApi.removeFromWatchlist(symbol);

      setItems((current) =>
        current.filter((item) => item.symbol !== symbol),
      );
    } catch (error) {
      console.error('Failed to remove watchlist item:', error);
    } finally {
      setRemoving(null);
    }
  }

  if (loading) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        Loading watchlist...
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Star className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />

        <p className="text-sm font-medium">
          Your watchlist is empty
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Add stocks from Markets to track them here.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: 'easeOut',
          }}
        >
          <Card className="group p-4 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  {item.symbol.slice(0, 2)}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {item.symbol}
                  </p>

                  <p className="max-w-[150px] truncate text-xs text-muted-foreground">
                    {item.companyName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={removing === item.symbol}
                onClick={() => handleRemove(item.symbol)}
                aria-label={`Remove ${item.symbol} from watchlist`}
                className="text-warning transition-colors hover:text-danger disabled:opacity-50"
              >
                {removing === item.symbol ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-4">
              <p className="font-display text-lg font-bold tracking-tight">
                {formatCurrency(item.currentPrice)}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs text-warning">
                <Star className="h-3 w-3 fill-current" />
                Watching
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}