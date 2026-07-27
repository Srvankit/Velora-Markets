import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { backendApi, type BackendPortfolio } from '@/services/backend';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export function HoldingsTable() {
  const [portfolio, setPortfolio] = useState<BackendPortfolio | null>(null);

  useEffect(() => {
    backendApi
      .portfolio()
      .then(setPortfolio)
      .catch((error) => {
        console.error('Failed to load holdings:', error);
      });
  }, []);

  if (!portfolio) {
    return (
      <Card className="p-5 text-sm text-muted-foreground">
        Loading portfolio holdings...
      </Card>
    );
  }

  const holdings = portfolio.holdings;
  const totalValue = portfolio.marketValue;

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <h3 className="font-display text-base font-semibold">
            Portfolio Holdings
          </h3>
          <p className="text-xs text-muted-foreground">
            {portfolio.totalHoldings} positions
          </p>
        </div>

        <span className="text-sm font-medium text-muted-foreground">
          Total:{' '}
          <span className="font-semibold text-foreground">
            {formatCurrency(totalValue)}
          </span>
        </span>
      </div>

      {holdings.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          You don't currently own any stocks.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Company</TableHead>
                <TableHead className="text-xs">Ticker</TableHead>
                <TableHead className="text-right text-xs">Shares</TableHead>
                <TableHead className="text-right text-xs">Avg. Price</TableHead>
                <TableHead className="text-right text-xs">Current</TableHead>
                <TableHead className="text-right text-xs">Market Value</TableHead>
                <TableHead className="text-right text-xs">P&L</TableHead>
                <TableHead className="text-right text-xs">Allocation</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {holdings.map((holding, i) => {
                const positive = holding.unrealizedPnL >= 0;

                const allocation =
                  totalValue > 0
                    ? (holding.marketValue / totalValue) * 100
                    : 0;

                return (
                  <motion.tr
                    key={holding.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group border-b border-border/50 transition-colors hover:bg-accent/40"
                  >
                    <TableCell className="font-medium">
                      {holding.companyName}
                    </TableCell>

                    <TableCell className="text-xs font-semibold text-muted-foreground">
                      {holding.symbol}
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      {holding.quantity}
                    </TableCell>

                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatCurrency(holding.averageBuyPrice)}
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(holding.currentPrice)}
                    </TableCell>

                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCurrency(holding.marketValue)}
                    </TableCell>

                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
                          positive
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger',
                        )}
                      >
                        {positive ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}

                        {formatCurrency(Math.abs(holding.unrealizedPnL))}

                        <span className="opacity-70">
                          ({positive ? '+' : ''}
                          {holding.returnPercentage.toFixed(2)}%)
                        </span>
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${Math.min(allocation, 100)}%`,
                            }}
                          />
                        </div>

                        <span className="text-xs tabular-nums text-muted-foreground">
                          {allocation.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}