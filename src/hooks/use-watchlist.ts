import { useCallback, useEffect, useState } from 'react';
import {
  backendApi,
  type BackendWatchlistItem,
} from '@/services/backend';

const RECENT_KEY = 'velora-recent-searches';

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function useWatchlist() {
  const [items, setItems] = useState<BackendWatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const response = await backendApi.watchlist();
      setItems(response);
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const has = useCallback(
    (symbol: string) =>
      items.some(
        (item) =>
          item.symbol.toUpperCase() === symbol.toUpperCase(),
      ),
    [items],
  );

  const add = useCallback(
    async (symbol: string) => {
      const normalized = symbol.trim().toUpperCase();

      if (has(normalized)) return;

      try {
        const item =
          await backendApi.addToWatchlist(normalized);

        setItems((current) => [...current, item]);
      } catch (error) {
        console.error(
          `Failed to add ${normalized} to watchlist:`,
          error,
        );
        throw error;
      }
    },
    [has],
  );

  const remove = useCallback(async (symbol: string) => {
    const normalized = symbol.trim().toUpperCase();

    try {
      await backendApi.removeFromWatchlist(normalized);

      setItems((current) =>
        current.filter(
          (item) =>
            item.symbol.toUpperCase() !== normalized,
        ),
      );
    } catch (error) {
      console.error(
        `Failed to remove ${normalized} from watchlist:`,
        error,
      );
      throw error;
    }
  }, []);

  const toggle = useCallback(
    async (symbol: string) => {
      const normalized = symbol.trim().toUpperCase();

      if (has(normalized)) {
        await remove(normalized);
      } else {
        await add(normalized);
      }
    },
    [has, add, remove],
  );

  const symbols = items.map((item) => item.symbol);

  return {
    items,
    symbols,
    loading,
    toggle,
    add,
    remove,
    has,
    count: items.length,
    refresh: load,
  };
}

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>(() =>
    readStorage<string[]>(RECENT_KEY, []),
  );

  useEffect(() => {
    writeStorage(RECENT_KEY, searches);
  }, [searches]);

  const add = useCallback((term: string) => {
    const trimmed = term.trim();

    if (!trimmed) return;

    setSearches((prev) =>
      [
        trimmed,
        ...prev.filter((s) => s !== trimmed),
      ].slice(0, 6),
    );
  }, []);

  const clear = useCallback(() => {
    setSearches([]);
  }, []);

  return {
    searches,
    add,
    clear,
  };
}