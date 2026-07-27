export interface MarketNewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  category: 'Markets' | 'Earnings' | 'Crypto' | 'Economy' | 'IPO';
  publishedAt: string;
  readTime: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  url: string;
}

export const marketNews: MarketNewsItem[] = [
  { id: 'mn1', headline: 'Fed signals patience on rate cuts as inflation cools to 2.4%', summary: 'Federal Reserve officials indicated they are in no rush to lower interest rates, awaiting more data on inflation and labor markets before committing to a timeline.', source: 'Reuters', category: 'Economy', publishedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), readTime: 4, sentiment: 'neutral', url: '#' },
  { id: 'mn2', headline: 'Apple unveils next-generation AI features at developer event', summary: 'Apple introduced a suite of on-device AI capabilities, sending shares higher in early trading.', source: 'Bloomberg', category: 'Markets', publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), readTime: 3, sentiment: 'positive', url: '#' },
  { id: 'mn3', headline: 'NVIDIA faces scrutiny over chip export controls', summary: 'Regulators are reviewing shipments of high-performance chips, which could impact near-term revenue guidance.', source: 'CNBC', category: 'Markets', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), readTime: 5, sentiment: 'negative', url: '#' },
  { id: 'mn4', headline: 'Tesla deliveries beat expectations for the quarter', summary: 'Tesla reported stronger-than-expected vehicle deliveries, boosting investor sentiment ahead of earnings.', source: 'MarketWatch', category: 'Earnings', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), readTime: 3, sentiment: 'positive', url: '#' },
  { id: 'mn5', headline: 'Bitcoin crosses $97K as ETF inflows accelerate', summary: 'Spot Bitcoin ETFs recorded record weekly inflows, pushing the largest cryptocurrency past a key psychological level.', source: 'CoinDesk', category: 'Crypto', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(), readTime: 4, sentiment: 'positive', url: '#' },
  { id: 'mn6', headline: 'Aurora Tech IPO oversubscribed on first day', summary: 'The cloud infrastructure startup saw strong demand from institutional investors, pricing at the top of its range.', source: 'WSJ', category: 'IPO', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), readTime: 5, sentiment: 'positive', url: '#' },
];

export interface MarketCategory {
  id: string;
  name: string;
  description: string;
  assetCount: number;
  icon: string;
  color: string;
}

export const marketCategories: MarketCategory[] = [
  { id: 'stocks', name: 'Stocks', description: 'Trade shares of publicly listed companies', assetCount: 8500, icon: 'CandlestickChart', color: 'hsl(var(--primary))' },
  { id: 'etfs', name: 'ETFs', description: 'Diversified baskets of securities', assetCount: 3200, icon: 'Layers', color: 'hsl(var(--chart-2))' },
  { id: 'mutual-funds', name: 'Mutual Funds', description: 'Professionally managed investment pools', assetCount: 1400, icon: 'PieChart', color: 'hsl(var(--chart-3))' },
  { id: 'crypto', name: 'Crypto', description: 'Digital assets and cryptocurrencies', assetCount: 12000, icon: 'Bitcoin', color: 'hsl(var(--chart-4))' },
  { id: 'commodities', name: 'Commodities', description: 'Gold, silver, oil, and agricultural products', assetCount: 80, icon: 'Gem', color: 'hsl(var(--chart-5))' },
  { id: 'bonds', name: 'Bonds', description: 'Government and corporate fixed income', assetCount: 5600, icon: 'Landmark', color: 'hsl(var(--chart-1))' },
];

export interface Sector {
  name: string;
  changePercent: number;
  stockCount: number;
}

export const popularSectors: Sector[] = [
  { name: 'Technology', changePercent: 1.42, stockCount: 4120 },
  { name: 'Healthcare', changePercent: 0.38, stockCount: 3280 },
  { name: 'Finance', changePercent: 0.72, stockCount: 5140 },
  { name: 'Energy', changePercent: 1.18, stockCount: 1860 },
  { name: 'Automobile', changePercent: -0.42, stockCount: 920 },
  { name: 'Retail', changePercent: 0.92, stockCount: 1640 },
];
