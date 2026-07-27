import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  Eye,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

import {
  backendApi,
  type BackendTransaction,
} from '@/services/backend';

type TransactionFilter =
  | 'all'
  | 'buy'
  | 'sell';

const transactionFilters: {
  value: TransactionFilter;
  label: string;
}[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'buy',
    label: 'Buy',
  },
  {
    value: 'sell',
    label: 'Sell',
  },
];

const PAGE_SIZE = 8;

export function TransactionTable() {
  const [transactions, setTransactions] =
    useState<BackendTransaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [filter, setFilter] =
    useState<TransactionFilter>('all');

  const [search, setSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [selected, setSelected] =
    useState<BackendTransaction | null>(null);

  // =========================================================
  // LOAD REAL BACKEND TRANSACTIONS
  // =========================================================

  async function loadTransactions(
    manualRefresh = false,
  ) {
    try {
      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      /*
       * Fetch up to 100 transactions.
       * We keep frontend filtering/pagination for now,
       * matching the Orders table approach.
       */
      const response =
        await backendApi.transactions(
          0,
          100,
        );

      setTransactions(
        response.content ?? [],
      );
    } catch (err) {
      console.error(
        'Failed to load transactions:',
        err,
      );

      setError(
        'Unable to load transaction history.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadTransactions();
  }, []);

  // =========================================================
  // FILTER + SEARCH
  // =========================================================

  const filtered = useMemo(() => {
    return transactions.filter(
      (transaction) => {
        const side =
          transaction.side.toUpperCase();

        if (
          filter === 'buy' &&
          side !== 'BUY'
        ) {
          return false;
        }

        if (
          filter === 'sell' &&
          side !== 'SELL'
        ) {
          return false;
        }

        if (search.trim()) {
          const q =
            search
              .trim()
              .toLowerCase();

          const matches =
            transaction.symbol
              .toLowerCase()
              .includes(q) ||
            String(
              transaction.transactionId,
            ).includes(q) ||
            String(
              transaction.orderId,
            ).includes(q);

          if (!matches) {
            return false;
          }
        }

        return true;
      },
    );
  }, [
    transactions,
    filter,
    search,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length /
        PAGE_SIZE,
    ),
  );

  const currentPage = Math.min(
    page,
    totalPages,
  );

  const paginated =
    filtered.slice(
      (currentPage - 1) *
        PAGE_SIZE,

      currentPage *
        PAGE_SIZE,
    );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-4">

      {/* FILTERS + SEARCH */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex flex-wrap gap-1.5">

          {transactionFilters.map(
            (item) => (
              <button
                key={item.value}
                onClick={() => {
                  setFilter(
                    item.value,
                  );

                  setPage(1);
                }}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',

                  filter === item.value
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:bg-accent',
                )}
              >
                {item.label}
              </button>
            ),
          )}

        </div>

        <div className="flex gap-2">

          <div className="relative sm:w-64">

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => {
                setSearch(
                  e.target.value,
                );

                setPage(1);
              }}
              placeholder="Search symbol, txn or order..."
              className="h-9 pl-9"
            />

            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}

          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={refreshing}
            onClick={() =>
              void loadTransactions(
                true,
              )
            }
          >
            <RefreshCw
              className={cn(
                'h-4 w-4',
                refreshing &&
                  'animate-spin',
              )}
            />
          </Button>

        </div>

      </div>

      {/* BACKEND ERROR */}

      {error && (
        <Card className="border-danger/30 bg-danger/5 p-4">
          <p className="text-sm text-danger">
            {error}
          </p>
        </Card>
      )}

      {/* TRANSACTION TABLE */}

      <Card className="overflow-hidden p-0">

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow className="hover:bg-transparent">

                <TableHead className="text-xs">
                  Txn ID
                </TableHead>

                <TableHead className="text-xs">
                  Order ID
                </TableHead>

                <TableHead className="text-xs">
                  Stock
                </TableHead>

                <TableHead className="text-xs">
                  Side
                </TableHead>

                <TableHead className="text-right text-xs">
                  Quantity
                </TableHead>

                <TableHead className="text-right text-xs">
                  Price
                </TableHead>

                <TableHead className="text-right text-xs">
                  Total Amount
                </TableHead>

                <TableHead className="text-right text-xs">
                  Realized P&L
                </TableHead>

                <TableHead className="text-xs">
                  Executed
                </TableHead>

                <TableHead className="text-right text-xs">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {loading ? (

                <TableRow>

                  <TableCell
                    colSpan={10}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    Loading transactions...
                  </TableCell>

                </TableRow>

              ) : paginated.length ===
                0 ? (

                <TableRow>

                  <TableCell
                    colSpan={10}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No transactions found matching your filters.
                  </TableCell>

                </TableRow>

              ) : (

                paginated.map(
                  (
                    transaction,
                    index,
                  ) => {
                    const buy =
                      transaction.side.toUpperCase() ===
                      'BUY';

                    const realizedPnL =
                      transaction.realizedPnL;

                    return (
                      <motion.tr
                        key={
                          transaction.transactionId
                        }
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.2,
                          delay:
                            index *
                            0.03,
                        }}
                        className="border-b border-border/50 transition-colors hover:bg-accent/40"
                      >

                        {/* TRANSACTION ID */}

                        <TableCell className="font-mono text-xs">
                          #
                          {
                            transaction.transactionId
                          }
                        </TableCell>

                        {/* ORDER ID */}

                        <TableCell className="font-mono text-xs text-muted-foreground">
                          #
                          {
                            transaction.orderId
                          }
                        </TableCell>

                        {/* SYMBOL */}

                        <TableCell>

                          <div className="flex flex-col">

                            <span className="text-sm font-semibold">
                              {
                                transaction.symbol
                              }
                            </span>

                            <span className="text-[10px] text-muted-foreground">
                              Trade
                            </span>

                          </div>

                        </TableCell>

                        {/* SIDE */}

                        <TableCell>

                          <Badge
                            variant="outline"
                            className={cn(
                              'border-0 text-xs',

                              buy
                                ? 'bg-success/10 text-success'
                                : 'bg-danger/10 text-danger',
                            )}
                          >
                            {buy ? (
                              <TrendingUp className="mr-1 h-3 w-3" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3" />
                            )}

                            {
                              transaction.side
                            }
                          </Badge>

                        </TableCell>

                        {/* QUANTITY */}

                        <TableCell className="text-right tabular-nums">
                          {
                            transaction.quantity
                          }
                        </TableCell>

                        {/* PRICE */}

                        <TableCell className="text-right font-medium tabular-nums">
                          {formatCurrency(
                            transaction.price,
                          )}
                        </TableCell>

                        {/* TOTAL */}

                        <TableCell
                          className={cn(
                            'text-right font-semibold tabular-nums',

                            buy
                              ? 'text-danger'
                              : 'text-success',
                          )}
                        >
                          {buy
                            ? '-'
                            : '+'}

                          {formatCurrency(
                            transaction.totalAmount,
                          )}
                        </TableCell>

                        {/* REALIZED PNL */}

                        <TableCell
                          className={cn(
                            'text-right font-medium tabular-nums',

                            realizedPnL ==
                              null
                              ? 'text-muted-foreground'
                              : realizedPnL >=
                                  0
                                ? 'text-success'
                                : 'text-danger',
                          )}
                        >
                          {realizedPnL ==
                          null
                            ? '—'
                            : `${
                                realizedPnL >=
                                0
                                  ? '+'
                                  : ''
                              }${formatCurrency(
                                realizedPnL,
                              )}`}
                        </TableCell>

                        {/* DATE */}

                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatBackendDate(
                            transaction.executedAt,
                          )}
                        </TableCell>

                        {/* DETAILS */}

                        <TableCell className="text-right">

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              setSelected(
                                transaction,
                              )
                            }
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>

                        </TableCell>

                      </motion.tr>
                    );
                  },
                )

              )}

            </TableBody>

          </Table>

        </div>

      </Card>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex items-center justify-between">

          <p className="text-xs text-muted-foreground">
            Page {currentPage} of{' '}
            {totalPages} ·{' '}
            {filtered.length}{' '}
            transactions
          </p>

          <div className="flex gap-1">

            <Button
              variant="outline"
              size="sm"
              disabled={
                currentPage <= 1
              }
              onClick={() =>
                setPage(
                  currentPage -
                    1,
                )
              }
            >
              Prev
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                currentPage >=
                totalPages
              }
              onClick={() =>
                setPage(
                  currentPage +
                    1,
                )
              }
            >
              Next
            </Button>

          </div>

        </div>

      )}

      {/* DETAILS MODAL */}

      {selected && (
        <TransactionDetailDialog
          transaction={selected}
          onClose={() =>
            setSelected(null)
          }
        />
      )}

    </div>
  );
}

