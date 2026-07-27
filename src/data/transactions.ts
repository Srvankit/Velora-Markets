export type TransactionType = 'deposit' | 'withdrawal' | 'trade_settlement' | 'dividend' | 'refund' | 'reward';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'processing';

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  date: string;
  reference: string;
  description: string;
  charges: number;
  completedAt?: string;
  timeline: { status: string; timestamp: string; note?: string }[];
}

export const walletTransactions: WalletTransaction[] = [
  {
    id: 'TXN-2025-001',
    type: 'deposit',
    amount: 5000,
    status: 'completed',
    paymentMethod: 'UPI - GPay',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    reference: 'UPI-7845123690',
    description: 'Wallet deposit via UPI',
    charges: 0,
    completedAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), note: 'Deposit initiated' },
      { status: 'Processing', timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(), note: 'Payment gateway processing' },
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(), note: 'Amount credited to wallet' },
    ],
  },
  {
    id: 'TXN-2025-002',
    type: 'trade_settlement',
    amount: -4764,
    status: 'completed',
    paymentMethod: 'Wallet',
    date: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    reference: 'ORD-2025-001',
    description: 'Buy 24 AAPL @ $198.50',
    charges: 3.57,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.4).toISOString(),
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), note: 'Trade order placed' },
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.4).toISOString(), note: 'Trade settled and amount debited' },
    ],
  },
  {
    id: 'TXN-2025-003',
    type: 'deposit',
    amount: 10000,
    status: 'pending',
    paymentMethod: 'Net Banking - HDFC',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    reference: 'NB-99412587',
    description: 'Wallet deposit via Net Banking',
    charges: 0,
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), note: 'Deposit initiated' },
      { status: 'Processing', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(), note: 'Awaiting bank confirmation' },
    ],
  },
  {
    id: 'TXN-2025-004',
    type: 'withdrawal',
    amount: -2000,
    status: 'completed',
    paymentMethod: 'Bank Transfer - HDFC',
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    reference: 'WD-55210478',
    description: 'Withdrawal to bank account',
    charges: 1.50,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 7.5).toISOString(),
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), note: 'Withdrawal requested' },
      { status: 'Processing', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7.8).toISOString(), note: 'Bank transfer initiated' },
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7.5).toISOString(), note: 'Amount debited from wallet' },
    ],
  },
  {
    id: 'TXN-2025-005',
    type: 'dividend',
    amount: 12.40,
    status: 'completed',
    paymentMethod: 'Direct Credit',
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    reference: 'DIV-JNJ-Q4',
    description: 'JNJ quarterly dividend',
    charges: 0,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    timeline: [
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), note: 'Dividend credited' },
    ],
  },
  {
    id: 'TXN-2025-006',
    type: 'trade_settlement',
    amount: 2772,
    status: 'completed',
    paymentMethod: 'Wallet',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    reference: 'ORD-2025-002',
    description: 'Sell 20 NVDA @ $138.60',
    charges: 3.88,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 47.9).toISOString(),
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), note: 'Trade order placed' },
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.9).toISOString(), note: 'Trade settled and amount credited' },
    ],
  },
  {
    id: 'TXN-2025-007',
    type: 'deposit',
    amount: 5000,
    status: 'completed',
    paymentMethod: 'UPI - PhonePe',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    reference: 'UPI-55210478',
    description: 'Wallet deposit via UPI',
    charges: 0,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 71.8).toISOString(),
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), note: 'Deposit initiated' },
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 71.8).toISOString(), note: 'Amount credited' },
    ],
  },
  {
    id: 'TXN-2025-008',
    type: 'refund',
    amount: 150,
    status: 'completed',
    paymentMethod: 'Wallet',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    reference: 'REF-2025-008',
    description: 'Order cancellation refund',
    charges: 0,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 95.5).toISOString(),
    timeline: [
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 95.5).toISOString(), note: 'Refund processed' },
    ],
  },
  {
    id: 'TXN-2025-009',
    type: 'withdrawal',
    amount: -3500,
    status: 'failed',
    paymentMethod: 'Bank Transfer - ICICI',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    reference: 'WD-44710258',
    description: 'Withdrawal attempt failed',
    charges: 0,
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), note: 'Withdrawal requested' },
      { status: 'Failed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 119.5).toISOString(), note: 'Bank account verification failed' },
    ],
  },
  {
    id: 'TXN-2025-010',
    type: 'reward',
    amount: 50,
    status: 'completed',
    paymentMethod: 'Cashback',
    date: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    reference: 'CB-2025-010',
    description: 'Trading cashback reward',
    charges: 0,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    timeline: [
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), note: 'Cashback credited' },
    ],
  },
  {
    id: 'TXN-2025-011',
    type: 'trade_settlement',
    amount: -27963,
    status: 'completed',
    paymentMethod: 'Wallet',
    date: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    reference: 'ORD-2025-006',
    description: 'Buy 15 INFY @ $1864.20',
    charges: 43.11,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 167.8).toISOString(),
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(), note: 'Trade order placed' },
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 167.8).toISOString(), note: 'Trade settled' },
    ],
  },
  {
    id: 'TXN-2025-012',
    type: 'deposit',
    amount: 7500,
    status: 'completed',
    paymentMethod: 'Debit Card - HDFC',
    date: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
    reference: 'DC-88410259',
    description: 'Wallet deposit via debit card',
    charges: 7.50,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 239.5).toISOString(),
    timeline: [
      { status: 'Initiated', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(), note: 'Deposit initiated' },
      { status: 'Completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 239.5).toISOString(), note: 'Amount credited' },
    ],
  },
];

export const transactionTypeFilters: { value: TransactionType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdrawal', label: 'Withdrawals' },
  { value: 'trade_settlement', label: 'Trade' },
  { value: 'dividend', label: 'Dividends' },
  { value: 'refund', label: 'Refunds' },
  { value: 'reward', label: 'Rewards' },
];
