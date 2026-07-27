import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

interface OrderPanelProps {
  symbol: string;
  currentPrice: number;
  availableBalance: number;
}

export function OrderPanel({ symbol, currentPrice, availableBalance }: OrderPanelProps) {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('10');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState(currentPrice.toFixed(2));
  const [stopLoss, setStopLoss] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  const qty = parseInt(quantity) || 0;
  const effectivePrice = orderType === 'limit' ? parseFloat(limitPrice) || 0 : currentPrice;
  const estimatedCost = qty * effectivePrice;
  const isBuy = tab === 'buy';
  const insufficientFunds = isBuy && estimatedCost > availableBalance;

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Place Order</h3>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'buy' | 'sell')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy" className="data-[state=active]:bg-success/10 data-[state=active]:text-success">Buy</TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-danger/10 data-[state=active]:text-danger">Sell</TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: tab === 'buy' ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 space-y-3"
        >
          <div className="space-y-1.5">
            <Label className="text-xs">Quantity (shares)</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Order Type</Label>
            <Select value={orderType} onValueChange={(v) => setOrderType(v as 'market' | 'limit')}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence>
            {orderType === 'limit' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <Label className="text-xs">Limit Price</Label>
                <Input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="h-9"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Stop Loss</Label>
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Optional"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Target Price</Label>
              <Input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Optional"
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-border bg-card/40 p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimated Cost</span>
              <span className="font-semibold tabular-nums">{formatCurrency(estimatedCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Available Balance</span>
              <span className={cn('font-semibold tabular-nums', insufficientFunds && 'text-danger')}>
                {formatCurrency(availableBalance)}
              </span>
            </div>
            {insufficientFunds && (
              <p className="text-danger">Insufficient balance for this order.</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" size="sm">
              Preview Order
            </Button>
            <Button
              disabled
              className={cn(
                'flex-1',
                isBuy ? 'bg-success/80' : 'bg-danger/80',
              )}
              size="sm"
            >
              {isBuy ? 'Buy' : 'Sell'} {symbol}
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Demo mode \u00b7 Orders cannot be placed yet
          </p>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
