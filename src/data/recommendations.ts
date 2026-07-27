export type Priority = 'high' | 'medium' | 'low';
export type RiskLevel = 'low' | 'medium' | 'high';
export type TimeHorizon = 'short' | 'medium' | 'long';

export interface Recommendation {
  id: string;
  title: string;
  priority: Priority;
  reason: string;
  expectedBenefit: string;
  confidence: number;
  riskLevel: RiskLevel;
  timeHorizon: TimeHorizon;
  action: string;
  icon: string;
  category: string;
}

export const recommendations: Recommendation[] = [
  {
    id: 'rec1',
    title: 'Increase Healthcare Exposure',
    priority: 'high',
    reason: 'Healthcare allocation is 8.6%, below the market average of 12%. This sector provides defensive characteristics and steady dividend income.',
    expectedBenefit: 'Improved diversification score by 8-10% and reduced sector concentration risk.',
    confidence: 87,
    riskLevel: 'low',
    timeHorizon: 'long',
    action: 'Explore Healthcare Stocks',
    icon: 'HeartPulse',
    category: 'Diversification',
  },
  {
    id: 'rec2',
    title: 'Reduce Tech Concentration',
    priority: 'high',
    reason: 'Technology represents 69.7% of your portfolio. Reducing to 50-55% would bring you closer to optimal allocation.',
    expectedBenefit: 'Lower volatility by 3-5% and reduced single-sector dependency.',
    confidence: 84,
    riskLevel: 'medium',
    timeHorizon: 'medium',
    action: 'Rebalance Portfolio',
    icon: 'Cpu',
    category: 'Allocation',
  },
  {
    id: 'rec3',
    title: 'Increase SIP Allocation',
    priority: 'medium',
    reason: 'Your monthly investment rate has been consistent but could be increased given your strong cash position of $8,420.',
    expectedBenefit: 'Accelerated wealth accumulation and dollar-cost averaging benefits.',
    confidence: 78,
    riskLevel: 'low',
    timeHorizon: 'long',
    action: 'Set Up SIP',
    icon: 'Repeat',
    category: 'Investment',
  },
  {
    id: 'rec4',
    title: 'Review Underperforming Holdings',
    priority: 'medium',
    reason: 'TSLA and HDFCBANK are underperforming their sector benchmarks. Consider reviewing their investment thesis.',
    expectedBenefit: 'Potential to reallocate capital to higher-conviction positions.',
    confidence: 72,
    riskLevel: 'medium',
    timeHorizon: 'short',
    action: 'Review Holdings',
    icon: 'Search',
    category: 'Performance',
  },
  {
    id: 'rec5',
    title: 'Add Dividend-Paying Stocks',
    priority: 'low',
    reason: 'Portfolio dividend yield is 1.8%, below the S&P 500 average of 2.1%. Adding quality dividend stocks can improve income.',
    expectedBenefit: 'Increased passive income and reduced portfolio volatility.',
    confidence: 69,
    riskLevel: 'low',
    timeHorizon: 'long',
    action: 'View Dividend Picks',
    icon: 'DollarSign',
    category: 'Income',
  },
  {
    id: 'rec6',
    title: 'Maintain Emergency Cash Buffer',
    priority: 'low',
    reason: 'Your cash allocation is healthy at 30.3%. Maintain at least 3-6 months of expenses as emergency reserve.',
    expectedBenefit: 'Financial security and ability to capitalize on market downturns.',
    confidence: 91,
    riskLevel: 'low',
    timeHorizon: 'short',
    action: 'Review Cash Position',
    icon: 'ShieldCheck',
    category: 'Cash Management',
  },
];

export const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: { label: 'High Priority', className: 'bg-danger/10 text-danger border-danger/20' },
  medium: { label: 'Medium Priority', className: 'bg-warning/10 text-warning border-warning/20' },
  low: { label: 'Low Priority', className: 'bg-primary/10 text-primary border-primary/20' },
};

export const riskLevelConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: { label: 'Low Risk', className: 'text-success' },
  medium: { label: 'Medium Risk', className: 'text-warning' },
  high: { label: 'High Risk', className: 'text-danger' },
};

export const timeHorizonConfig: Record<TimeHorizon, string> = {
  short: '1-3 months',
  medium: '3-12 months',
  long: '1+ years',
};
