import { motion } from 'framer-motion';
import { RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FilterState {
  sectors: string[];
  capSizes: string[];
  exchanges: string[];
  performance: 'all' | 'positive' | 'negative';
}

export const defaultFilters: FilterState = {
  sectors: [],
  capSizes: [],
  exchanges: [],
  performance: 'all',
};

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
  onClose?: () => void;
}

const sectorOptions = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Automobile', 'Retail'];
const capOptions = ['Large Cap', 'Mid Cap', 'Small Cap'];
const exchangeOptions = ['NSE', 'BSE', 'NASDAQ', 'NYSE'];

export function FilterPanel({ filters, onChange, className, onClose }: FilterPanelProps) {
  const toggle = (key: 'sectors' | 'capSizes' | 'exchanges', value: string) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const hasActiveFilters =
    filters.sectors.length > 0 ||
    filters.capSizes.length > 0 ||
    filters.exchanges.length > 0 ||
    filters.performance !== 'all';

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold">Filters</h3>
        </div>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(defaultFilters)}
              className="h-7 gap-1 text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <FilterGroup label="Sector">
        {sectorOptions.map((s) => (
          <FilterChip
            key={s}
            label={s}
            active={filters.sectors.includes(s)}
            onClick={() => toggle('sectors', s)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Market Cap">
        {capOptions.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={filters.capSizes.includes(c)}
            onClick={() => toggle('capSizes', c)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Exchange">
        {exchangeOptions.map((e) => (
          <FilterChip
            key={e}
            label={e}
            active={filters.exchanges.includes(e)}
            onClick={() => toggle('exchanges', e)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Performance">
        {(['all', 'positive', 'negative'] as const).map((p) => (
          <FilterChip
            key={p}
            label={p === 'all' ? 'All' : p === 'positive' ? 'Positive' : 'Negative'}
            active={filters.performance === p}
            onClick={() => onChange({ ...filters, performance: p })}
          />
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      {label}
    </motion.button>
  );
}
