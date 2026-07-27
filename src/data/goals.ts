export interface InvestmentGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  targetDate: string;
  monthlyContribution: number;
}

export const investmentGoals: InvestmentGoal[] = [
  { id: 'g1', name: 'Emergency Fund', icon: 'ShieldCheck', targetAmount: 50000, currentAmount: 32500, color: 'hsl(var(--success))', targetDate: '2025-12-31T00:00:00Z', monthlyContribution: 1500 },
  { id: 'g2', name: 'Buy a Car', icon: 'Car', targetAmount: 35000, currentAmount: 18900, color: 'hsl(var(--chart-2))', targetDate: '2026-06-30T00:00:00Z', monthlyContribution: 2000 },
  { id: 'g3', name: 'Retirement', icon: 'PiggyBank', targetAmount: 500000, currentAmount: 87500, color: 'hsl(var(--chart-3))', targetDate: '2045-12-31T00:00:00Z', monthlyContribution: 3000 },
  { id: 'g4', name: 'Vacation', icon: 'Plane', targetAmount: 12000, currentAmount: 7800, color: 'hsl(var(--chart-4))', targetDate: '2025-07-15T00:00:00Z', monthlyContribution: 800 },
  { id: 'g5', name: 'Buy a House', icon: 'Home', targetAmount: 150000, currentAmount: 42300, color: 'hsl(var(--chart-5))', targetDate: '2028-12-31T00:00:00Z', monthlyContribution: 3500 },
];

export function getGoalProgress(goal: InvestmentGoal): number {
  return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
}

export function getEstimatedCompletion(goal: InvestmentGoal): string {
  const remaining = goal.targetAmount - goal.currentAmount;
  if (remaining <= 0 || goal.monthlyContribution <= 0) return 'Achieved';
  const months = Math.ceil(remaining / goal.monthlyContribution);
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
