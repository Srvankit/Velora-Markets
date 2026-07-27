export interface PortfolioHealth {
  score: number;
  label: string;
  confidence: number;
  trend: number;
  breakdown: { label: string; score: number; maxScore: number }[];
}

export const portfolioHealth: PortfolioHealth = {
  score: 82,
  label: 'Very Good',
  confidence: 91,
  trend: 4,
  breakdown: [
    { label: 'Diversification', score: 7.2, maxScore: 10 },
    { label: 'Risk Management', score: 8.1, maxScore: 10 },
    { label: 'Cost Efficiency', score: 9.0, maxScore: 10 },
    { label: 'Growth Potential', score: 7.8, maxScore: 10 },
    { label: 'Stability', score: 8.5, maxScore: 10 },
  ],
};

export interface AIAnalysisPoint {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning';
  icon: string;
}

export const portfolioAnalysis: AIAnalysisPoint[] = [
  { id: 'aa1', title: 'Technology Allocation High', description: 'Technology sector represents 69.7% of your portfolio, which is above the recommended 40% threshold. Consider rebalancing to reduce concentration risk.', type: 'warning', icon: 'Cpu' },
  { id: 'aa2', title: 'Healthcare Exposure Below Target', description: 'Healthcare allocation is 8.6%, below the market average of 12%. Adding healthcare stocks could improve sector diversification.', type: 'neutral', icon: 'HeartPulse' },
  { id: 'aa3', title: 'Financial Sector Diversification Strong', description: 'Your financial sector holdings span banking, insurance, and payments, providing good intra-sector diversification.', type: 'positive', icon: 'Landmark' },
  { id: 'aa4', title: 'Long-Term Outlook Positive', description: 'Based on current holdings and market conditions, your portfolio has a positive long-term outlook with expected annualized returns of 10-12%.', type: 'positive', icon: 'TrendingUp' },
  { id: 'aa5', title: 'Expected Volatility Moderate', description: 'Portfolio volatility is 18.4%, which is within the moderate range. Your risk is well-managed relative to the benchmark index.', type: 'neutral', icon: 'Activity' },
];

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning';
  confidence: number;
  icon: string;
  category: string;
}

export const aiInsights: AIInsight[] = [
  { id: 'ai1', title: 'Technology Exposure High', description: 'Technology sector represents 69.7% of your portfolio. Consider diversifying into other sectors to reduce concentration risk.', type: 'warning', confidence: 87, icon: 'PieChart', category: 'Allocation' },
  { id: 'ai2', title: 'Healthcare Underweight', description: 'Healthcare allocation is 8.6%, below the market average of 12%. Adding healthcare stocks could improve diversification.', type: 'neutral', confidence: 74, icon: 'Activity', category: 'Allocation' },
  { id: 'ai3', title: 'Volatility Moderate', description: 'Portfolio volatility is 18.4%, within the moderate range. Your risk is well-managed relative to the benchmark.', type: 'positive', confidence: 91, icon: 'TrendingUp', category: 'Risk' },
  { id: 'ai4', title: 'Risk Score Improved', description: 'Your portfolio risk score improved by 12% over the last quarter, indicating better risk-adjusted positioning.', type: 'positive', confidence: 83, icon: 'ShieldCheck', category: 'Risk' },
  { id: 'ai5', title: 'Long-term Outlook Positive', description: 'Based on current holdings and market conditions, the long-term outlook for your portfolio remains positive.', type: 'positive', confidence: 78, icon: 'Sparkles', category: 'Outlook' },
  { id: 'ai6', title: 'Dividend Yield Below Average', description: 'Your portfolio dividend yield is 1.8%, below the S&P 500 average of 2.1%. Consider adding dividend-focused positions.', type: 'neutral', confidence: 69, icon: 'DollarSign', category: 'Income' },
];

export interface InsightTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning';
  icon: string;
}

export const insightTimeline: InsightTimelineEvent[] = [
  { id: 'it1', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), title: 'Risk Score Improved', description: 'Portfolio risk score improved from 5.5 to 6.2 out of 10', type: 'positive', icon: 'ShieldCheck' },
  { id: 'it2', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), title: 'New Stock Added', description: 'Added INFY position, improving technology sector diversification', type: 'neutral', icon: 'Plus' },
  { id: 'it3', date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), title: 'Diversification Alert', description: 'Technology sector concentration crossed 65% threshold', type: 'warning', icon: 'AlertTriangle' },
  { id: 'it4', date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), title: 'Dividend Received', description: 'JNJ quarterly dividend of $12.40 credited', type: 'positive', icon: 'DollarSign' },
  { id: 'it5', date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), title: 'Rebalancing Recommended', description: 'AI detected overexposure to large-cap tech stocks', type: 'warning', icon: 'Scale' },
  { id: 'it6', date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), title: 'Portfolio Milestone', description: 'Portfolio value crossed $25,000 milestone', type: 'positive', icon: 'Trophy' },
  { id: 'it7', date: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), title: 'Volatility Decreased', description: '30-day portfolio volatility dropped from 22% to 18.4%', type: 'positive', icon: 'Activity' },
];

