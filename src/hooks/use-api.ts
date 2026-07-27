import { useQuery } from '@tanstack/react-query';
import { marketService, portfolioService, walletService, watchlistService, notificationService } from '@/services';

export const queryKeys = {
  stocks: ['stocks'] as const,
  stock: (symbol: string) => ['stock', symbol] as const,
  trending: ['trending'] as const,
  news: ['news'] as const,
  holdings: ['holdings'] as const,
  portfolioSummary: ['portfolio-summary'] as const,
  transactions: (page: number) => ['transactions', page] as const,
  watchlists: ['watchlists'] as const,
  notifications: ['notifications'] as const,
};

export function useStocks() {
  return useQuery({ queryKey: queryKeys.stocks, queryFn: marketService.getStocks });
}

export function useStock(symbol: string) {
  return useQuery({ queryKey: queryKeys.stock(symbol), queryFn: () => marketService.getStock(symbol), enabled: !!symbol });
}

export function useTrending() {
  return useQuery({ queryKey: queryKeys.trending, queryFn: marketService.getTrending });
}

export function useMarketNews() {
  return useQuery({ queryKey: queryKeys.news, queryFn: marketService.getNews });
}

export function useHoldings() {
  return useQuery({ queryKey: queryKeys.holdings, queryFn: portfolioService.getHoldings });
}

export function usePortfolioSummary() {
  return useQuery({ queryKey: queryKeys.portfolioSummary, queryFn: portfolioService.getSummary });
}

export function useTransactions(page = 1) {
  return useQuery({ queryKey: queryKeys.transactions(page), queryFn: () => walletService.getTransactions(page) });
}

export function useWatchlists() {
  return useQuery({ queryKey: queryKeys.watchlists, queryFn: watchlistService.getWatchlists });
}

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications, queryFn: notificationService.getNotifications });
}
