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
import { Badge } from '@/components/ui/badge';
import {
  backendApi,
  type BackendTransaction,
} from '@/services/backend';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backendApi
      .transactions(0, 5)
      .then((response) => {
        setTransactions(response.content);
      })
      .catch((error) => {
        console.error('Failed to load recent transactions:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <h3 className="font-display text-base font-semibold">
            Recent Transactions
          </h3>
          <p className="text-xs text-muted-foreground">
            Your latest trading activity
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No transactions yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Stock</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-right text-xs">
                  Quantity
                </TableHead>
                <TableHead className="text-right text-xs">
                  Price
                </TableHead>
                <TableHead className="text-right text-xs">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions.map((tx, i) => {
                const isBuy = tx.side === 'BUY';

                return (
                  <motion.tr
                    key={tx.transactionId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.05,
                    }}
                    className="border-b border-border/50 transition-colors hover:bg-accent/40"
                  >
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(tx.executedAt, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>

                    <TableCell className="font-medium">
                      {tx.symbol}
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
                          isBuy
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger',
                        )}
                      >
                        {isBuy ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}

                        {isBuy ? 'Buy' : 'Sell'}
                      </span>
                    </TableCell>

                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {tx.quantity}
                    </TableCell>

                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCurrency(tx.price)}
                    </TableCell>

                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCurrency(tx.totalAmount)}
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