export interface SmartAlert {
  id: string;
  title: string;
  message: string;
  type: 'positive' | 'neutral' | 'warning';
  icon: string;
  timestamp: string;
}

export const smartAlerts: SmartAlert[] = [
  { id: 'sa1', title: 'Portfolio Risk Above Target', message: 'Your portfolio risk score (6.2) exceeds your target risk level (5.0). Consider rebalancing.', type: 'warning', icon: 'AlertTriangle', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'sa2', title: 'Cash Allocation High', message: 'Cash represents 30.3% of your portfolio. Consider deploying excess cash into investments.', type: 'warning', icon: 'Wallet', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: 'sa3', title: 'Diversification Improved', message: 'Your diversification score improved by 8% this week. Keep up the good work!', type: 'positive', icon: 'Sparkles', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: 'sa4', title: 'Dividend Announced', message: 'JNJ announced a quarterly dividend of $1.24/share. Ex-date: Feb 24, 2025.', type: 'neutral', icon: 'DollarSign', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

export interface TrendingSector {
  id: string;
  name: string;
  changePercent: number;
  sentiment: 'bullish' | 'neutral' | 'bearish';
  topStock: string;
}

export const trendingSectors: TrendingSector[] = [
  { id: 'ts1', name: 'Technology', changePercent: 1.42, sentiment: 'bullish', topStock: 'NVDA' },
  { id: 'ts2', name: 'Healthcare', changePercent: 0.38, sentiment: 'neutral', topStock: 'JNJ' },
  { id: 'ts3', name: 'Finance', changePercent: 0.72, sentiment: 'bullish', topStock: 'JPM' },
  { id: 'ts4', name: 'Energy', changePercent: 1.18, sentiment: 'bullish', topStock: 'RELIANCE' },
  { id: 'ts5', name: 'Consumer', changePercent: 0.92, sentiment: 'neutral', topStock: 'AMZN' },
  { id: 'ts6', name: 'Automobile', changePercent: -0.42, sentiment: 'bearish', topStock: 'TSLA' },
];

export interface NewsSentimentItem {
  id: string;
  headline: string;
  source: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  aiSummary: string;
  confidence: number;
  publishedAt: string;
  symbols: string[];
}

export const newsSentiment: NewsSentimentItem[] = [
  { id: 'ns1', headline: 'Apple unveils next-generation AI features at developer event', source: 'Bloomberg', category: 'Technology', sentiment: 'positive', sentimentScore: 82, aiSummary: 'Apple\'s AI announcement is likely to drive short-term positive sentiment. The new features strengthen Apple\'s ecosystem moat and could accelerate hardware upgrade cycles.', confidence: 88, publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), symbols: ['AAPL'] },
  { id: 'ns2', headline: 'Fed signals patience on rate cuts as inflation cools', source: 'Reuters', category: 'Macro', sentiment: 'neutral', sentimentScore: 51, aiSummary: 'The Fed\'s cautious approach suggests stable interest rates in the near term. This is broadly neutral for equities but may favor growth over value stocks.', confidence: 76, publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), symbols: ['SPX'] },
  { id: 'ns3', headline: 'NVIDIA faces scrutiny over export controls', source: 'CNBC', category: 'Technology', sentiment: 'negative', sentimentScore: 34, aiSummary: 'Regulatory review of chip exports could impact NVIDIA\'s near-term revenue from international markets. However, domestic demand remains strong.', confidence: 81, publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), symbols: ['NVDA'] },
  { id: 'ns4', headline: 'Tesla deliveries beat expectations for the quarter', source: 'MarketWatch', category: 'Automobile', sentiment: 'positive', sentimentScore: 74, aiSummary: 'Stronger-than-expected deliveries indicate sustained demand for Tesla vehicles. This could support the stock price in the short term.', confidence: 85, publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), symbols: ['TSLA'] },
  { id: 'ns5', headline: 'Microsoft cloud revenue accelerates on AI demand', source: 'WSJ', category: 'Technology', sentiment: 'positive', sentimentScore: 79, aiSummary: 'Azure growth reacceleration driven by AI workloads validates Microsoft\'s AI strategy. Enterprise adoption trends remain positive.', confidence: 90, publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), symbols: ['MSFT'] },
];

