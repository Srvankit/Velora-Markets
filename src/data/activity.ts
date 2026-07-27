export type ActivityType = 'profile' | 'trade' | 'deposit' | 'withdraw' | 'ai' | 'login' | 'settings' | 'security';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export const activityEvents: ActivityEvent[] = [
  { id: 'ae1', type: 'trade', title: 'Buy Order Executed', description: 'Bought 24 shares of AAPL at $198.50', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), icon: 'ShoppingCart' },
  { id: 'ae2', type: 'login', title: 'New Login', description: 'Logged in from MacBook Pro in San Francisco, CA', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), icon: 'LogIn' },
  { id: 'ae3', type: 'ai', title: 'AI Report Generated', description: 'Generated AI portfolio risk analysis report', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), icon: 'Sparkles' },
  { id: 'ae4', type: 'deposit', title: 'Wallet Deposit', description: 'Deposited $5,000 via UPI - GPay', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), icon: 'ArrowDownToLine' },
  { id: 'ae5', type: 'settings', title: 'Settings Updated', description: 'Updated notification preferences', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), icon: 'Settings' },
  { id: 'ae6', type: 'security', title: 'Password Changed', description: 'Account password was changed successfully', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), icon: 'Lock' },
  { id: 'ae7', type: 'withdraw', title: 'Withdrawal Processed', description: 'Withdrew $2,000 to HDFC Bank account', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), icon: 'ArrowUpFromLine' },
  { id: 'ae8', type: 'profile', title: 'Profile Updated', description: 'Updated bio and social links', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), icon: 'User' },
  { id: 'ae9', type: 'trade', title: 'Sell Order Executed', description: 'Sold 20 shares of NVDA at $138.60', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), icon: 'ShoppingCart' },
  { id: 'ae10', type: 'ai', title: 'AI Chat Session', description: 'Had a conversation about portfolio diversification', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), icon: 'MessageSquare' },
  { id: 'ae11', type: 'login', title: 'Login from iPad', description: 'Logged in from iPad Air in Oakland, CA', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), icon: 'LogIn' },
  { id: 'ae12', type: 'settings', title: 'Theme Changed', description: 'Switched to dark theme', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), icon: 'Palette' },
  { id: 'ae13', type: 'deposit', title: 'Wallet Deposit', description: 'Deposited $7,500 via Debit Card - HDFC', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), icon: 'ArrowDownToLine' },
  { id: 'ae14', type: 'security', title: '2FA Enabled', description: 'Two-factor authentication was enabled', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), icon: 'ShieldCheck' },
  { id: 'ae15', type: 'profile', title: 'Profile Created', description: 'Welcome to Velora Markets! Your account was created.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), icon: 'UserPlus' },
];

export const activityTypeFilters: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Activity' },
  { value: 'profile', label: 'Profile' },
  { value: 'trade', label: 'Trades' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdraw', label: 'Withdrawals' },
  { value: 'ai', label: 'AI Reports' },
  { value: 'login', label: 'Logins' },
  { value: 'settings', label: 'Settings' },
  { value: 'security', label: 'Security' },
];
