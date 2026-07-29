import axios from 'axios';
import { apiRequest } from '@/api/client';

export interface BackendAuthResponse {
  userId: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  token: string | null;
  tokenType: string | null;
  message: string;
}

export interface BackendUserResponse {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  role: string;
  emailVerified: boolean;
}

export interface UpdateUserRequest {
  fullName: string;
  username: string;
  phone: string;
  country: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface BackendHolding {
  id: number;
  symbol: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  marketValue: number;
  unrealizedPnL: number;
  returnPercentage: number;
}

export interface BackendPortfolio {
  portfolioId: number;
  cashBalance: number;
  investedValue: number;
  marketValue: number;
  totalAccountValue: number;
  unrealizedPnL: number;
  realizedPnL: number;
  totalPnL: number;
  returnPercentage: number;
  totalHoldings: number;
  holdings: BackendHolding[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendWatchlistItem {
  id: number;
  symbol: string;
  companyName: string;
  currentPrice: number;
  addedAt: string;
}

export interface BackendDashboard {
  cashBalance: number;

  investedValue: number;
  marketValue: number;
  totalAccountValue: number;

  unrealizedPnL: number;
  realizedPnL: number;
  totalPnL: number;
  returnPercentage: number;

  totalHoldings: number;
  totalOrders: number;
  totalTransactions: number;

  topHoldings: unknown[];
  recentOrders: unknown[];
  recentTransactions: unknown[];
}

export interface BackendOrder {
  orderId: number;
  symbol: string;
  companyName: string;
  side: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'REJECTED';
  quantity: number;
  limitPrice: number | null;
  executionPrice: number | null;
  totalAmount: number | null;
  createdAt: string;
  executedAt: string | null;
}

export interface BackendTransaction {
  transactionId: number;
  orderId: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  realizedPnL: number | null;
  executedAt: string;
}

export interface BackendOrderExecution {
  orderId: number;
  symbol: string;
  companyName: string;
  side: string;
  orderType: string;
  status: string;
  quantity: number;
  executionPrice: number;
  totalAmount: number;
  remainingCashBalance: number;
  executedAt: string;
  message: string;
}

export interface BackendMarketStock {
  symbol: string;
  companyName: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE';
  sector: string;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string; errors?: Record<string, string> } | undefined;
    if (data?.message) return data.message;
    if (data?.errors) return Object.values(data.errors).join(', ');
    if (data?.error) return data.error;
    if (error.message) return error.message;
  }
  return error instanceof Error ? error.message : fallback;
}

export interface BackendPage<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const backendApi = {
  register: (data: { fullName: string; username: string; email: string; phone?: string; country?: string; password: string }) =>
    apiRequest<BackendAuthResponse>({ method: 'POST', url: '/auth/register', data }),
  login: (email: string, password: string) =>
    apiRequest<BackendAuthResponse>({ method: 'POST', url: '/auth/login', data: { email, password } }),
  me: () => apiRequest<BackendUserResponse>({ method: 'GET', url: '/users/me' }),
  portfolio: () => apiRequest<BackendPortfolio>({ method: 'GET', url: '/portfolio' }),
  orders: (page = 0, size = 20) =>
  apiRequest<BackendPage<BackendOrder>>({
    method: 'GET',
    url: '/trading/orders',
    params: { page, size },
  }),
  dashboard: () =>
  apiRequest<BackendDashboard>({
    method: 'GET',
    url: '/dashboard',
  }),

  changePassword: (data: ChangePasswordRequest) =>
  apiRequest<string>({
    method: 'POST',
    url: '/users/change-password',
    data,
  }),

watchlist: () =>
  apiRequest<BackendWatchlistItem[]>({
    method: 'GET',
    url: '/watchlist',
  }),

  addToWatchlist: (symbol: string) =>
  apiRequest<BackendWatchlistItem>({
    method: 'POST',
    url: `/watchlist/${symbol}`,
  }),

removeFromWatchlist: (symbol: string) =>
  apiRequest<void>({
    method: 'DELETE',
    url: `/watchlist/${symbol}`,
  }),

  marketStocks: () =>
  apiRequest<BackendMarketStock[]>({
    method: 'GET',
    url: '/market/stocks',
  }),

marketStock: (symbol: string) =>
  apiRequest<BackendMarketStock>({
    method: 'GET',
    url: `/market/stocks/${encodeURIComponent(symbol)}`,
  }),

searchMarketStocks: (query: string) =>
  apiRequest<BackendMarketStock[]>({
    method: 'GET',
    url: '/market/search',
    params: { query },
  }),

marketGainers: () =>
  apiRequest<BackendMarketStock[]>({
    method: 'GET',
    url: '/market/gainers',
  }),

marketLosers: () =>
  apiRequest<BackendMarketStock[]>({
    method: 'GET',
    url: '/market/losers',
  }),

marketActive: () =>
  apiRequest<BackendMarketStock[]>({
    method: 'GET',
    url: '/market/active',
  }),

transactions: (page = 0, size = 20) =>
  apiRequest<BackendPage<BackendTransaction>>({
    method: 'GET',
    url: '/trading/transactions',
    params: { page, size },
  }),
updateProfile: (data: UpdateUserRequest) =>
  apiRequest<BackendUserResponse>({
    method: 'PUT',
    url: '/users/me',
    data,
  }),
  placeOrder: (data: { symbol: string; side: 'BUY' | 'SELL'; orderType: 'MARKET'; quantity: number }) =>
    apiRequest<BackendOrderExecution>({ method: 'POST', url: '/trading/orders', data }),
};
