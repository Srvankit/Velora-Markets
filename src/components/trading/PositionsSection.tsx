import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTrading } from '@/contexts/trading-context';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

import type { Position } from '@/types/trading';

export function PositionsSection() {
  const { positions } = useTrading();
  const open = positions.filter((p) => p.status === 'open');
  const closed = positions.filter((p) => p.status === 'closed');

  const openPnl = open.reduce((sum, p) => sum + p.pnl, 0);
  const closedPnl = closed.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Intraday Positions</h3>
      <Tabs defaultValue="open">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="open">Open ({open.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-4">
          <PositionList positions={open} pnl={openPnl} label="Open P&L" />
        </TabsContent>
        <TabsContent value="closed" className="mt-4">
          <PositionList positions={closed} pnl={closedPnl} label="Closed P&L" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function PositionList({ positions, pnl, label }: { positions: Position[]; pnl: number; label: string }) {
  if (positions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No positions in this category.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3">
        <span className="text-sm font-medium">{label}</span>
        <span className={cn('font-bold tabular-nums', pnl >= 0 ? 'text-success' : 'text-danger')}>
          {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
        </span>
      </div>
      {positions.map((p, i) => {
        const positive = p.pnl >= 0;
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/40"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: p.logoColor }}>
              {p.symbol.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{p.symbol}</p>
              <p className="text-xs text-muted-foreground">{p.quantity} @ {formatCurrency(p.avgPrice)} \u00b7 {p.side === 'buy' ? 'Long' : 'Short'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(p.currentPrice)}</p>
              <p className={cn('text-xs font-medium tabular-nums', positive ? 'text-success' : 'text-danger')}>
                {positive ? '+' : ''}{formatCurrency(p.pnl)} ({positive ? '+' : ''}{p.pnlPercent.toFixed(2)}%)
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
