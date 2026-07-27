export interface PortfolioSummary {
  totalValue: number;
  todayGain: number;
  todayGainPercent: number;
  overallReturn: number;
  overallReturnPercent: number;
  investedAmount: number;
  currentValue: number;
  availableCash: number;
  buyingPower: number;
  netWorth: number;
  sparkline: number[];
}

export const portfolioSummary: PortfolioSummary = {
  totalValue: 27822.82,
  todayGain: 53.36,
  todayGainPercent: 0.19,
  overallReturn: 2510.72,
  overallReturnPercent: 9.92,
  investedAmount: 16891.60,
  currentValue: 19402.32,
  availableCash: 8420.50,
  buyingPower: 16841.00,
  netWorth: 27822.82,
  sparkline: [22500, 23100, 23800, 24200, 25100, 26200, 27000, 27822],
};

export interface AssetAllocation {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export const assetAllocation: AssetAllocation[] = [
  { name: 'Stocks', value: 19402.32, percentage: 69.7, color: 'hsl(var(--chart-1))' },
  { name: 'ETFs', value: 3200.00, percentage: 11.5, color: 'hsl(var(--chart-2))' },
  { name: 'Mutual Funds', value: 2400.00, percentage: 8.6, color: 'hsl(var(--chart-3))' },
  { name: 'Crypto', value: 1800.00, percentage: 6.5, color: 'hsl(var(--chart-4))' },
  { name: 'Cash', value: 842.50, percentage: 3.0, color: 'hsl(var(--chart-5))' },
  { name: 'Bonds', value: 178.00, percentage: 0.7, color: 'hsl(var(--primary))' },
];

export interface SectorAllocation {
  name: string;
  value: number;
  percentage: number;
  changePercent: number;
  color: string;
}

export const sectorAllocation: SectorAllocation[] = [
  { name: 'Technology', value: 19402.32, percentage: 69.7, changePercent: 1.42, color: 'hsl(var(--chart-1))' },
  { name: 'Healthcare', value: 2400.00, percentage: 8.6, changePercent: 0.38, color: 'hsl(var(--chart-2))' },
  { name: 'Finance', value: 1800.00, percentage: 6.5, changePercent: 0.72, color: 'hsl(var(--chart-3))' },
  { name: 'Energy', value: 1200.00, percentage: 4.3, changePercent: 1.18, color: 'hsl(var(--chart-4))' },
  { name: 'Consumer', value: 1000.00, percentage: 3.6, changePercent: 0.92, color: 'hsl(var(--chart-5))' },
  { name: 'Automobile', value: 800.00, percentage: 2.9, changePercent: -0.42, color: 'hsl(var(--primary))' },
  { name: 'Industrial', value: 1220.50, percentage: 4.4, changePercent: 0.54, color: 'hsl(var(--chart-2))' },
];

export interface PerformerStock {
  symbol: string;
  name: string;
  logoColor: string;
  returnPercent: number;
  investment: number;
  currentValue: number;
  profit: number;
  sparkline: number[];
}

export const topPerformers: PerformerStock[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', logoColor: '#76B900', returnPercent: 23.42, investment: 4492.00, currentValue: 5544.00, profit: 1052.00, sparkline: [112, 118, 124, 130, 134, 136, 138.6] },
  { symbol: 'AAPL', name: 'Apple Inc.', logoColor: '#A8A8A8', returnPercent: 17.08, investment: 4764.00, currentValue: 5577.84, profit: 813.84, sparkline: [198, 205, 212, 218, 225, 230, 232.41] },
  { symbol: 'MSFT', name: 'Microsoft Corp.', logoColor: '#00A4EF', returnPercent: 8.52, investment: 4658.40, currentValue: 5055.24, profit: 396.84, sparkline: [388, 395, 402, 410, 415, 418, 421.27] },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', logoColor: '#4285F4', returnPercent: 8.33, investment: 2977.20, currentValue: 3225.24, profit: 248.04, sparkline: [165, 168, 172, 175, 177, 178, 179.18] },
];

export const worstPerformers: PerformerStock[] = [
  { symbol: 'TATAMOTORS', name: 'Tata Motors', logoColor: '#1A1A1A', returnPercent: -4.82, investment: 7200.00, currentValue: 6853.20, profit: -346.80, sparkline: [730, 725, 720, 718, 715, 714, 712.40] },
  { symbol: 'TSLA', name: 'Tesla Inc.', logoColor: '#E82127', returnPercent: -3.21, investment: 5200.00, currentValue: 5033.20, profit: -166.80, sparkline: [260, 258, 256, 254, 253, 252, 251.44] },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', logoColor: '#FF9900', returnPercent: -1.12, investment: 4100.00, currentValue: 4054.16, profit: -45.84, sparkline: [204, 203, 203, 202, 202, 202, 201.88] },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', logoColor: '#004C8F', returnPercent: -0.48, investment: 16900.00, currentValue: 16819.80, profit: -80.20, sparkline: [1690, 1688, 1687, 1686, 1686, 1685, 1685.40] },
];

export interface RiskMetrics {
  riskScore: number;
  diversificationScore: number;
  volatility: number;
  beta: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export const riskMetrics: RiskMetrics = {
  riskScore: 6.2,
  diversificationScore: 4.8,
  volatility: 18.4,
  beta: 1.12,
  sharpeRatio: 1.42,
  maxDrawdown: -12.4,
};

export interface PortfolioActivity {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'dividend';
  symbol?: string;
  name: string;
  amount: number;
  date: string;
}

export const recentActivity: PortfolioActivity[] = [
  { id: 'a1', type: 'buy', symbol: 'AAPL', name: 'Buy 24 AAPL @ $198.50', amount: -4764.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString() },
  { id: 'a2', type: 'deposit', name: 'Bank Transfer', amount: 10000.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'a3', type: 'buy', symbol: 'MSFT', name: 'Buy 12 MSFT @ $388.20', amount: -4658.40, date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  { id: 'a4', type: 'dividend', symbol: 'JNJ', name: 'JNJ Dividend', amount: 12.40, date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: 'a5', type: 'sell', symbol: 'NVDA', name: 'Sell 20 NVDA @ $138.60', amount: 2772.00, date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
  { id: 'a6', type: 'deposit', name: 'Bank Transfer', amount: 5000.00, date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
  { id: 'a7', type: 'buy', symbol: 'INFY', name: 'Buy 15 INFY @ $1864.20', amount: -27963.00, date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString() },
  { id: 'a8', type: 'withdraw', name: 'Withdrawal to Bank', amount: -2000.00, date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString() },
];

export interface TimelineEvent {
  id: string;
  type: 'investment' | 'purchase' | 'dividend' | 'deposit' | 'withdraw';
  title: string;
  description: string;
  date: string;
  amount?: number;
}

export const portfolioTimeline: TimelineEvent[] = [
  { id: 't1', type: 'investment', title: 'First Investment', description: 'Started your investment journey with AAPL', date: '2024-01-15T10:00:00Z', amount: 4764.00 },
  { id: 't2', type: 'deposit', title: 'Initial Deposit', description: 'Bank transfer to fund your account', date: '2024-01-14T09:00:00Z', amount: 5000.00 },
  { id: 't3', type: 'purchase', title: 'Large Purchase: MSFT', description: 'Bought 12 shares of Microsoft', date: '2024-03-22T14:00:00Z', amount: 4658.40 },
  { id: 't4', type: 'dividend', title: 'First Dividend: JNJ', description: 'Received quarterly dividend', date: '2024-04-10T09:00:00Z', amount: 12.40 },
  { id: 't5', type: 'purchase', title: 'Large Purchase: NVDA', description: 'Bought 40 shares of NVIDIA', date: '2024-06-05T11:00:00Z', amount: 4492.00 },
  { id: 't6', type: 'deposit', title: 'Major Deposit', description: 'Added capital for portfolio expansion', date: '2024-06-04T08:00:00Z', amount: 10000.00 },
  { id: 't7', type: 'withdraw', title: 'Partial Withdrawal', description: 'Withrew profits to bank account', date: '2024-08-01T15:00:00Z', amount: 2000.00 },
];

export interface PnLSummary {
  realizedPnL: number;
  unrealizedPnL: number;
  dailyPnL: number;
  weeklyPnL: number;
  monthlyPnL: number;
  yearlyPnL: number;
  bestDay: { date: string; amount: number };
  worstDay: { date: string; amount: number };
}

export const pnlSummary: PnLSummary = {
  realizedPnL: 396.84,
  unrealizedPnL: 2510.72,
  dailyPnL: 53.36,
  weeklyPnL: 412.18,
  monthlyPnL: 1248.92,
  yearlyPnL: 2510.72,
  bestDay: { date: '2024-11-14', amount: 482.30 },
  worstDay: { date: '2024-09-18', amount: -318.60 },
};

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning';
  confidence: number;
  icon: string;
}

export const portfolioAIInsights: AIInsight[] = [
  { id: 'ai1', title: 'Technology Exposure High', description: 'Technology sector represents 69.7% of your portfolio. Consider diversifying into other sectors to reduce concentration risk.', type: 'warning', confidence: 87, icon: 'PieChart' },
  { id: 'ai2', title: 'Healthcare Underweight', description: 'Healthcare allocation is 8.6%, below the market average of 12%. Adding healthcare stocks could improve diversification.', type: 'neutral', confidence: 74, icon: 'Activity' },
  { id: 'ai3', title: 'Volatility Moderate', description: 'Portfolio volatility is 18.4%, which is within the moderate range. Your risk is well-managed relative to the benchmark.', type: 'positive', confidence: 91, icon: 'TrendingUp' },
  { id: 'ai4', title: 'Risk Score Improved', description: 'Your portfolio risk score improved by 12% over the last quarter, indicating better risk-adjusted positioning.', type: 'positive', confidence: 83, icon: 'ShieldCheck' },
  { id: 'ai5', title: 'Long-term Outlook Positive', description: 'Based on current holdings and market conditions, the long-term outlook for your portfolio remains positive.', type: 'positive', confidence: 78, icon: 'Sparkles' },
];
