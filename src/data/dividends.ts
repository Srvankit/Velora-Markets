export interface DividendRecord {
  id: string;
  symbol: string;
  name: string;
  logoColor: string;
  amount: number;
  date: string;
  perShare: number;
  shares: number;
  frequency: 'quarterly' | 'monthly' | 'annual';
}

export interface UpcomingDividend {
  id: string;
  symbol: string;
  name: string;
  logoColor: string;
  exDate: string;
  payDate: string;
  perShare: number;
  estimatedAmount: number;
}

export const dividendHistory: DividendRecord[] = [
  { id: 'd1', symbol: 'JNJ', name: 'Johnson & Johnson', logoColor: '#DC241F', amount: 12.40, date: '2024-10-10T00:00:00Z', perShare: 1.24, shares: 10, frequency: 'quarterly' },
  { id: 'd2', symbol: 'JPM', name: 'JPMorgan Chase', logoColor: '#117ACA', amount: 25.00, date: '2024-10-01T00:00:00Z', perShare: 1.25, shares: 20, frequency: 'quarterly' },
  { id: 'd3', symbol: 'MSFT', name: 'Microsoft Corp.', logoColor: '#00A4EF', amount: 8.64, date: '2024-09-15T00:00:00Z', perShare: 0.72, shares: 12, frequency: 'quarterly' },
  { id: 'd4', symbol: 'AAPL', name: 'Apple Inc.', logoColor: '#A8A8A8', amount: 10.32, date: '2024-08-12T00:00:00Z', perShare: 0.43, shares: 24, frequency: 'quarterly' },
  { id: 'd5', symbol: 'V', name: 'Visa Inc.', logoColor: '#1A1F71', amount: 7.40, date: '2024-07-01T00:00:00Z', perShare: 0.74, shares: 10, frequency: 'quarterly' },
  { id: 'd6', symbol: 'JNJ', name: 'Johnson & Johnson', logoColor: '#DC241F', amount: 12.40, date: '2024-07-10T00:00:00Z', perShare: 1.24, shares: 10, frequency: 'quarterly' },
  { id: 'd7', symbol: 'JPM', name: 'JPMorgan Chase', logoColor: '#117ACA', amount: 25.00, date: '2024-07-01T00:00:00Z', perShare: 1.25, shares: 20, frequency: 'quarterly' },
  { id: 'd8', symbol: 'MSFT', name: 'Microsoft Corp.', logoColor: '#00A4EF', amount: 8.64, date: '2024-06-15T00:00:00Z', perShare: 0.72, shares: 12, frequency: 'quarterly' },
];

export const upcomingDividends: UpcomingDividend[] = [
  { id: 'u1', symbol: 'JNJ', name: 'Johnson & Johnson', logoColor: '#DC241F', exDate: '2025-02-24T00:00:00Z', payDate: '2025-03-10T00:00:00Z', perShare: 1.24, estimatedAmount: 12.40 },
  { id: 'u2', symbol: 'JPM', name: 'JPMorgan Chase', logoColor: '#117ACA', exDate: '2025-02-28T00:00:00Z', payDate: '2025-03-15T00:00:00Z', perShare: 1.25, estimatedAmount: 25.00 },
  { id: 'u3', symbol: 'MSFT', name: 'Microsoft Corp.', logoColor: '#00A4EF', exDate: '2025-03-15T00:00:00Z', payDate: '2025-03-28T00:00:00Z', perShare: 0.75, estimatedAmount: 9.00 },
  { id: 'u4', symbol: 'AAPL', name: 'Apple Inc.', logoColor: '#A8A8A8', exDate: '2025-02-10T00:00:00Z', payDate: '2025-02-15T00:00:00Z', perShare: 0.45, estimatedAmount: 10.80 },
];

export const dividendSummary = {
  totalEarned: 109.80,
  annualIncome: 439.20,
  dividendYield: 2.27,
  nextPayment: 12.40,
  nextPaymentDate: '2025-03-10T00:00:00Z',
};
