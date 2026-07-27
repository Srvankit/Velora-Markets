import type { MarketNewsItem } from '@/types';

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  category: 'equity' | 'crypto' | 'forex';
}

export const mockMarketIndices: MarketIndex[] = [
  { symbol: 'NIFTY50', name: 'NIFTY 50', value: 24867.55, change: 142.35, changePercent: 0.58, sparkline: [24600, 24680, 24720, 24750, 24800, 24830, 24867], category: 'equity' },
  { symbol: 'SENSEX', name: 'SENSEX', value: 81455.32, change: 318.22, changePercent: 0.39, sparkline: [80900, 81050, 81180, 81280, 81380, 81420, 81455], category: 'equity' },
  { symbol: 'NASDAQ', name: 'NASDAQ', value: 18342.94, change: -89.45, changePercent: -0.49, sparkline: [18500, 18460, 18420, 18390, 18370, 18350, 18342], category: 'equity' },
  { symbol: 'SPX', name: 'S&P 500', value: 5937.75, change: 18.92, changePercent: 0.32, sparkline: [5880, 5900, 5910, 5920, 5925, 5932, 5937], category: 'equity' },
  { symbol: 'DJI', name: 'Dow Jones', value: 43892.15, change: -64.27, changePercent: -0.15, sparkline: [44050, 44020, 43980, 43950, 43920, 43900, 43892], category: 'equity' },
  { symbol: 'BTC', name: 'Bitcoin', value: 97243.18, change: 2145.67, changePercent: 2.26, sparkline: [94800, 95200, 95600, 96000, 96500, 96900, 97243], category: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', value: 3421.88, change: -52.34, changePercent: -1.51, sparkline: [3520, 3500, 3480, 3460, 3440, 3430, 3421], category: 'crypto' },
  { symbol: 'USDINR', name: 'USD/INR', value: 86.4125, change: 0.0825, changePercent: 0.10, sparkline: [86.20, 86.28, 86.32, 86.36, 86.38, 86.40, 86.41], category: 'forex' },
];

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  favorite: boolean;
  logoColor: string;
}

export const mockWatchlistPreview: WatchlistItem[] = [
  { symbol: 'AAPL', name: 'Apple', price: 232.41, change: 3.18, changePercent: 1.39, sparkline: [225, 227, 229, 230, 231, 232, 232.41], favorite: true, logoColor: '#A8A8A8' },
  { symbol: 'MSFT', name: 'Microsoft', price: 421.27, change: 2.94, changePercent: 0.70, sparkline: [415, 417, 418, 419, 420, 421, 421.27], favorite: true, logoColor: '#00A4EF' },
  { symbol: 'TSLA', name: 'Tesla', price: 251.44, change: -3.66, changePercent: -1.43, sparkline: [258, 256, 254, 253, 252, 251, 251.44], favorite: false, logoColor: '#E82127' },
  { symbol: 'RELIANCE', name: 'Reliance', price: 1284.50, change: 18.75, changePercent: 1.48, sparkline: [1260, 1268, 1272, 1276, 1280, 1282, 1284.50], favorite: true, logoColor: '#0066B3' },
  { symbol: 'TCS', name: 'TCS', price: 4125.30, change: -32.40, changePercent: -0.78, sparkline: [4180, 4165, 4150, 4140, 4132, 4128, 4125.30], favorite: false, logoColor: '#1A1A1A' },
  { symbol: 'INFY', name: 'Infosys', price: 1864.20, change: 12.85, changePercent: 0.69, sparkline: [1840, 1848, 1852, 1858, 1860, 1862, 1864.20], favorite: true, logoColor: '#007CC3' },
];

export interface PortfolioStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend: { value: string; positive: boolean };
  sparkline: number[];
  icon: string;
  accent: 'primary' | 'success' | 'warning' | 'danger';
}

export const mockPortfolioStats: PortfolioStat[] = [
  { label: 'Portfolio Value', value: 19402.32, prefix: '$', decimals: 2, trend: { value: '+$53.36 today', positive: true }, sparkline: [18200, 18500, 18800, 19000, 19200, 19350, 19402], icon: 'Wallet', accent: 'primary' },
  { label: "Today's P&L", value: 53.36, prefix: '$', decimals: 2, trend: { value: '+0.28%', positive: true }, sparkline: [19280, 19310, 19350, 19380, 19390, 19400, 19402], icon: 'TrendingUp', accent: 'success' },
  { label: 'Buying Power', value: 8420.50, prefix: '$', decimals: 2, trend: { value: 'Available to trade', positive: true }, sparkline: [8000, 8100, 8200, 8300, 8350, 8400, 8420], icon: 'Zap', accent: 'warning' },
  { label: 'Total Investments', value: 16891.60, prefix: '$', decimals: 2, trend: { value: '+$2,510.72 all-time', positive: true }, sparkline: [14000, 15000, 15500, 16000, 16400, 16700, 16891], icon: 'Briefcase', accent: 'primary' },
];

