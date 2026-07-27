export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop-loss' | 'stop-limit';
export type OrderValidity = 'day' | 'ioc';
export type ProductType = 'intraday' | 'delivery';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'rejected';

export interface TradeOrder {
  id: string;
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
  charges: ChargeBreakdown;
  total: number;
  status: OrderStatus;
  rejectionReason?: string;
  createdAt: string;
  executedAt?: string;
  timeline: OrderTimelineEvent[];
}

export interface OrderTimelineEvent {
  status: OrderStatus | 'submitted';
  timestamp: string;
  note?: string;
}

export interface ChargeBreakdown {
  brokerage: number;
  exchangeCharges: number;
  stt: number;
  gst: number;
  stampDuty: number;
  sebiCharges: number;
  total: number;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  logoColor: string;
  sector: string;
  exchange: string;
  productType: ProductType;
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  side: OrderSide;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  productType: ProductType;
  status: 'open' | 'closed';
  logoColor: string;
  closedAt?: string;
}

export interface MarketDepthLevel {
  price: number;
  quantity: number;
  orders: number;
}

export interface MarketDepth {
  bids: MarketDepthLevel[];
  asks: MarketDepthLevel[];
}

export interface RecentTrade {
  id: string;
  time: string;
  price: number;
  quantity: number;
  side: OrderSide;
  buyer: string;
  seller: string;
}

export interface TradingTip {
  id: string;
  title: string;
  description: string;
  icon: string;
}
