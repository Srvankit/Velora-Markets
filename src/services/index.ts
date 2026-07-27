import type {
  Stock,
  MarketNewsItem,
  NotificationItem,
  PortfolioHolding,
  PortfolioSummary,
  WalletTransaction,
  Watchlist,
  Paginated,
} from '@/types';
import { sleep } from '@/lib/format';
import {
  mockStocks,
  mockNews,
  mockNotifications,
  mockHoldings,
  mockPortfolioSummary,
  mockWalletTransactions,
  mockWatchlists,
} from '@/services/mock-data';

/**
 * Market service — stocks, quotes, news.
 * Backend is not yet implemented; these methods return mock data with
 * a small artificial delay so the UI exercises real loading states.
 */
export const marketService = {
  async getStocks(): Promise<Stock[]> {
    await sleep(400);
    return mockStocks;
  },

  async getStock(symbol: string): Promise<Stock | undefined> {
    await sleep(300);
    return mockStocks.find((s) => s.symbol === symbol.toUpperCase());
  },

  async getTrending(): Promise<Stock[]> {
    await sleep(350);
    return [...mockStocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 6);
  },

  async getNews(): Promise<MarketNewsItem[]> {
    await sleep(400);
    return mockNews;
  },
};

export const portfolioService = {
  async getHoldings(): Promise<PortfolioHolding[]> {
    await sleep(450);
    return mockHoldings;
  },

  async getSummary(): Promise<PortfolioSummary> {
    await sleep(450);
    return mockPortfolioSummary;
  },
};

export const walletService = {
  async getTransactions(page = 1, pageSize = 10): Promise<Paginated<WalletTransaction>> {
    await sleep(400);
    const start = (page - 1) * pageSize;
    const items = mockWalletTransactions.slice(start, start + pageSize);
    return {
      items,
      total: mockWalletTransactions.length,
      page,
      pageSize,
      totalPages: Math.ceil(mockWalletTransactions.length / pageSize),
    };
  },
};

export const watchlistService = {
  async getWatchlists(): Promise<Watchlist[]> {
    await sleep(300);
    return mockWatchlists;
  },
};

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    await sleep(350);
    return mockNotifications;
  },
};
