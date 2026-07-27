export type PaymentMethodType = 'bank' | 'upi' | 'debit_card' | 'credit_card';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  bankName?: string;
  accountType?: string;
  maskedNumber: string;
  ifsc?: string;
  upiId?: string;
  cardBrand?: string;
  expiry?: string;
  isDefault: boolean;
  isVerified: boolean;
  color: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm1',
    type: 'bank',
    name: 'HDFC Bank Savings',
    bankName: 'HDFC Bank',
    accountType: 'Savings Account',
    maskedNumber: '**** **** 4521',
    ifsc: 'HDFC0001234',
    isDefault: true,
    isVerified: true,
    color: '#004C8F',
  },
  {
    id: 'pm2',
    type: 'upi',
    name: 'GPay UPI',
    upiId: 'velora@okhdfcbank',
    maskedNumber: 'velora@okhdfcbank',
    isDefault: false,
    isVerified: true,
    color: '#4285F4',
  },
  {
    id: 'pm3',
    type: 'upi',
    name: 'PhonePe UPI',
    upiId: 'velora@ybl',
    maskedNumber: 'velora@ybl',
    isDefault: false,
    isVerified: true,
    color: '#5F259F',
  },
  {
    id: 'pm4',
    type: 'debit_card',
    name: 'HDFC Debit Card',
    bankName: 'HDFC Bank',
    cardBrand: 'Visa',
    maskedNumber: '**** **** **** 4521',
    expiry: '08/27',
    isDefault: false,
    isVerified: true,
    color: '#1A1F71',
  },
  {
    id: 'pm5',
    type: 'credit_card',
    name: 'ICICI Credit Card',
    cardBrand: 'Mastercard',
    maskedNumber: '**** **** **** 7890',
    expiry: '11/26',
    isDefault: false,
    isVerified: true,
    color: '#EB001B',
  },
  {
    id: 'pm6',
    type: 'bank',
    name: 'ICICI Bank Current',
    bankName: 'ICICI Bank',
    accountType: 'Current Account',
    maskedNumber: '**** **** 7890',
    ifsc: 'ICIC0005678',
    isDefault: false,
    isVerified: false,
    color: '#F4821F',
  },
];

export const paymentMethodTypeLabels: Record<PaymentMethodType, string> = {
  bank: 'Bank Account',
  upi: 'UPI ID',
  debit_card: 'Debit Card',
  credit_card: 'Credit Card',
};
