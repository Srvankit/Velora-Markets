import type {
  Stock,
  MarketNewsItem,
  NotificationItem,
  PortfolioHolding,
  PortfolioSummary,
  WalletTransaction,
  Watchlist,
} from '@/types';

export const mockStocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', price: 232.41, change: 3.18, changePercent: 1.39, volume: 48_120_000, marketCap: 3_510_000_000_000, trend: 'up', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ', price: 421.27, change: 2.94, changePercent: 0.7, volume: 12_840_000, marketCap: 3_130_000_000_000, trend: 'up', sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', price: 138.6, change: -1.42, changePercent: -1.01, volume: 210_330_000, marketCap: 3_400_000_000_000, trend: 'down', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', price: 179.18, change: 1.12, changePercent: 0.63, volume: 18_240_000, marketCap: 2_190_000_000_000, trend: 'up', sector: 'Communication' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', price: 201.88, change: -0.84, changePercent: -0.41, volume: 24_910_000, marketCap: 2_120_000_000_000, trend: 'down', sector: 'Consumer' },
  { symbol: 'META', name: 'Meta Platforms', exchange: 'NASDAQ', price: 595.94, change: 4.21, changePercent: 0.71, volume: 9_820_000, marketCap: 1_520_000_000_000, trend: 'up', sector: 'Communication' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', price: 251.44, change: -3.66, changePercent: -1.43, volume: 89_410_000, marketCap: 802_000_000_000, trend: 'down', sector: 'Consumer' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', exchange: 'NYSE', price: 463.07, change: 1.84, changePercent: 0.4, volume: 2_910_000, marketCap: 1_000_000_000_000, trend: 'up', sector: 'Financials' },
  { symbol: 'JPM', name: 'JPMorgan Chase', exchange: 'NYSE', price: 241.82, change: 0.92, changePercent: 0.38, volume: 6_120_000, marketCap: 689_000_000_000, trend: 'up', sector: 'Financials' },
  { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE', price: 286.31, change: -0.51, changePercent: -0.18, volume: 5_410_000, marketCap: 563_000_000_000, trend: 'down', sector: 'Financials' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', price: 155.87, change: 0.34, changePercent: 0.22, volume: 4_820_000, marketCap: 375_000_000_000, trend: 'up', sector: 'Healthcare' },
  { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', price: 85.42, change: 0.78, changePercent: 0.92, volume: 14_210_000, marketCap: 688_000_000_000, trend: 'up', sector: 'Consumer' },
];

export const mockNews: MarketNewsItem[] = [
  { id: 'n1', headline: 'Fed signals patience on rate cuts as inflation cools', summary: 'Federal Reserve officials indicated they are in no rush to lower interest rates, awaiting more data on inflation and labor markets.', source: 'Reuters', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), symbols: ['SPX'], sentiment: 'neutral' },
  { id: 'n2', headline: 'Apple unveils next-generation AI features at developer event', summary: 'Apple introduced a suite of on-device AI capabilities, sending shares higher in early trading.', source: 'Bloomberg', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), symbols: ['AAPL'], sentiment: 'positive' },
  { id: 'n3', headline: 'NVIDIA faces scrutiny over export controls', summary: 'Regulators are reviewing shipments of high-performance chips, which could impact near-term revenue.', source: 'CNBC', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), symbols: ['NVDA'], sentiment: 'negative' },
  { id: 'n4', headline: 'Tesla deliveries beat expectations for the quarter', summary: 'Tesla reported stronger-than-expected vehicle deliveries, boosting investor sentiment.', source: 'MarketWatch', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), symbols: ['TSLA'], sentiment: 'positive' },
  { id: 'n5', headline: 'Microsoft cloud revenue accelerates on AI demand', summary: 'Azure growth reaccelerated as enterprise customers ramp up AI workloads.', source: 'WSJ', url: '#', publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), symbols: ['MSFT'], sentiment: 'positive' },
];