export const mockPortfolioGrowth = [
  { month: 'Jan', value: 14200 },
  { month: 'Feb', value: 14850 },
  { month: 'Mar', value: 15100 },
  { month: 'Apr', value: 14600 },
  { month: 'May', value: 15800 },
  { month: 'Jun', value: 16500 },
  { month: 'Jul', value: 17200 },
  { month: 'Aug', value: 18100 },
  { month: 'Sep', value: 17600 },
  { month: 'Oct', value: 18900 },
  { month: 'Nov', value: 19200 },
  { month: 'Dec', value: 19402 },
];

export const mockAssetAllocation = [
  { name: 'Technology', value: 58, color: 'hsl(var(--chart-1))' },
  { name: 'Healthcare', value: 12, color: 'hsl(var(--chart-2))' },
  { name: 'Financials', value: 18, color: 'hsl(var(--chart-3))' },
  { name: 'Consumer', value: 8, color: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 4, color: 'hsl(var(--chart-5))' },
];

export const mockDailyPerformance = [
  { day: 'Mon', value: 142 },
  { day: 'Tue', value: -85 },
  { day: 'Wed', value: 218 },
  { day: 'Thu', value: -64 },
  { day: 'Fri', value: 312 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 0 },
];

export interface AIInsight {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'positive';
  icon: string;
}

export const mockAIInsights: AIInsight[] = [
  { title: 'Technology concentration', description: 'Technology sector represents 58% of your portfolio. Consider diversifying to reduce sector risk.', type: 'warning', icon: 'Cpu' },
  { title: 'Healthcare underweight', description: 'Healthcare allocation is 12%, below the recommended 15-20% for a balanced growth portfolio.', type: 'info', icon: 'Activity' },
  { title: 'Risk assessment', description: 'Overall portfolio risk is Moderate. Expected monthly volatility is Low based on your holdings.', type: 'positive', icon: 'ShieldCheck' },
  { title: 'Rebalance suggestion', description: 'Your top 2 holdings account for 57% of value. Rebalancing could improve risk-adjusted returns.', type: 'info', icon: 'Scale' },
];

export interface DashboardTransaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'dividend';
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export const mockRecentTransactions: DashboardTransaction[] = [
  { id: 'dt1', type: 'buy', symbol: 'AAPL', name: 'Apple Inc.', quantity: 5, price: 232.41, date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: 'completed' },
  { id: 'dt2', type: 'sell', symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 10, price: 138.60, date: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), status: 'completed' },
  { id: 'dt3', type: 'deposit', symbol: '', name: 'Bank Transfer', quantity: 0, price: 5000, date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), status: 'completed' },
  { id: 'dt4', type: 'dividend', symbol: 'JNJ', name: 'Johnson & Johnson', quantity: 0, price: 12.40, date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), status: 'completed' },
  { id: 'dt5', type: 'buy', symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 3, price: 421.27, date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), status: 'completed' },
  { id: 'dt6', type: 'sell', symbol: 'TSLA', name: 'Tesla Inc.', quantity: 8, price: 251.44, date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), status: 'pending' },
];

export const mockDashboardNews: MarketNewsItem[] = [
  { id: 'dn1', headline: 'Fed signals patience on rate cuts as inflation cools to 2.4%', summary: 'Federal Reserve officials indicated they are in no rush to lower interest rates, awaiting more data on inflation and labor markets before committing to a timeline.', source: 'Reuters', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), symbols: ['SPX'], sentiment: 'neutral' },
  { id: 'dn2', headline: 'Apple unveils next-generation AI features at developer event', summary: 'Apple introduced a suite of on-device AI capabilities, sending shares higher in early trading.', source: 'Bloomberg', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), symbols: ['AAPL'], sentiment: 'positive' },
  { id: 'dn3', headline: 'NVIDIA faces scrutiny over chip export controls', summary: 'Regulators are reviewing shipments of high-performance chips, which could impact near-term revenue guidance.', source: 'CNBC', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), symbols: ['NVDA'], sentiment: 'negative' },
  { id: 'dn4', headline: 'Tesla deliveries beat expectations for the quarter', summary: 'Tesla reported stronger-than-expected vehicle deliveries, boosting investor sentiment ahead of earnings.', source: 'MarketWatch', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), symbols: ['TSLA'], sentiment: 'positive' },
];

export interface MarketSentiment {
  bullish: number;
  neutral: number;
  bearish: number;
}

export const mockMarketSentiment: MarketSentiment = {
  bullish: 62,
  neutral: 24,
  bearish: 14,
};

export interface UpcomingEvent {
  id: string;
  type: 'ipo' | 'dividend' | 'earnings' | 'economic';
  title: string;
  description: string;
  date: string;
  symbol?: string;
}

export const mockUpcomingEvents: UpcomingEvent[] = [
  { id: 'e1', type: 'earnings', title: 'Apple Q4 Earnings', description: 'Expected EPS $1.60, revenue $94.2B', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), symbol: 'AAPL' },
  { id: 'e2', type: 'dividend', title: 'JNJ Dividend Payment', description: 'Quarterly dividend of $1.24/share', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), symbol: 'JNJ' },
  { id: 'e3', type: 'ipo', title: 'Aurora Tech IPO', description: 'Price range $28-$32, 18M shares offered', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString() },
  { id: 'e4', type: 'economic', title: 'FOMC Rate Decision', description: 'Federal funds rate announcement', date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() },
];
