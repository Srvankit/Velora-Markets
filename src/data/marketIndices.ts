export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  category: 'equity' | 'crypto' | 'forex';
}

export const marketIndices: MarketIndex[] = [
  { symbol: 'NIFTY50', name: 'NIFTY 50', value: 24867.55, change: 142.35, changePercent: 0.58, sparkline: [24600, 24680, 24720, 24750, 24800, 24830, 24867], category: 'equity' },
  { symbol: 'SENSEX', name: 'SENSEX', value: 81455.32, change: 318.22, changePercent: 0.39, sparkline: [80900, 81050, 81180, 81280, 81380, 81420, 81455], category: 'equity' },
  { symbol: 'NASDAQ', name: 'NASDAQ', value: 18342.94, change: -89.45, changePercent: -0.49, sparkline: [18500, 18460, 18420, 18390, 18370, 18350, 18342], category: 'equity' },
  { symbol: 'SPX', name: 'S&P 500', value: 5937.75, change: 18.92, changePercent: 0.32, sparkline: [5880, 5900, 5910, 5920, 5925, 5932, 5937], category: 'equity' },
  { symbol: 'DJI', name: 'Dow Jones', value: 43892.15, change: -64.27, changePercent: -0.15, sparkline: [44050, 44020, 43980, 43950, 43920, 43900, 43892], category: 'equity' },
  { symbol: 'BTC', name: 'Bitcoin', value: 97243.18, change: 2145.67, changePercent: 2.26, sparkline: [94800, 95200, 95600, 96000, 96500, 96900, 97243], category: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', value: 3421.88, change: -52.34, changePercent: -1.51, sparkline: [3520, 3500, 3480, 3460, 3440, 3430, 3421], category: 'crypto' },
  { symbol: 'USDINR', name: 'USD/INR', value: 86.4125, change: 0.0825, changePercent: 0.10, sparkline: [86.20, 86.28, 86.32, 86.36, 86.38, 86.40, 86.41], category: 'forex' },
];
