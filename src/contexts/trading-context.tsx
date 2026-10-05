import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { TradeOrder, Holding, Position, OrderSide, OrderType, OrderValidity, ProductType, ChargeBreakdown } from '@/types/trading';
import { calculateCharges } from '@/lib/trading-calc';
import { formatCurrency } from '@/lib/format';
import { backendApi, getApiErrorMessage, type BackendOrder, type BackendPortfolio } from '@/services/backend';
import { useAuth } from '@/contexts/auth-context';

interface TradingState { orders: TradeOrder[]; holdings: Holding[]; positions: Position[]; balance: number; }
interface PlaceOrderInput { symbol: string; name: string; side: OrderSide; quantity: number; price: number; orderType: OrderType; productType: ProductType; validity: OrderValidity; stopLoss?: number; targetPrice?: number; }
interface TradingContextValue extends TradingState {
  placeOrder: (input: PlaceOrderInput) => Promise<{ success: boolean; order: TradeOrder; error?: string }>;
  cancelOrder: (id: string) => void; getHolding: (symbol: string) => Holding | undefined; refreshTrading: () => Promise<void>;
  totalHoldingsValue: number; todayProfit: number; overallReturn: number;
}
const emptyState: TradingState = { orders: [], holdings: [], positions: [], balance: 0 };
const TradingContext = createContext<TradingContextValue | undefined>(undefined);
const zeroCharges: ChargeBreakdown = { brokerage: 0, exchangeCharges: 0, stt: 0, gst: 0, stampDuty: 0, sebiCharges: 0, total: 0 };

function mapPortfolio(p: BackendPortfolio): Holding[] {
  return p.holdings.map((h) => ({ id: String(h.id), symbol: h.symbol, name: h.companyName, shares: h.quantity, avgPrice: h.averageBuyPrice, currentPrice: h.currentPrice, logoColor: '#6366F1', sector: '—', exchange: 'NSE', productType: 'delivery' }));
}
function mapOrder(o: BackendOrder): TradeOrder {
  const status: TradeOrder['status'] = o.status === 'EXECUTED' ? 'completed' : o.status.toLowerCase() as TradeOrder['status'];
  const price = o.executionPrice ?? o.limitPrice ?? 0;
  return { id: String(o.orderId), symbol: o.symbol, name: o.companyName, side: o.side.toLowerCase() as OrderSide, quantity: o.quantity, price,
    orderType: o.orderType.toLowerCase() as OrderType, productType: 'delivery', validity: 'day', charges: zeroCharges, total: o.totalAmount ?? 0, status,
    createdAt: o.createdAt, executedAt: o.executedAt ?? undefined, timeline: [{ status: 'submitted', timestamp: o.createdAt, note: 'Order submitted' }, ...(o.executedAt ? [{ status: 'completed' as const, timestamp: o.executedAt, note: `Order executed at ${formatCurrency(price)}` }] : [])] };
}

export function TradingProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<TradingState>(emptyState);
  const refreshTrading = useCallback(async () => {
    if (!isAuthenticated) { setState(emptyState); return; }
    try { const [portfolio, orders] = await Promise.all([backendApi.portfolio(), backendApi.orders()]); const orderList = Array.isArray(orders) ? orders : (orders?.content ?? []); setState({ balance: portfolio.cashBalance, holdings: mapPortfolio(portfolio), orders: orderList.map(mapOrder), positions: [] }); }
    catch { /* protected pages can render empty state; auth interceptor handles 401 */ }
  }, [isAuthenticated]);
  useEffect(() => { void refreshTrading(); }, [refreshTrading]);

  const placeOrder = useCallback(async (input: PlaceOrderInput) => {
    const fallbackOrder: TradeOrder = { id: `ERR-${Date.now()}`, ...input, charges: calculateCharges(input.side, input.quantity, input.price, input.orderType, input.productType), total: input.quantity * input.price, status: 'rejected', createdAt: new Date().toISOString(), timeline: [] };
    if (input.orderType !== 'market') return { success: false, order: fallbackOrder, error: 'The backend currently supports MARKET orders only.' };
    try {
      const result = await backendApi.placeOrder({ symbol: input.symbol, side: input.side.toUpperCase() as 'BUY' | 'SELL', orderType: 'MARKET', quantity: input.quantity });
      await refreshTrading();
      const order: TradeOrder = { ...fallbackOrder, id: String(result.orderId), name: result.companyName, price: result.executionPrice, total: result.totalAmount, status: 'completed', executedAt: result.executedAt, timeline: [{ status: 'submitted', timestamp: result.executedAt }, { status: 'completed', timestamp: result.executedAt, note: result.message }] };
      return { success: true, order };
    } catch (e) { const error = getApiErrorMessage(e, 'Order failed'); return { success: false, order: { ...fallbackOrder, rejectionReason: error }, error }; }
  }, [refreshTrading]);
  const cancelOrder = useCallback((_id: string) => { /* cancellation API is not implemented by the backend yet */ }, []);
  const getHolding = useCallback((symbol: string) => state.holdings.find((h) => h.symbol === symbol), [state.holdings]);
  const totalHoldingsValue = useMemo(() => state.holdings.reduce((s, h) => s + h.shares * h.currentPrice, 0), [state.holdings]);
  const todayProfit = 0;
  const overallReturn = useMemo(() => state.holdings.reduce((s, h) => s + (h.currentPrice - h.avgPrice) * h.shares, 0), [state.holdings]);
  return <TradingContext.Provider value={{ ...state, placeOrder, cancelOrder, getHolding, refreshTrading, totalHoldingsValue, todayProfit, overallReturn }}>{children}</TradingContext.Provider>;
}
export function useTrading() { const ctx = useContext(TradingContext); if (!ctx) throw new Error('useTrading must be used within TradingProvider'); return ctx; }
