export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  unlocked: boolean;
  progress?: number;
  color: string;
}

export const achievements: Achievement[] = [
  { id: 'a1', title: 'First Investment', description: 'Made your first investment on Velora', icon: 'Rocket', date: '2024-01-15T00:00:00Z', unlocked: true, color: 'hsl(var(--success))' },
  { id: 'a2', title: '100 Trades', description: 'Completed 100 trades on the platform', icon: 'Hash', date: '2024-06-20T00:00:00Z', unlocked: true, color: 'hsl(var(--chart-2))' },
  { id: 'a3', title: '$25K Portfolio', description: 'Reached $25,000 in portfolio value', icon: 'Trophy', date: '2024-09-10T00:00:00Z', unlocked: true, color: 'hsl(var(--chart-3))' },
  { id: 'a4', title: 'Dividend Collector', description: 'Received dividends from 5 different companies', icon: 'DollarSign', date: '2024-10-01T00:00:00Z', unlocked: true, color: 'hsl(var(--chart-4))' },
  { id: 'a5', title: 'AI Power User', description: 'Used AI insights 50 times', icon: 'Sparkles', date: '2024-11-15T00:00:00Z', unlocked: true, color: 'hsl(var(--chart-5))' },
  { id: 'a6', title: 'Long Term Investor', description: 'Hold investments for 6+ months', icon: 'Clock', date: '', unlocked: false, progress: 85, color: 'hsl(var(--primary))' },
  { id: 'a7', title: '$100K Portfolio', description: 'Reach $100,000 in portfolio value', icon: 'Crown', date: '', unlocked: false, progress: 28, color: 'hsl(var(--warning))' },
  { id: 'a8', title: 'Diversification Master', description: 'Invest in 10+ different sectors', icon: 'PieChart', date: '', unlocked: false, progress: 60, color: 'hsl(var(--chart-2))' },
];

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const badges: Badge[] = [
  { id: 'b1', label: 'Verified Investor', description: 'Account verified with KYC', icon: 'BadgeCheck', color: 'hsl(var(--success))' },
  { id: 'b2', label: 'Premium Member', description: 'Velora Premium subscriber', icon: 'Crown', color: 'hsl(var(--warning))' },
  { id: 'b3', label: 'Early Adopter', description: 'Joined in the first 10,000 users', icon: 'Rocket', color: 'hsl(var(--chart-2))' },
  { id: 'b4', label: 'Top Performer', description: 'Top 10% portfolio returns this quarter', icon: 'TrendingUp', color: 'hsl(var(--chart-3))' },
];
