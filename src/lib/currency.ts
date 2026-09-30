/**
 * Velora Markets — Multi-Currency & Locale-Aware Valuation Engine
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
};

// Base exchange rates relative to USD (Authoritative reference rates)
const FX_TO_USD: Record<string, number> = {
  USD: 1.0,
  INR: 84.15,
  GBP: 0.77,
  EUR: 0.92,
  JPY: 148.50,
  CAD: 1.38,
  AUD: 1.49,
  AED: 3.67,
  SGD: 1.32,
};

export function getCurrencyForCountry(country?: string): string {
  if (!country) return 'INR';
  const c = country.trim().toUpperCase();
  switch (c) {
    case 'IN':
    case 'IND':
    case 'INDIA':
      return 'INR';
    case 'US':
    case 'USA':
    case 'UNITED STATES':
      return 'USD';
    case 'GB':
    case 'UK':
    case 'UNITED KINGDOM':
      return 'GBP';
    case 'DE':
    case 'FR':
    case 'GERMANY':
    case 'FRANCE':
    case 'EU':
    case 'EUROPE':
    case 'IT':
    case 'ES':
    case 'NL':
      return 'EUR';
    case 'JP':
    case 'JAPAN':
      return 'JPY';
    case 'CA':
    case 'CANADA':
      return 'CAD';
    case 'AU':
    case 'AUSTRALIA':
      return 'AUD';
    case 'AE':
    case 'UAE':
    case 'UNITED ARAB EMIRATES':
      return 'AED';
    case 'SG':
    case 'SINGAPORE':
      return 'SGD';
    default:
      return 'INR';
  }
}

export function getCurrencySymbol(currency = 'INR'): string {
  const norm = (currency || 'INR').toUpperCase();
  return SUPPORTED_CURRENCIES[norm]?.symbol ?? norm;
}

export function formatCurrency(
  amount: number,
  currency = 'INR',
  options?: {
    decimals?: number;
    showCode?: boolean;
    compact?: boolean;
  },
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }

  const norm = (currency || 'INR').toUpperCase();
  const config = SUPPORTED_CURRENCIES[norm] || {
    code: norm,
    symbol: norm,
    name: norm,
    locale: 'en-US',
  };

  const decimals = options?.decimals ?? (norm === 'JPY' ? 0 : 2);

  if (options?.compact && Math.abs(amount) >= 1_000) {
    if (norm === 'INR') {
      if (Math.abs(amount) >= 10_000_000) {
        return `${config.symbol}${(amount / 10_000_000).toFixed(2)} Cr`;
      }
      if (Math.abs(amount) >= 100_000) {
        return `${config.symbol}${(amount / 100_000).toFixed(2)} L`;
      }
      if (Math.abs(amount) >= 1_000) {
        return `${config.symbol}${(amount / 1_000).toFixed(1)}k`;
      }
    } else {
      if (Math.abs(amount) >= 1_000_000_000_000) {
        return `${config.symbol}${(amount / 1_000_000_000_000).toFixed(2)}T`;
      }
      if (Math.abs(amount) >= 1_000_000_000) {
        return `${config.symbol}${(amount / 1_000_000_000).toFixed(2)}B`;
      }
      if (Math.abs(amount) >= 1_000_000) {
        return `${config.symbol}${(amount / 1_000_000).toFixed(2)}M`;
      }
      if (Math.abs(amount) >= 1_000) {
        return `${config.symbol}${(amount / 1_000).toFixed(1)}k`;
      }
    }
  }

  const formattedNum = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  if (options?.showCode) {
    return `${config.symbol}${formattedNum} ${config.code}`;
  }

  return `${config.symbol}${formattedNum}`;
}

export function convertCurrency(
  amount: number,
  fromCurrency = 'USD',
  toCurrency = 'INR',
): {
  convertedAmount: number;
  rate: number;
  from: string;
  to: string;
} {
  const from = fromCurrency.toUpperCase();
  const to = toCurrency.toUpperCase();

  if (from === to) {
    return { convertedAmount: amount, rate: 1.0, from, to };
  }

  const rateFrom = FX_TO_USD[from] ?? 1.0;
  const rateTo = FX_TO_USD[to] ?? 1.0;

  // Convert `from` -> USD -> `to`
  const usdAmount = from === 'USD' ? amount : amount / rateFrom;
  const convertedAmount = to === 'USD' ? usdAmount : usdAmount * rateTo;
  const effectiveRate = convertedAmount / (amount || 1);

  return {
    convertedAmount,
    rate: effectiveRate,
    from,
    to,
  };
}
