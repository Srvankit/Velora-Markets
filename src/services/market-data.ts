import { marketStocks, type MarketStock } from '@/data/stocks';
import type { BackendMarketStock } from '@/services/backend';

function buildSparkline(
  existing: number[],
  currentPrice: number,
): number[] {
  if (!existing.length) {
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

  if (!local) {
    return {
      symbol: backendStock.symbol,
      name: backendStock.companyName,
      exchange: backendStock.exchange,
      sector: backendStock.sector,
      price: backendStock.price,
      change: backendStock.change,
      changePercent: backendStock.changePercent,
      volume: backendStock.volume,

      marketCap: 0,
      sparkline: [backendStock.previousClose, backendStock.price],
      logoColor: '#64748B',
      capSize: 'Large Cap',
    };
  }

  return {
    ...local,

    // Backend is authoritative for live/simulated market fields
    symbol: backendStock.symbol,
    name: backendStock.companyName,
    exchange: backendStock.exchange,
    sector: backendStock.sector,
    price: backendStock.price,
    change: backendStock.change,
    changePercent: backendStock.changePercent,
    volume: backendStock.volume,

    // Keep visual chart compatible with backend price
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