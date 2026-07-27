export type NotificationCategory = 'trading' | 'portfolio' | 'wallet' | 'ai' | 'security' | 'system';
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  priority: NotificationPriority;
  read: boolean;
  icon: string;
}

export const notifications: AppNotification[] = [
  { id: 'n1', category: 'trading', title: 'Order Executed', description: 'Your buy order for 24 AAPL @ $198.50 has been executed successfully.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), priority: 'high', read: false, icon: 'ShoppingCart' },
  { id: 'n2', category: 'security', title: 'New Device Login', description: 'A new login from iPhone 15 Pro in San Francisco, CA. Was this you?', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), priority: 'high', read: false, icon: 'ShieldAlert' },
  { id: 'n3', category: 'ai', title: 'AI Recommendation', description: 'AI suggests increasing healthcare exposure to improve diversification.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), priority: 'medium', read: false, icon: 'Sparkles' },
  { id: 'n4', category: 'wallet', title: 'Deposit Successful', description: 'Your deposit of $5,000 has been credited to your wallet.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), priority: 'medium', read: true, icon: 'ArrowDownToLine' },
  { id: 'n5', category: 'portfolio', title: 'Portfolio Milestone', description: 'Your portfolio value has crossed $25,000. Keep up the great work!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), priority: 'low', read: true, icon: 'Trophy' },
  { id: 'n6', category: 'trading', title: 'Price Alert: NVDA', description: 'NVDA has crossed your alert threshold of $135. Current price: $138.60.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), priority: 'medium', read: true, icon: 'Bell' },
  { id: 'n7', category: 'system', title: 'Maintenance Scheduled', description: 'Scheduled maintenance on July 25, 2025, 2:00-4:00 AM PST. Some features may be unavailable.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), priority: 'low', read: true, icon: 'Settings' },
  { id: 'n8', category: 'ai', title: 'Risk Score Improved', description: 'Your portfolio risk score improved by 12% this quarter.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), priority: 'low', read: true, icon: 'TrendingUp' },
  { id: 'n9', category: 'wallet', title: 'Withdrawal Processed', description: 'Your withdrawal of $2,000 has been sent to your bank account.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), priority: 'medium', read: true, icon: 'ArrowUpFromLine' },
  { id: 'n10', category: 'portfolio', title: 'Dividend Received', description: 'JNJ quarterly dividend of $12.40 has been credited to your wallet.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), priority: 'low', read: true, icon: 'DollarSign' },
  { id: 'n11', category: 'security', title: 'Password Changed', description: 'Your account password was changed successfully.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), priority: 'medium', read: true, icon: 'Lock' },
  { id: 'n12', category: 'system', title: 'New Feature Available', description: 'AI Investment Intelligence Suite is now available. Explore it today!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), priority: 'low', read: true, icon: 'Gift' },
];

export const notificationTabs: { value: NotificationCategory | 'all' | 'unread'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'trading', label: 'Trading' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'ai', label: 'AI Insights' },
  { value: 'security', label: 'Security' },
  { value: 'system', label: 'System' },
];

export interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export const notificationPreferences: NotificationPreference[] = [
  { id: 'np1', label: 'Trading Alerts', description: 'Order executions, price alerts, and trade settlements', email: true, push: true, sms: false },
  { id: 'np2', label: 'Market News', description: 'Breaking market news and sector updates', email: true, push: true, sms: false },
  { id: 'np3', label: 'AI Recommendations', description: 'AI-powered investment recommendations and insights', email: true, push: true, sms: false },
  { id: 'np4', label: 'Portfolio Alerts', description: 'Milestones, dividends, and portfolio changes', email: true, push: true, sms: false },
  { id: 'np5', label: 'Security Alerts', description: 'Login attempts, password changes, and security events', email: true, push: true, sms: true },
  { id: 'np6', label: 'Wallet Notifications', description: 'Deposits, withdrawals, and payment events', email: true, push: false, sms: false },
];
