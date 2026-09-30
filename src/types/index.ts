/**
 * Velora Markets — Domain Types
 * Shared type definitions for the entire platform.
 */

export type Trend = 'up' | 'down' | 'flat';

export interface Stock {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  trend: Trend;
  logo?: string;
  sector?: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
  timestamp: string;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  totalCost: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPL: number;
  totalPLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: Array<{ symbol: string; name: string; value: number; percent: number }>;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'buy' | 'sell' | 'dividend' | 'fee';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  balanceAfter: number;
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  pendingBalance: number;
}

export interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
  createdAt: string;
}

export interface MarketNewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  symbols: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  image?: string;
}

export interface NotificationItem {
  id: string;
  type: 'price_alert' | 'order' | 'news' | 'system' | 'dividend';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  country?: string;
  kycStatus: 'unverified' | 'pending' | 'verified';
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
  priceAlerts: boolean;
  twoFactorEnabled: boolean;
  currency: string;
}

export type InvestmentExperience = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type RiskProfile = 'conservative' | 'moderate' | 'balanced' | 'aggressive';
export type KycStatus = 'unverified' | 'pending' | 'verified';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  country?: string;
  avatar?: string;
  currency?: string;
  timezone?: string;
  investmentExperience?: InvestmentExperience;
  riskProfile?: RiskProfile;
  occupation?: string;
  annualIncomeRange?: string;
  investmentGoals?: string[];
  preferredMarkets?: string[];
  kycStatus: KycStatus;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface ProfileSetupData {
  avatar?: string;
  currency: string;
  country: string;
  timezone: string;
  investmentExperience: InvestmentExperience;
  riskProfile: RiskProfile;
  occupation: string;
  annualIncomeRange: string;
  investmentGoals: string[];
  preferredMarkets: string[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
