import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  X,
  RefreshCw,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

import { backendApi } from '@/services/backend';

type BackendOrder = {
  orderId: number;
  symbol: string;
  companyName: string;
  side: string;
  orderType: string;
  status: string;
  quantity: number;
  limitPrice: number | null;
  executionPrice: number | null;
  totalAmount: number | null;
  createdAt: string;
  executedAt: string | null;
};

type Filter =
  | 'all'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'rejected';

const statusFilters: {
  value: Filter;
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rejected', label: 'Rejected' },
];

const PAGE_SIZE = 8;

export function OrderTable() {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState<BackendOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [filter, setFilter] =
    useState<Filter>('all');

  const [search, setSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [selected, setSelected] =
    useState<BackendOrder | null>(null);

  // =========================================================
  // LOAD REAL BACKEND ORDERS
  // =========================================================

  async function loadOrders(
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
       * Fetch a reasonably large page here because the
       * existing UI performs its own filtering/pagination.
       *
       * Backend already limits page size to max 100.
       */
      const response =
        await backendApi.orders(0, 100);

      setOrders(response.content ?? []);
    } catch (err) {
      console.error(
        'Failed to load orders:',
        err,
      );

      setError(
        'Unable to load your order history.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  // =========================================================
  // FILTERING
  // =========================================================

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const backendStatus =
        order.status.toUpperCase();

      if (filter !== 'all') {
        if (
          filter === 'completed' &&
          backendStatus !== 'EXECUTED' &&
          backendStatus !== 'COMPLETED'
        ) {
          return false;
        }

        if (
          filter === 'pending' &&
          backendStatus !== 'PENDING'
        ) {
          return false;
        }

        if (
          filter === 'cancelled' &&
          backendStatus !== 'CANCELLED'
        ) {
          return false;
        }

        if (
          filter === 'rejected' &&
          backendStatus !== 'REJECTED'
        ) {
          return false;
        }
      }

      if (search.trim()) {
        const q =
          search.trim().toLowerCase();

        const matches =
          order.symbol
            .toLowerCase()
            .includes(q) ||
          order.companyName
            .toLowerCase()
            .includes(q) ||
          String(order.orderId)
            .includes(q);

        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }, [orders, filter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / PAGE_SIZE,
    ),
  );

  const currentPage = Math.min(
    page,
    totalPages,
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // =========================================================
  // HELPERS
  // =========================================================

  function getDisplayedPrice(
    order: BackendOrder,
  ) {
    return (
      order.executionPrice ??
      order.limitPrice ??
      0
    );
  }

  function formatBackendDate(
    value: string | null,
  ) {
    if (!value) {
      return '—';
    }

    return new Date(value).toLocaleString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    );
  }

  function getStatusStyle(
    status: string,
  ) {
    switch (status.toUpperCase()) {
      case 'EXECUTED':
      case 'COMPLETED':
        return 'bg-success/10 text-success';

      case 'PENDING':
        return 'bg-warning/10 text-warning';

      case 'REJECTED':
        return 'bg-danger/10 text-danger';

      case 'CANCELLED':
        return 'bg-muted text-muted-foreground';

      default:
        return 'bg-muted text-muted-foreground';
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-4">

      {/* CONTROLS */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex flex-wrap gap-1.5">

          {statusFilters.map(
            (item) => (
              <button
                key={item.value}
                onClick={() => {
                  setFilter(item.value);
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
              placeholder="Search orders..."
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
              void loadOrders(true)
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

      {/* ERROR */}

      {error && (
        <Card className="border-danger/30 bg-danger/5 p-4">
          <p className="text-sm text-danger">
            {error}
          </p>
        </Card>
      )}

      {/* TABLE */}

      <Card className="overflow-hidden p-0">

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>

              <TableRow className="hover:bg-transparent">

                <TableHead className="text-xs">
                  Order ID
                </TableHead>

                <TableHead className="text-xs">
                  Company
                </TableHead>

                <TableHead className="text-xs">
                  Side
                </TableHead>

                <TableHead className="text-right text-xs">
                  Qty
                </TableHead>

                <TableHead className="text-right text-xs">
                  Price
                </TableHead>

                <TableHead className="text-xs">
                  Type
                </TableHead>

                <TableHead className="text-xs">
                  Status
                </TableHead>

                <TableHead className="text-xs">
                  Date
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
                    colSpan={9}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    Loading orders...
                  </TableCell>

                </TableRow>

              ) : paginated.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={9}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    No orders found matching your filters.
                  </TableCell>

                </TableRow>

              ) : (

                paginated.map(
                  (order, index) => {

                    const buy =
                      order.side.toUpperCase() ===
                      'BUY';

                    return (
                      <motion.tr
                        key={
                          order.orderId
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

                        <TableCell className="font-mono text-xs">
                          #{order.orderId}
                        </TableCell>

                        <TableCell>

                          <div className="flex flex-col">

                            <span className="text-sm font-semibold">
                              {order.symbol}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              {
                                order.companyName
                              }
                            </span>

                          </div>

                        </TableCell>

                        <TableCell>

                          <span
                            className={cn(
                              'inline-flex rounded-md px-1.5 py-0.5 text-xs font-medium',

                              buy
                                ? 'bg-success/10 text-success'
                                : 'bg-danger/10 text-danger',
                            )}
                          >
                            {buy
                              ? 'Buy'
                              : 'Sell'}
                          </span>

                        </TableCell>

                        <TableCell className="text-right tabular-nums">
                          {order.quantity}
                        </TableCell>

                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(
                            getDisplayedPrice(
                              order,
                            ),
                          )}
                        </TableCell>

                        <TableCell className="text-xs capitalize">
                          {order.orderType
                            .toLowerCase()
                            .replace(
                              '_',
                              ' ',
                            )}
                        </TableCell>

                        <TableCell>

                          <span
                            className={cn(
                              'inline-flex rounded-md px-2 py-1 text-xs font-medium capitalize',

                              getStatusStyle(
                                order.status,
                              ),
                            )}
                          >
                            {order.status.toLowerCase()}
                          </span>

                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {formatBackendDate(
                            order.createdAt,
                          )}
                        </TableCell>

                        <TableCell className="text-right">

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              setSelected(
                                order,
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
            {filtered.length} orders
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
                  currentPage - 1,
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
                  currentPage + 1,
                )
              }
            >
              Next
            </Button>

          </div>

        </div>

      )}

      {/* ORDER DETAILS */}

      {selected && (

        <BackendOrderDetailDialog
          order={selected}
          onClose={() =>
            setSelected(null)
          }
          onNavigate={(sym) =>
            navigate(
              `/stocks/${sym}`,
            )
          }
        />

      )}

    </div>
  );
}

// =========================================================
// ORDER DETAIL
// =========================================================

function BackendOrderDetailDialog({
  order,
  onClose,
  onNavigate,
}: {
  order: BackendOrder;
  onClose: () => void;
  onNavigate: (
    symbol: string,
  ) => void;
}) {
  const buy =
    order.side.toUpperCase() === 'BUY';

  const price =
    order.executionPrice ??
    order.limitPrice ??
    0;

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

          <DialogTitle>
            Order Details
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <div className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3">

            <div>

              <p className="font-display text-base font-bold">
                {order.symbol}
              </p>

              <p className="text-xs text-muted-foreground">
                {order.companyName}
              </p>

            </div>

            <span
              className={cn(
                'rounded-lg px-2.5 py-1 text-sm font-bold',

                buy
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger',
              )}
            >
              {order.side}
            </span>

          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">

            <DetailItem
              label="Order ID"
              value={`#${order.orderId}`}
            />

            <DetailItem
              label="Quantity"
              value={`${order.quantity} shares`}
            />

            <DetailItem
              label="Execution Price"
              value={formatCurrency(
                price,
              )}
            />

            <DetailItem
              label="Order Type"
              value={
                order.orderType
              }
            />

            <DetailItem
              label="Status"
              value={order.status}
            />

            <DetailItem
              label="Total Amount"
              value={formatCurrency(
                order.totalAmount ??
                  order.quantity *
                    price,
              )}
            />

            <DetailItem
              label="Created"
              value={formatBackendDateStatic(
                order.createdAt,
              )}
            />

            <DetailItem
              label="Executed"
              value={formatBackendDateStatic(
                order.executedAt,
              )}
            />

          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              onNavigate(
                order.symbol,
              )
            }
          >
            View {order.symbol} Details
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  );
}

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

      <p className="mt-0.5 text-sm font-semibold capitalize">
        {value}
      </p>

    </div>
  );
}

function formatBackendDateStatic(
  value: string | null,
) {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  );
}