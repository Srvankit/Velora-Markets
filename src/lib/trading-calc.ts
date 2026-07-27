import type { ChargeBreakdown, OrderSide, OrderType, ProductType } from '@/types/trading';

/**
 * Calculate realistic trading charges based on Indian brokerage norms.
 * Equity delivery: 0% brokerage. Equity intraday: 0.03% or max ₹20.
 */
export function calculateCharges(
  side: OrderSide,
  quantity: number,
  price: number,
  orderType: OrderType,
  productType: ProductType,
): ChargeBreakdown {
  const investment = quantity * price;
  const isBuy = side === 'buy';

  // Brokerage: delivery = 0, intraday = 0.03% (max ₹20 per order)
  const brokerageRate = productType === 'intraday' ? 0.0003 : 0;
  let brokerage = Math.min(investment * brokerageRate, 20);
  brokerage = Math.round(brokerage * 100) / 100;

  // Exchange transaction charges: ~0.00345% for NSE
  const exchangeCharges = Math.round(investment * 0.0000345 * 100) / 100;

  // STT (Securities Transaction Tax): buy 0.1%, sell 0.1% on turnover
  const sttRate = isBuy ? 0.001 : 0.001;
  const stt = Math.round(investment * sttRate * 100) / 100;

  // SEBI turnover fee: 0.0001% (₹10 per crore)
  const sebiCharges = Math.round(investment * 0.000001 * 100) / 100;

  // Stamp duty: buy 0.005%, sell 0
  const stampRate = isBuy ? 0.00005 : 0;
  const stampDuty = Math.round(investment * stampRate * 100) / 100;

  // GST: 18% on (brokerage + exchange + sebi)
  const gst = Math.round((brokerage + exchangeCharges + sebiCharges) * 0.18 * 100) / 100;

  const total = Math.round((brokerage + exchangeCharges + stt + gst + stampDuty + sebiCharges) * 100) / 100;

  return { brokerage, exchangeCharges, stt, gst, stampDuty, sebiCharges, total };
}

export function calculateTotal(quantity: number, price: number, charges: ChargeBreakdown): number {
  return Math.round((quantity * price + charges.total) * 100) / 100;
}

export function formatOrderType(type: OrderType): string {
  switch (type) {
    case 'market': return 'Market';
    case 'limit': return 'Limit';
    case 'stop-loss': return 'Stop Loss';
    case 'stop-limit': return 'Stop Limit';
  }
}

export function formatProductType(type: ProductType): string {
  return type === 'intraday' ? 'Intraday' : 'Delivery';
}
