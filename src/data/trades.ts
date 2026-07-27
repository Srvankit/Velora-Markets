import type { RecentTrade, MarketDepth, TradingTip } from '@/types/trading';

export function generateMarketDepth(basePrice: number) {
  const bids: { price: number; quantity: number; orders: number }[] = [];
  const asks: { price: number; quantity: number; orders: number }[] = [];

  for (let i = 0; i < 5; i++) {
    const bidPrice = basePrice - (i + 1) * (basePrice * 0.001);
    const askPrice = basePrice + (i + 1) * (basePrice * 0.001);
    bids.push({
      price: Number(bidPrice.toFixed(2)),
      quantity: Math.floor(Math.random() * 800 + 100),
      orders: Math.floor(Math.random() * 20 + 5),
    });
    asks.push({
      price: Number(askPrice.toFixed(2)),
      quantity: Math.floor(Math.random() * 800 + 100),
      orders: Math.floor(Math.random() * 20 + 5),
    });
  }
  return { bids, asks };
}

export function generateRecentTrades(basePrice: number, count = 12): RecentTrade[] {
  const trades: RecentTrade[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const price = basePrice + (Math.random() - 0.5) * basePrice * 0.002;
    trades.push({
      id: `rt-${i}`,
      time: new Date(now.getTime() - i * 15000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: Number(price.toFixed(2)),
      quantity: Math.floor(Math.random() * 500 + 10),
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      buyer: `Broker ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
      seller: `Broker ${String.fromCharCode(70 + Math.floor(Math.random() * 5))}`,
    });
  }
  return trades;
}

export const tradingTips: TradingTip[] = [
  { id: 't1', title: 'Set Stop Loss', description: 'Always use a stop loss to limit downside risk on every trade.', icon: 'ShieldAlert' },
  { id: 't2', title: 'Diversify', description: 'Avoid putting more than 10% of your capital into a single stock.', icon: 'Layers' },
  { id: 't3', title: 'Avoid FOMO', description: 'Don\u2019t chase stocks at highs. Wait for a pullback or better entry.', icon: 'Clock' },
  { id: 't4', title: 'Review Charges', description: 'Intraday trades incur brokerage. Delivery trades are commission-free.', icon: 'Receipt' },
];