export interface WatchlistAnalysis {
  id: string;
  symbol: string;
  name: string;
  logoColor: string;
  category: 'overvalued' | 'undervalued' | 'high_momentum' | 'high_risk';
  price: number;
  aiAnalysis: string;
  confidence: number;
}

export const watchlistAnalysis: WatchlistAnalysis[] = [
  { id: 'wa1', symbol: 'NVDA', name: 'NVIDIA Corp.', logoColor: '#76B900', category: 'high_momentum', price: 138.60, aiAnalysis: 'Strong upward momentum with 23% return. RSI at 72 indicates overbought conditions. Consider waiting for a pullback.', confidence: 82 },
  { id: 'wa2', symbol: 'TSLA', name: 'Tesla Inc.', logoColor: '#E82127', category: 'high_risk', price: 251.44, aiAnalysis: 'High volatility (45% annualized) and beta of 2.1. Suitable for risk-tolerant investors only.', confidence: 78 },
  { id: 'wa3', symbol: 'JNJ', name: 'Johnson & Johnson', logoColor: '#DC241F', category: 'undervalued', price: 155.87, aiAnalysis: 'Trading at 21.5x P/E, below sector average of 24x. Dividend yield of 3.18% adds income appeal.', confidence: 74 },
  { id: 'wa4', symbol: 'AMZN', name: 'Amazon.com Inc.', logoColor: '#FF9900', category: 'overvalued', price: 201.88, aiAnalysis: 'P/E ratio of 47.3x is above historical average. Growth priced in; any earnings miss could trigger a correction.', confidence: 69 },
];

export interface MarketOpportunity {
  id: string;
  type: 'breakout' | 'value' | 'dividend' | 'growth' | 'momentum';
  symbol: string;
  name: string;
  logoColor: string;
  price: number;
  potentialReturn: number;
  rationale: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}

export const marketOpportunities: MarketOpportunity[] = [
  { id: 'mo1', type: 'breakout', symbol: 'NVDA', name: 'NVIDIA Corp.', logoColor: '#76B900', price: 138.60, potentialReturn: 15, rationale: 'Breaking above resistance with strong volume. AI sector tailwinds support continued upside.', riskLevel: 'medium', confidence: 82 },
  { id: 'mo2', type: 'value', symbol: 'JNJ', name: 'Johnson & Johnson', logoColor: '#DC241F', price: 155.87, potentialReturn: 8, rationale: 'Undervalued relative to peers with strong dividend history. Defensive play in uncertain markets.', riskLevel: 'low', confidence: 76 },
  { id: 'mo3', type: 'dividend', symbol: 'JPM', name: 'JPMorgan Chase', logoColor: '#117ACA', price: 241.82, potentialReturn: 6, rationale: '2.24% dividend yield with consistent payout growth. Strong financials support dividend sustainability.', riskLevel: 'low', confidence: 84 },
  { id: 'mo4', type: 'growth', symbol: 'MSFT', name: 'Microsoft Corp.', logoColor: '#00A4EF', price: 421.27, potentialReturn: 12, rationale: 'Azure growth accelerating on AI demand. Cloud market leadership provides durable competitive advantage.', riskLevel: 'medium', confidence: 87 },
  { id: 'mo5', type: 'momentum', symbol: 'META', name: 'Meta Platforms', logoColor: '#0866FF', price: 595.94, potentialReturn: 10, rationale: 'Strong price momentum with improving ad revenue. Reels monetization gaining traction.', riskLevel: 'medium', confidence: 79 },
  { id: 'mo6', type: 'value', symbol: 'ONGC', name: 'Oil & Natural Gas', logoColor: '#E2231A', price: 248.60, potentialReturn: 7, rationale: 'Low P/E of 8.2x with 3.86% dividend yield. Energy sector recovery supports upside.', riskLevel: 'low', confidence: 72 },
];

export interface DailyAISummary {
  date: string;
  summary: string;
  highlights: { label: string; value: string; positive: boolean }[];
}

export const dailyAISummary: DailyAISummary = {
  date: new Date().toISOString(),
  summary: 'Your portfolio is in very good health with a score of 82/100. Technology allocation remains high at 69.7%, but overall risk is well-managed. Market sentiment is bullish with positive momentum in tech and energy sectors. Consider increasing healthcare exposure to improve diversification.',
  highlights: [
    { label: 'Portfolio Health', value: '82/100', positive: true },
    { label: 'Market Sentiment', value: 'Bullish', positive: true },
    { label: 'Risk Level', value: 'Moderate', positive: true },
    { label: 'Top Opportunity', value: 'MSFT', positive: true },
  ],
};
