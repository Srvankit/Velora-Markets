import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, AlertCircle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChargesBreakdown } from '@/components/trading/ChargesBreakdown';
import type { TradeOrder } from '@/types/trading';
import { formatCurrency } from '@/lib/format';
import { formatOrderType, formatProductType } from '@/lib/trading-calc';
import { cn } from '@/lib/utils';

interface OrderPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: TradeOrder | null;
  onConfirm: () => void;
  loading?: boolean;
}

export function OrderPreviewModal({ open, onOpenChange, order, onConfirm, loading }: OrderPreviewModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!order) return null;
  const isBuy = order.side === 'buy';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isBuy ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-danger" />
            )}
            Order Preview
          </DialogTitle>
          <DialogDescription>
            Review your order before placing it on the exchange.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border bg-card/40 p-3">
            <div>
              <p className="font-display text-base font-bold">{order.symbol}</p>
              <p className="text-xs text-muted-foreground">{order.name}</p>
            </div>
            <span className={cn(
              'rounded-lg px-2.5 py-1 text-sm font-bold',
              isBuy ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
            )}>
              {isBuy ? 'BUY' : 'SELL'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <DetailRow label="Quantity" value={`${order.quantity} shares`} />
            <DetailRow label="Price" value={formatCurrency(order.price)} />
            <DetailRow label="Order Type" value={formatOrderType(order.orderType)} />
            <DetailRow label="Product" value={formatProductType(order.productType)} />
          </div>

          <ChargesBreakdown
            charges={order.charges}
            investment={order.quantity * order.price}
            total={order.total}
            side={order.side}
          />

          <div className="flex items-center gap-2 rounded-lg border border-border p-3">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(v) => setConfirmed(v === true)}
            />
            <label htmlFor="confirm" className="text-xs text-muted-foreground">
              I confirm that I have reviewed this order and accept the charges shown above.
            </label>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className={cn('flex-1 gap-1.5', isBuy ? 'bg-success/80 hover:bg-success' : 'bg-danger/80 hover:bg-danger')}
              disabled={!confirmed || loading}
              onClick={onConfirm}
            >
              {loading ? 'Placing\u2026' : 'Confirm Order'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold">{value}</p>
    </div>
  );
}

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: TradeOrder | null;
  onContinueTrading: () => void;
  onViewOrders: () => void;
  onDashboard: () => void;
}

export function SuccessModal({ open, onOpenChange, order, onContinueTrading, onViewOrders, onDashboard }: SuccessModalProps) {
  if (!order) return null;
  const execTime = order.executedAt ? new Date(order.executedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '\u2014';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="sr-only">Order Success</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10"
          >
            <CheckCircle2 className="h-10 w-10 text-success" />
          </motion.div>
          <div>
            <h3 className="font-display text-xl font-bold">Order Placed!</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your {order.side} order has been executed successfully.</p>
          </div>
          <div className="w-full space-y-2 rounded-lg border border-border bg-card/40 p-4 text-left text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-mono font-semibold">{order.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Stock</span>
              <span className="font-semibold">{order.symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-semibold tabular-nums">{order.quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Executed At</span>
              <span className="font-semibold">{execTime}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-medium">Total</span>
              <span className="font-bold tabular-nums">{formatCurrency(order.total)}</span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button className="w-full" onClick={onContinueTrading}>Continue Trading</Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onViewOrders}>View Orders</Button>
              <Button variant="outline" className="flex-1" onClick={onDashboard}>Dashboard</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface FailureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: string | null;
  onRetry: () => void;
}

export function FailureModal({ open, onOpenChange, error, onRetry }: FailureModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="sr-only">Order Failed</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10"
          >
            <AlertCircle className="h-10 w-10 text-danger" />
          </motion.div>
          <div>
            <h3 className="font-display text-xl font-bold text-danger">Order Failed</h3>
            <p className="mt-1 text-sm text-muted-foreground">{error ?? 'An unexpected error occurred.'}</p>
          </div>
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Dismiss</Button>
            <Button className="flex-1" onClick={onRetry}>Try Again</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
