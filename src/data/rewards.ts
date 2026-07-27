export type RewardType = 'cashback' | 'referral' | 'investment' | 'milestone';

export interface Reward {
  id: string;
  type: RewardType;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: 'credited' | 'pending';
}

export const rewards: Reward[] = [
  { id: 'rw1', type: 'cashback', title: 'Trading Cashback', description: '0.5% cashback on all trades this month', amount: 50.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), status: 'credited' },
  { id: 'rw2', type: 'referral', title: 'Referral Bonus', description: 'Friend signed up using your referral code', amount: 100.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), status: 'credited' },
  { id: 'rw3', type: 'investment', title: 'Investment Milestone', description: 'Crossed $25,000 in portfolio value', amount: 75.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), status: 'credited' },
  { id: 'rw4', type: 'cashback', title: 'First Trade Cashback', description: 'Welcome bonus on your first trade', amount: 25.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), status: 'credited' },
  { id: 'rw5', type: 'referral', title: 'Referral Bonus', description: '2 friends signed up this month', amount: 200.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(), status: 'credited' },
  { id: 'rw6', type: 'milestone', title: 'Loyalty Reward', description: '6 months of active trading', amount: 150.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), status: 'credited' },
  { id: 'rw7', type: 'investment', title: 'Monthly Investment Reward', description: 'Consistent monthly investing for 3 months', amount: 80.00, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), status: 'pending' },
];

export const rewardTypeLabels: Record<RewardType, string> = {
  cashback: 'Cashback',
  referral: 'Referral Bonus',
  investment: 'Investment Reward',
  milestone: 'Milestone Reward',
};

export const rewardSummary = {
  totalEarned: 680.00,
  available: 342.75,
  pending: 80.00,
  thisMonth: 50.00,
};