export const mockNotifications: NotificationItem[] = [
  { id: 'nt1', type: 'price_alert', title: 'AAPL price alert', message: 'Apple Inc. crossed above $230.00', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), link: '/stock/AAPL' },
  { id: 'nt2', type: 'order', title: 'Order filled', message: 'Your buy order for 5 MSFT shares was filled at $421.27', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), link: '/transactions' },
  { id: 'nt3', type: 'news', title: 'Breaking news', message: 'NVIDIA faces scrutiny over export controls', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), link: '/market' },
  { id: 'nt4', type: 'dividend', title: 'Dividend received', message: 'You received $12.40 in dividends from JNJ', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), link: '/wallet' },
  { id: 'nt5', type: 'system', title: 'Welcome to Velora', message: 'Your account is ready. Start exploring the markets.', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

export const mockHoldings: PortfolioHolding[] = [
  { id: 'h1', symbol: 'AAPL', name: 'Apple Inc.', shares: 24, avgCost: 198.5, currentPrice: 232.41, marketValue: 5577.84, totalCost: 4764, unrealizedPL: 813.84, unrealizedPLPercent: 17.08, dayChange: 76.32, dayChangePercent: 1.39 },
  { id: 'h2', symbol: 'MSFT', name: 'Microsoft Corp.', shares: 12, avgCost: 388.2, currentPrice: 421.27, marketValue: 5055.24, totalCost: 4658.4, unrealizedPL: 396.84, unrealizedPLPercent: 8.52, dayChange: 35.28, dayChangePercent: 0.7 },
  { id: 'h3', symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 40, avgCost: 112.3, currentPrice: 138.6, marketValue: 5544, totalCost: 4492, unrealizedPL: 1052, unrealizedPLPercent: 23.42, dayChange: -78.4, dayChangePercent: -1.01 },
  { id: 'h4', symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 18, avgCost: 165.4, currentPrice: 179.18, marketValue: 3225.24, totalCost: 2977.2, unrealizedPL: 248.04, unrealizedPLPercent: 8.33, dayChange: 20.16, dayChangePercent: 0.63 },
];

export const mockPortfolioSummary: PortfolioSummary = {
  totalValue: 19402.32,
  totalCost: 16891.6,
  totalPL: 2510.72,
  totalPLPercent: 14.86,
  dayChange: 53.36,
  dayChangePercent: 0.28,
  allocation: [
    { symbol: 'AAPL', name: 'Apple Inc.', value: 5577.84, percent: 28.7 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', value: 5544, percent: 28.6 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', value: 5055.24, percent: 26.1 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 3225.24, percent: 16.6 },
  ],
};

export const mockWalletTransactions: WalletTransaction[] = [
  { id: 't1', type: 'deposit', amount: 5000, status: 'completed', description: 'Bank transfer', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), balanceAfter: 5000 },
  { id: 't2', type: 'buy', amount: -4764, status: 'completed', description: 'Buy 24 AAPL @ $198.50', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(), balanceAfter: 236 },
  { id: 't3', type: 'deposit', amount: 10000, status: 'completed', description: 'Bank transfer', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), balanceAfter: 10236 },
  { id: 't4', type: 'buy', amount: -4658.4, status: 'completed', description: 'Buy 12 MSFT @ $388.20', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), balanceAfter: 5577.6 },
  { id: 't5', type: 'dividend', amount: 12.4, status: 'completed', description: 'JNJ dividend', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), balanceAfter: 5590 },
];

export const mockWatchlists: Watchlist[] = [
  { id: 'w1', name: 'Tech Leaders', symbols: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META'], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
  { id: 'w2', name: 'Dividend Stocks', symbols: ['JNJ', 'JPM', 'V', 'WMT'], createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() },
];

export const mockTestimonials = [
  { id: 'tm1', name: 'Sarah Chen', role: 'Software Engineer', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200', content: 'Velora Markets completely changed how I invest. The portfolio analytics are unmatched, and I finally feel in control of my financial future.', rating: 5 },
  { id: 'tm2', name: 'Marcus Johnson', role: 'Marketing Director', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200', content: 'The cleanest trading interface I have used. Real-time data, instant execution, and the watchlists keep me focused on what matters.', rating: 5 },
  { id: 'tm3', name: 'Priya Patel', role: 'Data Analyst', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200', content: 'I love how Velora surfaces insights I would never find on my own. The P&L tracking is precise and the charts are beautiful.', rating: 5 },
  { id: 'tm4', name: 'David Kim', role: 'Entrepreneur', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=200', content: 'From deposits to trades, everything just works. Velora is the first platform that makes investing feel effortless and premium.', rating: 5 },
];

export const mockPricingPlans = [
  {
    id: 'p1',
    name: 'Starter',
    price: 0,
    period: 'forever',
    description: 'Everything you need to start investing with confidence.',
    features: ['Commission-free stocks', 'Real-time market data', 'Up to 3 watchlists', 'Basic portfolio analytics', 'Email support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    id: 'p2',
    name: 'Pro',
    price: 19,
    period: 'month',
    description: 'Advanced tools for serious investors who want an edge.',
    features: ['Everything in Starter', 'Unlimited watchlists', 'Advanced charting & indicators', 'Price alerts & notifications', 'Priority support', 'Tax-loss harvesting reports'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    id: 'p3',
    name: 'Premium',
    price: 49,
    period: 'month',
    description: 'Institutional-grade tools for power users and professionals.',
    features: ['Everything in Pro', 'API access', 'Level 2 market data', 'Custom screeners', 'Dedicated account manager', 'Early access to new features'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const mockFaqs = [
  { id: 'f1', question: 'Is Velora Markets safe to use?', answer: 'Yes. We use bank-level encryption, two-factor authentication, and biometric login options to keep your account and data secure at all times.' },
  { id: 'f2', question: 'Are there any hidden fees?', answer: 'No hidden fees. Stock trading is commission-free on the Starter plan, and Pro and Premium pricing is fully transparent with no surprise charges.' },
  { id: 'f3', question: 'How fast are deposits and withdrawals?', answer: 'Bank transfers typically settle within one business day. Instant deposits are available for eligible accounts so you can trade without waiting.' },
  { id: 'f4', question: 'Can I try Velora Pro for free?', answer: 'Yes. Every new account gets a 30-day free trial of Velora Pro with full access to advanced charting, alerts, and analytics — no credit card required.' },
  { id: 'f5', question: 'What markets are supported?', answer: 'Velora currently supports US equities across NYSE and NASDAQ. We are expanding to international markets and ETFs in the coming months.' },
  { id: 'f6', question: 'Do you offer customer support?', answer: 'Starter accounts get email support, Pro accounts get priority support, and Premium accounts have a dedicated account manager available around the clock.' },
];

export const mockStats = [
  { id: 's1', label: 'Assets traded', value: 250, suffix: 'K+', description: 'Stocks, ETFs, and more' },
  { id: 's2', label: 'Active investors', value: 1.2, suffix: 'M+', description: 'Growing every day' },
  { id: 's3', label: 'Avg. execution time', value: 42, suffix: 'ms', description: 'Lightning-fast trades' },
  { id: 's4', label: 'Uptime', value: 99.99, suffix: '%', description: 'Reliable when it counts' },
];
