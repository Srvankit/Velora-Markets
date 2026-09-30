import { marketStocks, type MarketStock } from '@/data/stocks';
import type { BackendMarketStock } from '@/services/backend';

function buildSparkline(
  existing: number[],
  currentPrice: number,
): number[] {
  if (!existing || !existing.length) {
    return [currentPrice];
  }

  const oldFinalPrice = existing[existing.length - 1];

  if (!oldFinalPrice || oldFinalPrice <= 0) {
    return [...existing.slice(0, -1), currentPrice];
  }

  const ratio = currentPrice / oldFinalPrice;

  return existing.map((value) => value * ratio);
}

export function mergeMarketStock(
  backendStock: BackendMarketStock,
): MarketStock {
  const local = marketStocks.find(
    (stock) =>
      stock.symbol.toUpperCase() ===
      backendStock.symbol.toUpperCase(),
  );

  const prevClose = backendStock.previousClose ?? (backendStock.price - backendStock.change);

  if (!local) {
    return {
      symbol: backendStock.symbol,
      name: backendStock.companyName || backendStock.symbol,
      exchange: backendStock.exchange || 'NSE',
      sector: backendStock.sector || 'Equities',
      currency: backendStock.currency || (backendStock.exchange === 'NASDAQ' || backendStock.exchange === 'NYSE' ? 'USD' : 'INR'),
      price: backendStock.price,
      change: backendStock.change,
      changePercent: backendStock.changePercent,
      volume: backendStock.volume,
      open: backendStock.open ?? prevClose,
      high: backendStock.high ?? Math.max(backendStock.price, prevClose),
      low: backendStock.low ?? Math.min(backendStock.price, prevClose),
      previousClose: prevClose,
      marketStatus: backendStock.marketStatus ?? 'LIVE',
      timestamp: backendStock.timestamp,
      marketCap: 0,
      sparkline: [prevClose, backendStock.price],
      logoColor: '#6366F1',
      capSize: 'Large Cap',
    };
  }

  return {
    ...local,
    symbol: backendStock.symbol,
    name: backendStock.companyName || local.name,
    exchange: backendStock.exchange || local.exchange,
    sector: backendStock.sector || local.sector,
    currency: backendStock.currency || local.currency,
    price: backendStock.price,
    change: backendStock.change,
    changePercent: backendStock.changePercent,
    volume: backendStock.volume,
    open: backendStock.open ?? local.open ?? prevClose,
    high: backendStock.high ?? local.high ?? Math.max(backendStock.price, prevClose),
    low: backendStock.low ?? local.low ?? Math.min(backendStock.price, prevClose),
    previousClose: prevClose,
    marketStatus: backendStock.marketStatus ?? local.marketStatus ?? 'LIVE',
    timestamp: backendStock.timestamp,
    sparkline: buildSparkline(
      local.sparkline,
      backendStock.price,
    ),
  };
}

export function mergeMarketStocks(
  backendStocks: BackendMarketStock[],
): MarketStock[] {
  return backendStocks.map(mergeMarketStock);
}