import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Info, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { OrderSide, OrderType, OrderValidity, ProductType } from '@/types/trading';
import { calculateCharges, calculateTotal, formatOrderType, formatProductType } from '@/lib/trading-calc';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

interface TradePanelProps {
  symbol: string;
  name: string;
  currentPrice: number;
  availableBalance: number;
  onPreview: (order: PreviewOrderData) => void;
}

export interface PreviewOrderData {
  symbol: string;
  name: string;
  side: OrderSide;
  quantity: number;
  price: number;
  orderType: OrderType;
  productType: ProductType;
  validity: OrderValidity;
  stopLoss?: number;
  targetPrice?: number;
  charges: ReturnType<typeof calculateCharges>;
  total: number;
}

const orderTypeDescriptions: Record<OrderType, string> = {
  market: 'Execute immediately at the best available market price.',
  limit: 'Execute only at the specified price or better.',
  'stop-loss': 'Trigger a market order when the stop price is hit.',
  'stop-limit': 'Trigger a limit order when the stop price is hit.',
};

const validityDescriptions: Record<OrderValidity, string> = {
  day: 'Order remains active until the end of the trading day.',
  ioc: 'Immediate or Cancel: execute what is possible, cancel the rest.',
};

export function TradePanel({ symbol, name, currentPrice, availableBalance, onPreview }: TradePanelProps) {
  const [side, setSide] = useState<OrderSide>('buy');
  const [quantity, setQuantity] = useState('10');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [productType, setProductType] = useState<ProductType>('delivery');
  const [validity, setValidity] = useState<OrderValidity>('day');
  const [price, setPrice] = useState(currentPrice.toFixed(2));
  const [stopLoss, setStopLoss] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  const qty = parseInt(quantity) || 0;
  const effectivePrice = orderType === 'market' ? currentPrice : parseFloat(price) || 0;
  const investment = qty * effectivePrice;
  const charges = useMemo(
    () => calculateCharges(side, qty, effectivePrice, orderType, productType),
    [side, qty, effectivePrice, orderType, productType],
  );
  const total = calculateTotal(qty, effectivePrice, charges);
  const isBuy = side === 'buy';
  const insufficientFunds = isBuy && total > availableBalance;

  const handleReset = () => {
    setQuantity('10');
    setOrderType('market');
    setProductType('delivery');
    setValidity('day');
    setPrice(currentPrice.toFixed(2));
    setStopLoss('');
    setTargetPrice('');
  };

  const handlePreview = () => {
    onPreview({
      symbol,
      name,
      side,
      quantity: qty,
      price: effectivePrice,
      orderType,
      productType,
      validity,
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      targetPrice: targetPrice ? parseFloat(targetPrice) : undefined,
      charges,
      total,
    });
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold">Place Order</h3>
            <p className="text-xs text-muted-foreground">{symbol} \u00b7 {name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">LTP</p>
            <p className="font-display text-lg font-bold tabular-nums">{formatCurrency(currentPrice)}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={side} onValueChange={(v) => setSide(v as OrderSide)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="data-[state=active]:bg-success/10 data-[state=active]:text-success">Buy</TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-danger/10 data-[state=active]:text-danger">Sell</TabsTrigger>
          </TabsList>
        </Tabs>

        <AnimatePresence mode="wait">
          <motion.div
            key={side}
            initial={{ opacity: 0, x: side === 'buy' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Quantity</Label>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Price {orderType === 'market' && '(Market)'}</Label>
                <Input
                  type="number"
                  value={orderType === 'market' ? currentPrice.toFixed(2) : price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={orderType === 'market'}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs">Order Type</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px] text-xs">
                        {orderTypeDescriptions[orderType]}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                    <SelectItem value="stop-loss">Stop Loss</SelectItem>
                    <SelectItem value="stop-limit">Stop Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label className="text-xs">Validity</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[200px] text-xs">
                        {validityDescriptions[validity]}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={validity} onValueChange={(v) => setValidity(v as OrderValidity)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="ioc">IOC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Product Type</Label>
              <Select value={productType} onValueChange={(v) => setProductType(v as ProductType)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery (CNC)</SelectItem>
                  <SelectItem value="intraday">Intraday (MIS)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Stop Loss</Label>
                <Input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="Optional" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Target Price</Label>
                <Input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} placeholder="Optional" className="h-9" />
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 rounded-lg border border-border bg-card/40 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Investment</span>
                <span className="font-medium tabular-nums">{formatCurrency(investment)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Charges</span>
                <span className="font-medium tabular-nums">{formatCurrency(charges.total)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-1.5">
                <span className="font-semibold">{isBuy ? 'Total Cost' : 'Net Proceeds'}</span>
                <span className={cn('font-bold tabular-nums', insufficientFunds && 'text-danger')}>{formatCurrency(total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available Balance</span>
                <span className={cn('font-medium tabular-nums', insufficientFunds && 'text-danger')}>{formatCurrency(availableBalance)}</span>
              </div>
              {insufficientFunds && (
                <p className="text-danger">Insufficient balance for this order.</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
              <Button
                size="sm"
                className={cn('flex-1 gap-1', isBuy ? 'bg-success/80 hover:bg-success' : 'bg-danger/80 hover:bg-danger')}
                onClick={handlePreview}
                disabled={qty <= 0 || insufficientFunds}
              >
                <Zap className="h-3.5 w-3.5" />
                Preview Order
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
