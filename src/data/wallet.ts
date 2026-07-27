export interface WalletSummary {
  walletBalance: number;
  buyingPower: number;
  blockedAmount: number;
  investedAmount: number;
  profitAvailable: number;
  rewardsBalance: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  monthlyCashFlow: number;
  sparkline: number[];
}

export const walletSummary: WalletSummary = {
  walletBalance: 8420.50,
  buyingPower: 16841.00,
  blockedAmount: 1200.00,
  investedAmount: 16891.60,
  profitAvailable: 2510.72,
  rewardsBalance: 342.75,
  pendingDeposits: 5000.00,
  pendingWithdrawals: 2000.00,
  monthlyCashFlow: 4120.50,
  sparkline: [7200, 7400, 7600, 7800, 8100, 8300, 8420],
};

export interface CashFlowPoint {
  month: string;
  deposits: number;
  withdrawals: number;
  investments: number;
  netFlow: number;
}

export const cashFlowData: CashFlowPoint[] = [
  { month: 'Jan', deposits: 5000, withdrawals: 1000, investments: 3200, netFlow: 800 },
  { month: 'Feb', deposits: 3000, withdrawals: 500, investments: 2400, netFlow: 100 },
  { month: 'Mar', deposits: 7000, withdrawals: 2000, investments: 4500, netFlow: 500 },
  { month: 'Apr', deposits: 5000, withdrawals: 1500, investments: 3800, netFlow: -300 },
  { month: 'May', deposits: 10000, withdrawals: 2000, investments: 6500, netFlow: 1500 },
  { month: 'Jun', deposits: 8000, withdrawals: 1000, investments: 5200, netFlow: 1800 },
  { month: 'Jul', deposits: 6000, withdrawals: 2500, investments: 4100, netFlow: -600 },
  { month: 'Aug', deposits: 9000, withdrawals: 1500, investments: 5800, netFlow: 1700 },
  { month: 'Sep', deposits: 4500, withdrawals: 800, investments: 3200, netFlow: 500 },
  { month: 'Oct', deposits: 12000, withdrawals: 3000, investments: 7800, netFlow: 1200 },
  { month: 'Nov', deposits: 7500, withdrawals: 2000, investments: 4900, netFlow: 600 },
  { month: 'Dec', deposits: 10000, withdrawals: 2500, investments: 6200, netFlow: 1300 },
];

export interface WalletNotification {
  id: string;
  type: 'deposit' | 'withdraw' | 'payment_failed' | 'verification';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const walletNotifications: WalletNotification[] = [
  { id: 'wn1', type: 'deposit', title: 'Deposit Successful', message: 'Your deposit of $5,000 has been credited to your wallet.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: 'wn2', type: 'verification', title: 'Verification Pending', message: 'Your new bank account is being verified. This may take up to 48 hours.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), read: false },
  { id: 'wn3', type: 'withdraw', title: 'Withdrawal Successful', message: 'Your withdrawal of $2,000 has been processed to your bank account.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: true },
  { id: 'wn4', type: 'payment_failed', title: 'Payment Failed', message: 'A recent payment attempt failed due to insufficient funds in linked account.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
];

export interface AIWalletInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'warning';
  confidence: number;
  icon: string;
}

export const walletAIInsights: AIWalletInsight[] = [
  { id: 'wai1', title: 'Deposit Growth', description: 'Your monthly deposits have increased by 18% compared to the previous quarter, indicating a growing investment commitment.', type: 'positive', confidence: 92, icon: 'TrendingUp' },
  { id: 'wai2', title: 'Healthy Investment Habit', description: 'You are maintaining a consistent investment schedule with regular monthly contributions. Keep it up!', type: 'positive', confidence: 88, icon: 'CalendarCheck' },
  { id: 'wai3', title: 'Sufficient Cash Reserve', description: 'Your cash reserve of $8,420 is sufficient for your planned investments over the next 2 months.', type: 'positive', confidence: 85, icon: 'Wallet' },
  { id: 'wai4', title: 'Steady Investment Growth', description: 'Your average monthly investment has grown steadily from $3,200 to $6,200 over the past year.', type: 'positive', confidence: 90, icon: 'Activity' },
];

export interface SecurityInfo {
  walletPinEnabled: boolean;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
}

export const securityInfo: SecurityInfo = {
  walletPinEnabled: true,
  twoFactorEnabled: true,
  biometricEnabled: false,
};

export interface DeviceSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export const recentDevices: DeviceSession[] = [
  { id: 'ds1', device: 'MacBook Pro - Chrome', location: 'San Francisco, CA', lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(), current: true },
  { id: 'ds2', device: 'iPhone 15 - Velora App', location: 'San Francisco, CA', lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), current: false },
  { id: 'ds3', device: 'iPad Air - Safari', location: 'Oakland, CA', lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), current: false },
  { id: 'ds4', device: 'Windows PC - Edge', location: 'San Jose, CA', lastActive: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), current: false },
];
