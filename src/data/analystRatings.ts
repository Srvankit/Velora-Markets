export interface AnalystRating {
  symbol: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  averageTarget: number;
  highestTarget: number;
  lowestTarget: number;
  consensus: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
}

export const analystRatings: Record<string, AnalystRating> = {
  AAPL: { symbol: 'AAPL', strongBuy: 18, buy: 22, hold: 8, sell: 2, strongSell: 0, averageTarget: 250.50, highestTarget: 275.00, lowestTarget: 225.00, consensus: 'Buy' },
  MSFT: { symbol: 'MSFT', strongBuy: 24, buy: 20, hold: 4, sell: 1, strongSell: 0, averageTarget: 460.00, highestTarget: 500.00, lowestTarget: 410.00, consensus: 'Strong Buy' },
  NVDA: { symbol: 'NVDA', strongBuy: 28, buy: 16, hold: 5, sell: 1, strongSell: 0, averageTarget: 175.00, highestTarget: 220.00, lowestTarget: 135.00, consensus: 'Strong Buy' },
  TSLA: { symbol: 'TSLA', strongBuy: 8, buy: 12, hold: 15, sell: 8, strongSell: 4, averageTarget: 245.00, highestTarget: 310.00, lowestTarget: 180.00, consensus: 'Hold' },
  AMZN: { symbol: 'AMZN', strongBuy: 20, buy: 24, hold: 6, sell: 1, strongSell: 0, averageTarget: 230.00, highestTarget: 260.00, lowestTarget: 200.00, consensus: 'Strong Buy' },
  META: { symbol: 'META', strongBuy: 22, buy: 18, hold: 7, sell: 2, strongSell: 0, averageTarget: 640.00, highestTarget: 700.00, lowestTarget: 560.00, consensus: 'Strong Buy' },
  GOOGL: { symbol: 'GOOGL', strongBuy: 19, buy: 21, hold: 9, sell: 3, strongSell: 1, averageTarget: 195.00, highestTarget: 220.00, lowestTarget: 170.00, consensus: 'Buy' },
  NFLX: { symbol: 'NFLX', strongBuy: 14, buy: 16, hold: 10, sell: 4, strongSell: 1, averageTarget: 920.00, highestTarget: 1050.00, lowestTarget: 780.00, consensus: 'Buy' },
  RELIANCE: { symbol: 'RELIANCE', strongBuy: 12, buy: 18, hold: 8, sell: 2, strongSell: 0, averageTarget: 1450.00, highestTarget: 1600.00, lowestTarget: 1250.00, consensus: 'Buy' },
  TCS: { symbol: 'TCS', strongBuy: 8, buy: 14, hold: 12, sell: 4, strongSell: 1, averageTarget: 4350.00, highestTarget: 4700.00, lowestTarget: 3900.00, consensus: 'Hold' },
  INFY: { symbol: 'INFY', strongBuy: 10, buy: 15, hold: 10, sell: 3, strongSell: 1, averageTarget: 1980.00, highestTarget: 2150.00, lowestTarget: 1750.00, consensus: 'Buy' },
  ICICIBANK: { symbol: 'ICICIBANK', strongBuy: 16, buy: 18, hold: 6, sell: 1, strongSell: 0, averageTarget: 1080.00, highestTarget: 1200.00, lowestTarget: 950.00, consensus: 'Strong Buy' },
  HDFCBANK: { symbol: 'HDFCBANK', strongBuy: 14, buy: 17, hold: 8, sell: 2, strongSell: 0, averageTarget: 1850.00, highestTarget: 2000.00, lowestTarget: 1700.00, consensus: 'Buy' },
  SBIN: { symbol: 'SBIN', strongBuy: 10, buy: 16, hold: 10, sell: 3, strongSell: 1, averageTarget: 890.00, highestTarget: 980.00, lowestTarget: 750.00, consensus: 'Buy' },
  JPM: { symbol: 'JPM', strongBuy: 12, buy: 15, hold: 9, sell: 4, strongSell: 1, averageTarget: 260.00, highestTarget: 285.00, lowestTarget: 230.00, consensus: 'Buy' },
  JNJ: { symbol: 'JNJ', strongBuy: 6, buy: 12, hold: 14, sell: 6, strongSell: 2, averageTarget: 165.00, highestTarget: 185.00, lowestTarget: 145.00, consensus: 'Hold' },
  WMT: { symbol: 'WMT', strongBuy: 15, buy: 19, hold: 7, sell: 2, strongSell: 0, averageTarget: 92.00, highestTarget: 105.00, lowestTarget: 80.00, consensus: 'Strong Buy' },
  V: { symbol: 'V', strongBuy: 18, buy: 20, hold: 5, sell: 1, strongSell: 0, averageTarget: 310.00, highestTarget: 340.00, lowestTarget: 280.00, consensus: 'Strong Buy' },
  SUNPHARMA: { symbol: 'SUNPHARMA', strongBuy: 11, buy: 14, hold: 9, sell: 3, strongSell: 1, averageTarget: 1920.00, highestTarget: 2100.00, lowestTarget: 1650.00, consensus: 'Buy' },
  TATAMOTORS: { symbol: 'TATAMOTORS', strongBuy: 8, buy: 12, hold: 12, sell: 5, strongSell: 2, averageTarget: 820.00, highestTarget: 980.00, lowestTarget: 650.00, consensus: 'Hold' },
  MARUTI: { symbol: 'MARUTI', strongBuy: 10, buy: 14, hold: 10, sell: 4, strongSell: 1, averageTarget: 12200.00, highestTarget: 13500.00, lowestTarget: 10500.00, consensus: 'Buy' },
  ONGC: { symbol: 'ONGC', strongBuy: 7, buy: 13, hold: 11, sell: 5, strongSell: 2, averageTarget: 285.00, highestTarget: 340.00, lowestTarget: 230.00, consensus: 'Hold' },
  BHARTIARTL: { symbol: 'BHARTIARTL', strongBuy: 13, buy: 16, hold: 8, sell: 2, strongSell: 0, averageTarget: 1720.00, highestTarget: 1900.00, lowestTarget: 1500.00, consensus: 'Buy' },
};

const defaultRating: AnalystRating = {
  symbol: '',
  strongBuy: 8,
  buy: 12,
  hold: 10,
  sell: 4,
  strongSell: 1,
  averageTarget: 0,
  highestTarget: 0,
  lowestTarget: 0,
  consensus: 'Hold',
};

export function getAnalystRating(symbol: string, currentPrice: number): AnalystRating {
  const rating = analystRatings[symbol];
  if (!rating) {
    return {
      ...defaultRating,
      symbol,
      averageTarget: currentPrice * 1.08,
      highestTarget: currentPrice * 1.22,
      lowestTarget: currentPrice * 0.88,
    };
  }
  return rating;
}
