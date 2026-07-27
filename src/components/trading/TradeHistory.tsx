import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { RecentTrade } from '@/types/trading';
import { cn } from '@/lib/utils';

interface TradeHistoryProps {
  trades: RecentTrade[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  return (
    <Card className="p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">Recent Trades</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-1.5 pr-2 text-left font-medium">Time</th>
              <th className="pb-1.5 pr-2 text-right font-medium">Price</th>
              <th className="pb-1.5 pr-2 text-right font-medium">Qty</th>
              <th className="pb-1.5 text-left font-medium">Side</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <motion.tr
                key={trade.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className="border-b border-border/40"
              >
                <td className="py-1.5 pr-2 tabular-nums text-muted-foreground">{trade.time}</td>
                <td className={cn('py-1.5 pr-2 text-right font-semibold tabular-nums', trade.side === 'buy' ? 'text-success' : 'text-danger')}>
                  {trade.price.toFixed(2)}
                </td>
                <td className="py-1.5 pr-2 text-right tabular-nums">{trade.quantity}</td>
                <td className="py-1.5">
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', trade.side === 'buy' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger')}>
                    {trade.side === 'buy' ? 'B' : 'S'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
