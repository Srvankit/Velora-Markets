/**
 * Velora Markets — Application Constants
 */

export const APP = {
  name: 'Velora Markets',
  shortName: 'Velora',
  tagline: 'Learn. Trade. Grow. Together.',
  description:
    'A modern investment platform to buy stocks, track portfolios, and invest with confidence.',
  version: '1.0.0',
} as const;

/**
 * Resolves the backend base URL cleanly:
 * Handles:
 * - Empty / undefined -> '/api'
 * - 'http://localhost:8080' -> 'http://localhost:8080/api'
 * - 'http://localhost:8080/api' -> 'http://localhost:8080/api'
 * - 'https://velora-backend.onrender.com' -> 'https://velora-backend.onrender.com/api'
 * - 'https://velora-backend.onrender.com/api' -> 'https://velora-backend.onrender.com/api'
 * - Trailing slashes stripped
 */
export function getNormalizedApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!envUrl) {
    return '/api';
  }
  const clean = envUrl.replace(/\/+$/, '');
  if (clean.endsWith('/api/v1')) {
    return clean.slice(0, -3);
  }
  if (clean.endsWith('/api')) {
    return clean;
  }
  if (clean.endsWith('/v1')) {
    return clean.replace(/\/v1$/, '/api');
  }
  return `${clean}/api`;
}

export const API_CONFIG = {
  baseURL: getNormalizedApiBaseUrl(),
  timeout: 15000,
  version: 'v1',
} as const;


export const STORAGE_KEYS = {
  theme: 'velora-theme',
  auth: 'velora-auth',
  watchlist: 'velora-watchlist',
  recentSearches: 'velora-recent-searches',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Markets', href: '/market' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
] as const;

export const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Markets', href: '/markets', icon: 'CandlestickChart' },
  { label: 'Trade', href: '/trade', icon: 'TrendingUp' },
  { label: 'Portfolio', href: '/portfolio', icon: 'Briefcase' },
  { label: 'Wallet', href: '/wallet', icon: 'Wallet' },
  { label: 'Watchlist', href: '/watchlist', icon: 'Star' },
  { label: 'Academy', href: '/study', icon: 'GraduationCap' },
  { label: 'Billing', href: '/billing', icon: 'Crown' },
  { label: 'Transactions', href: '/transactions', icon: 'Receipt' },
  { label: 'Notifications', href: '/notifications', icon: 'Bell' },
] as const;

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
] as const;

export const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const MARKET_INDICES = [
  { symbol: 'SPX', name: 'S&P 500' },
  { symbol: 'NDX', name: 'Nasdaq 100' },
  { symbol: 'DJI', name: 'Dow Jones' },
  { symbol: 'RUT', name: 'Russell 2000' },
] as const;

export const SECTORS = [
  'Technology',
  'Healthcare',
  'Financials',
  'Consumer',
  'Energy',
  'Industrials',
  'Utilities',
  'Materials',
  'Real Estate',
  'Communication',
] as const;

export const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))',
  success: 'hsl(var(--chart-2))',
  warning: 'hsl(var(--chart-3))',
  danger: 'hsl(var(--chart-4))',
  accent: 'hsl(var(--chart-5))',
} as const;

export const AUTH_STORAGE_KEY = STORAGE_KEYS.auth;

export const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
] as const;

export const INVESTMENT_EXPERIENCES = [
  { value: 'beginner', label: 'Beginner', description: 'New to investing' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced investor' },
  { value: 'expert', label: 'Expert', description: 'Professional trader' },
] as const;

export const RISK_PROFILES = [
  { value: 'conservative', label: 'Conservative', description: 'Prioritize capital preservation' },
  { value: 'moderate', label: 'Moderate', description: 'Balanced risk and return' },
  { value: 'balanced', label: 'Balanced', description: 'Growth with some stability' },
  { value: 'aggressive', label: 'Aggressive', description: 'Maximize long-term growth' },
] as const;

export const PASSWORD_STRENGTH_LEVELS = {
  0: { label: 'Too weak', color: 'bg-danger', textColor: 'text-danger' },
  1: { label: 'Weak', color: 'bg-danger', textColor: 'text-danger' },
  2: { label: 'Fair', color: 'bg-warning', textColor: 'text-warning' },
  3: { label: 'Good', color: 'bg-primary', textColor: 'text-primary' },
  4: { label: 'Strong', color: 'bg-success', textColor: 'text-success' },
} as const;

export const TIMEZONES = [
  { value: 'UTC-08:00', label: 'Pacific Time (UTC-08:00)' },
  { value: 'UTC-05:00', label: 'Eastern Time (UTC-05:00)' },
  { value: 'UTC+00:00', label: 'Greenwich Mean Time (UTC+00:00)' },
  { value: 'UTC+01:00', label: 'Central European Time (UTC+01:00)' },
  { value: 'UTC+03:00', label: 'Eastern European Time (UTC+03:00)' },
  { value: 'UTC+04:00', label: 'Gulf Standard Time (UTC+04:00)' },
  { value: 'UTC+05:30', label: 'India Standard Time (UTC+05:30)' },
  { value: 'UTC+08:00', label: 'China Standard Time (UTC+08:00)' },
  { value: 'UTC+09:00', label: 'Japan Standard Time (UTC+09:00)' },
  { value: 'UTC+10:00', label: 'Australian Eastern Time (UTC+10:00)' },
] as const;

export const OCCUPATIONS = [
  { value: 'student', label: 'Student' },
  { value: 'employed', label: 'Employed Professional' },
  { value: 'self-employed', label: 'Self-Employed' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'retired', label: 'Retired' },
  { value: 'investor', label: 'Full-Time Investor' },
  { value: 'other', label: 'Other' },
] as const;

export const INCOME_RANGES = [
  { value: '0-25k', label: 'Under $25,000' },
  { value: '25k-50k', label: '$25,000 – $50,000' },
  { value: '50k-100k', label: '$50,000 – $100,000' },
  { value: '100k-250k', label: '$100,000 – $250,000' },
  { value: '250k+', label: '$250,000 and above' },
] as const;

export const INVESTMENT_GOALS = [
  { value: 'wealth-growth', label: 'Wealth Growth', description: 'Build long-term wealth' },
  { value: 'retirement', label: 'Retirement', description: 'Save for retirement' },
  { value: 'passive-income', label: 'Passive Income', description: 'Generate regular income' },
  { value: 'capital-preservation', label: 'Capital Preservation', description: 'Protect my savings' },
  { value: 'speculation', label: 'Speculation', description: 'High-risk, high-reward' },
  { value: 'education', label: 'Education Fund', description: 'Save for education' },
] as const;

export const PREFERRED_MARKETS = [
  { value: 'stocks', label: 'Stocks' },
  { value: 'etfs', label: 'ETFs' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'mutual-funds', label: 'Mutual Funds' },
  { value: 'bonds', label: 'Bonds' },
] as const;
