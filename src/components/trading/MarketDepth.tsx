import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { MarketDepth as MarketDepthType } from '@/types/trading';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

interface MarketDepthProps {
  depth: MarketDepthType;
}

export function MarketDepth({ depth }: MarketDepthProps) {
  const maxQty = Math.max(...depth.bids.map((b) => b.quantity), ...depth.asks.map((a) => a.quantity), 1);

  return (
    <Card className="p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">Market Depth (Level 2)</p>
      <div className="grid grid-cols-2 gap-3">
        {/* Bids */}
        <div>
          <div className="mb-1.5 grid grid-cols-3 gap-1 text-[10px] font-medium text-muted-foreground">
            <span>Bid Qty</span>
            <span className="text-center">Orders</span>
            <span className="text-right">Bid Price</span>
          </div>
          <div className="space-y-1">
            {depth.bids.map((bid, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="relative grid grid-cols-3 gap-1 rounded-md px-1.5 py-1 text-xs"
              >
                <div
                  className="absolute inset-y-0 right-0 rounded-md bg-success/10"
                  style={{ width: `${(bid.quantity / maxQty) * 100}%` }}
                />
                <span className="relative z-10 font-medium tabular-nums text-success">{formatNumber(bid.quantity)}</span>
                <span className="relative z-10 text-center text-muted-foreground">{bid.orders}</span>
                <span className="relative z-10 text-right font-semibold tabular-nums">{bid.price.toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Asks */}
        <div>
          <div className="mb-1.5 grid grid-cols-3 gap-1 text-[10px] font-medium text-muted-foreground">
            <span>Ask Price</span>
            <span className="text-center">Orders</span>
            <span className="text-right">Ask Qty</span>
          </div>
          <div className="space-y-1">
            {depth.asks.map((ask, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="relative grid grid-cols-3 gap-1 rounded-md px-1.5 py-1 text-xs"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-md bg-danger/10"
                  style={{ width: `${(ask.quantity / maxQty) * 100}%` }}
                />
                <span className="relative z-10 font-semibold tabular-nums text-danger">{ask.price.toFixed(2)}</span>
                <span className="relative z-10 text-center text-muted-foreground">{ask.orders}</span>
                <span className="relative z-10 text-right font-medium tabular-nums">{formatNumber(ask.quantity)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-success" /> Bids
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-danger" /> Asks
        </span>
      </div>
    </Card>
  );
}