// =========================================================
// TRANSACTION DETAIL DIALOG
// =========================================================

function TransactionDetailDialog({
  transaction,
  onClose,
}: {
  transaction: BackendTransaction;
  onClose: () => void;
}) {
  const buy =
    transaction.side.toUpperCase() ===
    'BUY';

  const realizedPnL =
    transaction.realizedPnL;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >

      <DialogContent className="max-w-lg">

        <DialogHeader>

          <DialogTitle className="flex items-center gap-2">

            Transaction Details

            <Badge
              variant="outline"
              className={cn(
                'border-0',

                buy
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger',
              )}
            >
              {transaction.side}
            </Badge>

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          {/* MAIN INFO */}

          <div className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-4">

            <div>

              <p className="font-display text-lg font-bold">
                {transaction.symbol}
              </p>

              <p className="font-mono text-xs text-muted-foreground">
                Transaction #
                {
                  transaction.transactionId
                }
              </p>

            </div>

            <div className="text-right">

              <p
                className={cn(
                  'font-display text-xl font-bold tabular-nums',

                  buy
                    ? 'text-danger'
                    : 'text-success',
                )}
              >
                {buy ? '-' : '+'}

                {formatCurrency(
                  transaction.totalAmount,
                )}
              </p>

              <p className="text-xs text-muted-foreground">
                {
                  transaction.quantity
                }{' '}
                shares
              </p>

            </div>

          </div>

          {/* DETAILS */}

          <div className="grid grid-cols-2 gap-3">

            <DetailItem
              label="Transaction ID"
              value={`#${transaction.transactionId}`}
            />

            <DetailItem
              label="Order ID"
              value={`#${transaction.orderId}`}
            />

            <DetailItem
              label="Side"
              value={
                transaction.side
              }
            />

            <DetailItem
              label="Quantity"
              value={`${transaction.quantity} shares`}
            />

            <DetailItem
              label="Execution Price"
              value={formatCurrency(
                transaction.price,
              )}
            />

            <DetailItem
              label="Total Amount"
              value={formatCurrency(
                transaction.totalAmount,
              )}
            />

            <DetailItem
              label="Realized P&L"
              value={
                realizedPnL == null
                  ? 'Not applicable'
                  : `${
                      realizedPnL >= 0
                        ? '+'
                        : ''
                    }${formatCurrency(
                      realizedPnL,
                    )}`
              }
            />

            <DetailItem
              label="Executed"
              value={formatBackendDate(
                transaction.executedAt,
              )}
            />

          </div>

          {/* EXECUTION STATUS */}

          <div className="rounded-lg border border-success/20 bg-success/5 p-3">

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">

                <TrendingUp className="h-4 w-4 text-success" />

              </div>

              <div>

                <p className="text-sm font-semibold">
                  Trade Executed
                </p>

                <p className="text-xs text-muted-foreground">
                  This transaction was executed successfully and recorded by Velora Markets.
                </p>

              </div>

            </div>

          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
}

// =========================================================
// DETAIL ITEM
// =========================================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-2.5">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 text-sm font-semibold">
        {value}
      </p>

    </div>
  );
}

// =========================================================
// DATE FORMATTER
// =========================================================

function formatBackendDate(
  value: string | null,
) {
  if (!value) {
    return '—';
  }

  return new Date(
    value,
  ).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}