import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { useTrading } from '@/contexts/trading-context';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

export function HoldingTable() {
  const { holdings, totalHoldingsValue, todayProfit, overallReturn } = useTrading();
  const navigate = useNavigate();

  const enriched = useMemo(() => {
    return holdings.map((h) => {
      const investment = h.shares * h.avgPrice;
      const currentValue = h.shares * h.currentPrice;
      const pnl = currentValue - investment;
      const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;
      const dayChange = (h.currentPrice - h.currentPrice / 1.001) * h.shares;
      const allocation = totalHoldingsValue > 0 ? (currentValue / totalHoldingsValue) * 100 : 0;
      return { ...h, investment, currentValue, pnl, pnlPercent, dayChange, allocation };
    });
  }, [holdings, totalHoldingsValue]);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Holdings Value" value={totalHoldingsValue} prefix="$" />
        <SummaryCard label="Today's Profit" value={todayProfit} prefix="$" positive={todayProfit >= 0} />
        <SummaryCard label="Overall Return" value={overallReturn} prefix="$" positive={overallReturn >= 0} />
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Company</TableHead>
                <TableHead className="text-right text-xs">Shares</TableHead>
                <TableHead className="text-right text-xs">Avg. Price</TableHead>
                <TableHead className="text-right text-xs">Current</TableHead>
                <TableHead className="text-right text-xs">Investment</TableHead>
                <TableHead className="text-right text-xs">Current Value</TableHead>
                <TableHead className="text-right text-xs">P&L</TableHead>
                <TableHead className="text-right text-xs">Allocation</TableHead>
                <TableHead className="text-right text-xs">Day Chg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                    No holdings yet. Place a buy order to start building your portfolio.
                  </TableCell>
                </TableRow>
              ) : (
                enriched.map((h, i) => {
                  const positive = h.pnl >= 0;
                  const dayPositive = h.dayChange >= 0;
                  return (
                    <motion.tr
                      key={h.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                      className="cursor-pointer border-b border-border/50 transition-colors hover:bg-accent/40"
                      onClick={() => navigate(`/stocks/${h.symbol}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: h.logoColor }}>
                            {h.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <span className="text-sm font-semibold">{h.symbol}</span>
                            <p className="text-xs text-muted-foreground">{h.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{h.shares}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{formatCurrency(h.avgPrice)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(h.currentPrice)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{formatCurrency(h.investment)}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{formatCurrency(h.currentValue)}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn('text-xs font-medium tabular-nums', positive ? 'text-success' : 'text-danger')}>
                          {positive ? '+' : ''}{formatCurrency(h.pnl)}
                          <span className="block opacity-70">({positive ? '+' : ''}{h.pnlPercent.toFixed(2)}%)</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-muted sm:block">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${h.allocation}%` }} />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground">{h.allocation.toFixed(1)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn('text-xs font-medium tabular-nums', dayPositive ? 'text-success' : 'text-danger')}>
                          {dayPositive ? '+' : ''}{formatCurrency(h.dayChange)}
                        </span>
                      </TableCell>
                    </motion.tr>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, prefix, positive }: { label: string; value: number; prefix?: string; positive?: boolean }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('mt-1 font-display text-xl font-bold tabular-nums', positive === false && 'text-danger', positive === true && 'text-success')}>
        <AnimatedCounter value={value} prefix={prefix} decimals={2} />
      </p>
    </Card>
  );
}
