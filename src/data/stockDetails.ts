export interface StockKeyMetrics {
  symbol: string;
  marketCap: number;
  enterpriseValue: number;
  sharesOutstanding: number;
  dividendYield: number;
  peRatio: number;
  pegRatio: number;
  priceToBook: number;
  evEbitda: number;
  eps: number;
  beta: number;
  bookValue: number;
  revenue: number;
  netProfit: number;
  roe: number;
  roce: number;
  debtToEquity: number;
}

export const keyMetrics: Record<string, StockKeyMetrics> = {
  AAPL: { symbol: 'AAPL', marketCap: 3_510_000_000_000, enterpriseValue: 3_580_000_000_000, sharesOutstanding: 15_100_000_000, dividendYield: 0.43, peRatio: 35.2, pegRatio: 2.8, priceToBook: 58.4, evEbitda: 26.1, eps: 6.60, beta: 1.24, bookValue: 3.98, revenue: 391_035_000_000, netProfit: 96_995_000_000, roe: 156.6, roce: 182.3, debtToEquity: 1.51 },
  MSFT: { symbol: 'MSFT', marketCap: 3_130_000_000_000, enterpriseValue: 3_210_000_000_000, sharesOutstanding: 7_430_000_000, dividendYield: 0.72, peRatio: 36.8, pegRatio: 1.9, priceToBook: 12.1, evEbitda: 24.8, eps: 11.44, beta: 0.92, bookValue: 34.82, revenue: 245_122_000_000, netProfit: 89_281_000_000, roe: 38.7, roce: 42.1, debtToEquity: 0.28 },
  NVDA: { symbol: 'NVDA', marketCap: 3_400_000_000_000, enterpriseValue: 3_450_000_000_000, sharesOutstanding: 24_500_000_000, dividendYield: 0.03, peRatio: 67.5, pegRatio: 0.8, priceToBook: 52.3, evEbitda: 45.2, eps: 2.05, beta: 1.68, bookValue: 2.65, revenue: 130_497_000_000, netProfit: 72_129_000_000, roe: 91.2, roce: 88.4, debtToEquity: 0.18 },
  TSLA: { symbol: 'TSLA', marketCap: 802_000_000_000, enterpriseValue: 835_000_000_000, sharesOutstanding: 3_190_000_000, dividendYield: 0, peRatio: 92.1, pegRatio: 4.2, priceToBook: 11.8, evEbitda: 48.5, eps: 2.73, beta: 2.34, bookValue: 21.32, revenue: 97_690_000_000, netProfit: 7_426_000_000, roe: 12.8, roce: 14.2, debtToEquity: 0.18 },
  RELIANCE: { symbol: 'RELIANCE', marketCap: 17_400_000_000_000, enterpriseValue: 18_200_000_000_000, sharesOutstanding: 6_760_000_000, dividendYield: 0.32, peRatio: 24.2, pegRatio: 1.4, priceToBook: 2.1, evEbitda: 13.8, eps: 53.10, beta: 1.15, bookValue: 611.66, revenue: 1_043_600_000_000, netProfit: 87_600_000_000, roe: 8.7, roce: 10.2, debtToEquity: 0.52 },
  TCS: { symbol: 'TCS', marketCap: 14_900_000_000_000, enterpriseValue: 15_100_000_000_000, sharesOutstanding: 3_620_000_000, dividendYield: 1.82, peRatio: 28.5, pegRatio: 2.1, priceToBook: 14.2, evEbitda: 19.4, eps: 144.75, beta: 0.88, bookValue: 290.51, revenue: 263_600_000_000, netProfit: 53_240_000_000, roe: 49.8, roce: 52.3, debtToEquity: 0.09 },
};

const defaultMetrics: StockKeyMetrics = {
  symbol: '',
  marketCap: 0,
  enterpriseValue: 0,
  sharesOutstanding: 0,
  dividendYield: 0,
  peRatio: 0,
  pegRatio: 0,
  priceToBook: 0,
  evEbitda: 0,
  eps: 0,
  beta: 1.0,
  bookValue: 0,
  revenue: 0,
  netProfit: 0,
  roe: 0,
  roce: 0,
  debtToEquity: 0,
};

export function getKeyMetrics(symbol: string): StockKeyMetrics {
  return keyMetrics[symbol] ?? { ...defaultMetrics, symbol };
}

