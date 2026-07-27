import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  recentSearches: string[];
  onAddRecent: (term: string) => void;
  onClearRecent: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  recentSearches,
  onAddRecent,
  onClearRecent,
  placeholder = 'Search by company, ticker, sector, or exchange\u2026',
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) onAddRecent(value.trim());
          }}
          placeholder={placeholder}
          className="h-11 rounded-xl border-border bg-card pl-10 pr-10 text-sm"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {focused && recentSearches.length > 0 && !value && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-card p-3 shadow-card"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Recent searches
              </span>
              <button
                onClick={onClearRecent}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onMouseDown={() => {
                    onChange(term);
                    onAddRecent(term);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <TrendingUp className="h-3 w-3" />
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Button, cn };
