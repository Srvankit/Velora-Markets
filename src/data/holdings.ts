import type { Holding, Position } from '@/types/trading';

export const mockHoldings: Holding[] = [
  { id: 'h1', symbol: 'AAPL', name: 'Apple Inc.', shares: 24, avgPrice: 198.50, currentPrice: 232.41, logoColor: '#A8A8A8', sector: 'Technology', exchange: 'NASDAQ', productType: 'delivery' },
  { id: 'h2', symbol: 'MSFT', name: 'Microsoft Corp.', shares: 12, avgPrice: 388.20, currentPrice: 421.27, logoColor: '#00A4EF', sector: 'Technology', exchange: 'NASDAQ', productType: 'delivery' },
  { id: 'h3', symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 40, avgPrice: 112.30, currentPrice: 138.60, logoColor: '#76B900', sector: 'Technology', exchange: 'NASDAQ', productType: 'delivery' },
  { id: 'h4', symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 18, avgPrice: 165.40, currentPrice: 179.18, logoColor: '#4285F4', sector: 'Technology', exchange: 'NASDAQ', productType: 'delivery' },
  { id: 'h5', symbol: 'INFY', name: 'Infosys Ltd.', shares: 15, avgPrice: 1864.20, currentPrice: 1864.20, logoColor: '#007CC3', sector: 'Technology', exchange: 'NSE', productType: 'delivery' },
];

export const mockPositions: Position[] = [
  { id: 'p1', symbol: 'TSLA', name: 'Tesla Inc.', side: 'buy', quantity: 10, avgPrice: 248.00, currentPrice: 251.44, pnl: 34.40, pnlPercent: 1.39, productType: 'intraday', status: 'open', logoColor: '#E82127' },
  { id: 'p2', symbol: 'RELIANCE', name: 'Reliance Industries', side: 'sell', quantity: 50, avgPrice: 1290.00, currentPrice: 1284.50, pnl: 275.00, pnlPercent: 0.43, productType: 'intraday', status: 'open', logoColor: '#0066B3' },
  { id: 'p3', symbol: 'JPM', name: 'JPMorgan Chase', side: 'buy', quantity: 5, avgPrice: 240.00, currentPrice: 241.82, pnl: 9.10, pnlPercent: 0.76, productType: 'intraday', status: 'open', logoColor: '#117ACA' },
  { id: 'p4', symbol: 'TATAMOTORS', name: 'Tata Motors', side: 'buy', quantity: 20, avgPrice: 720.00, currentPrice: 712.40, pnl: -152.00, pnlPercent: -1.06, productType: 'intraday', status: 'closed', logoColor: '#1A1A1A', closedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'p5', symbol: 'SBIN', name: 'State Bank of India', side: 'sell', quantity: 30, avgPrice: 810.00, currentPrice: 812.30, pnl: 69.00, pnlPercent: 0.28, productType: 'intraday', status: 'closed', logoColor: '#0B5394', closedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
];