export interface StockNewsItem {
  id: string;
  symbol: string;
  headline: string;
  summary: string;
  source: string;
  category: 'Markets' | 'Earnings' | 'Crypto' | 'Economy' | 'IPO' | 'Company';
  publishedAt: string;
  readTime: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  url: string;
}

export const stockNews: StockNewsItem[] = [
  { id: 'sn1', symbol: 'AAPL', headline: 'Apple unveils next-generation AI features at developer event', summary: 'Apple introduced a suite of on-device AI capabilities, sending shares higher in early trading.', source: 'Bloomberg', category: 'Company', publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), readTime: 3, sentiment: 'positive', url: '#' },
  { id: 'sn2', symbol: 'AAPL', headline: 'Apple Services revenue hits all-time high on App Store growth', summary: 'The Services segment reached $25B in quarterly revenue, driven by App Store, iCloud, and Apple Music.', source: 'Reuters', category: 'Earnings', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), readTime: 4, sentiment: 'positive', url: '#' },
  { id: 'sn3', symbol: 'AAPL', headline: 'Analysts raise price targets ahead of iPhone 16 launch', summary: 'Multiple Wall Street firms increased their Apple price targets citing strong pre-order demand signals.', source: 'CNBC', category: 'Markets', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), readTime: 3, sentiment: 'positive', url: '#' },
  { id: 'sn4', symbol: 'AAPL', headline: 'Apple faces antitrust scrutiny in EU over App Store practices', summary: 'European regulators opened a new investigation into App Store fees and developer restrictions.', source: 'WSJ', category: 'Economy', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), readTime: 5, sentiment: 'negative', url: '#' },
  { id: 'sn5', symbol: 'MSFT', headline: 'Microsoft cloud revenue accelerates on AI demand', summary: 'Azure growth reaccelerated as enterprise customers ramp up AI workloads.', source: 'WSJ', category: 'Earnings', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), readTime: 4, sentiment: 'positive', url: '#' },
  { id: 'sn6', symbol: 'NVDA', headline: 'NVIDIA faces scrutiny over chip export controls', summary: 'Regulators are reviewing shipments of high-performance chips, which could impact near-term revenue.', source: 'CNBC', category: 'Markets', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), readTime: 5, sentiment: 'negative', url: '#' },
  { id: 'sn7', symbol: 'TSLA', headline: 'Tesla deliveries beat expectations for the quarter', summary: 'Tesla reported stronger-than-expected vehicle deliveries, boosting investor sentiment.', source: 'MarketWatch', category: 'Earnings', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), readTime: 3, sentiment: 'positive', url: '#' },
  { id: 'sn8', symbol: 'GOOGL', headline: 'Alphabet expands Gemini AI across Workspace suite', summary: 'Google integrated Gemini into Docs, Sheets, and Slides, expanding its AI monetization strategy.', source: 'TechCrunch', category: 'Company', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), readTime: 4, sentiment: 'positive', url: '#' },
];

export function getStockNews(symbol: string): StockNewsItem[] {
  const symbolNews = stockNews.filter((n) => n.symbol === symbol);
  return symbolNews.length > 0 ? symbolNews : stockNews.slice(0, 4);
}

export interface AIInsight {
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning';
  icon: string;
}

export function getAIInsights(symbol: string, currentPrice: number, averageTarget: number): AIInsight[] {
  const upside = ((averageTarget - currentPrice) / currentPrice) * 100;
  return [
    {
      title: 'Analyst target gap',
      description: `Stock is trading ${Math.abs(upside).toFixed(1)}% ${upside >= 0 ? 'below' : 'above'} the analyst average target of $${averageTarget.toFixed(2)}.`,
      type: upside >= 5 ? 'positive' : upside <= -5 ? 'warning' : 'neutral',
      icon: 'Target',
    },
    {
      title: 'Revenue momentum',
      description: 'Revenue growth has remained positive for five consecutive quarters, indicating consistent business expansion.',
      type: 'positive',
      icon: 'TrendingUp',
    },
    {
      title: 'Volatility assessment',
      description: 'Volatility is moderate based on the 30-day average true range. Short-term price swings are within expected bounds.',
      type: 'neutral',
      icon: 'Activity',
    },
    {
      title: 'Long-term outlook',
      description: 'Long-term outlook appears positive with strong fundamentals, improving margins, and favorable industry tailwinds.',
      type: 'positive',
      icon: 'Sparkles',
    },
  ];
}
