/**
 * Velora Markets — Multi-Currency & Locale-Aware Valuation Engine
 * Supports seamless conversions across:
 * - India (INR ₹)
 * - USA (USD $)
 * - UK (GBP £)
 * - Europe (EUR €)
 * - Japan (JPY ¥)
 * - Canada (CAD CA$)
 * - Australia (AUD A$)
 * - UAE (AED AED)
 * - Singapore (SGD S$)
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

// Base authoritative reference exchange rates (Units per 1 USD)
let FX_TO_USD: Record<string, number> = {
  USD: 1.0,
  INR: 86.85,
  GBP: 0.79,
  EUR: 0.95,
  JPY: 152.40,
  CAD: 1.42,
  AUD: 1.58,
  AED: 3.6725,
  SGD: 1.35,
};

let activeUserCurrency = 'USD';

// Try initializing from session storage / local storage
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem('velora-auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.user?.currency) {
        activeUserCurrency = parsed.user.currency.toUpperCase();
      } else if (parsed?.user?.country) {
        activeUserCurrency = getCurrencyForCountry(parsed.user.country);
      }
    }
  } catch {
    // fallback to USD
  }
}

export function getActiveCurrency(): string {
  return activeUserCurrency;
}

export function setActiveCurrency(curr?: string | null): void {
  if (curr && curr.trim()) {
    const norm = curr.trim().toUpperCase();
    if (SUPPORTED_CURRENCIES[norm]) {
      activeUserCurrency = norm;
    }
  }
}

export function setFxRates(rates: Record<string, number>): void {
  FX_TO_USD = { ...FX_TO_USD, ...rates };
}

export function getCurrencyForCountry(country?: string | null): string {
  if (!country) return 'USD';
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
    case 'ENGLAND':
    case 'SCOTLAND':
    case 'WALES':
      return 'GBP';
    case 'DE':
    case 'FR':
    case 'IT':
    case 'ES':
    case 'NL':
    case 'BE':
    case 'AT':
    case 'PT':
    case 'IE':
    case 'FI':
    case 'GR':
    case 'GERMANY':
    case 'FRANCE':
    case 'ITALY':
    case 'SPAIN':
    case 'NETHERLANDS':
    case 'BELGIUM':
    case 'AUSTRIA':
    case 'PORTUGAL':
    case 'IRELAND':
    case 'FINLAND':
    case 'GREECE':
    case 'EU':
    case 'EUROPE':
      return 'EUR';
    case 'JP':
    case 'JPN':
    case 'JAPAN':
      return 'JPY';
    case 'CA':
    case 'CAN':
    case 'CANADA':
      return 'CAD';
    case 'AU':
    case 'AUS':
    case 'AUSTRALIA':
      return 'AUD';
    case 'AE':
    case 'UAE':
    case 'UNITED ARAB EMIRATES':
    case 'DUBAI':
      return 'AED';
    case 'SG':
    case 'SGP':
    case 'SINGAPORE':
      return 'SGD';
    default:
      return 'USD';
  }
}

export function getCurrencySymbol(currency?: string | null): string {
  const norm = (currency || activeUserCurrency || 'USD').toUpperCase();
  return SUPPORTED_CURRENCIES[norm]?.symbol ?? norm;
}

export function convertCurrency(
  amount: number,
  fromCurrency = 'USD',
  toCurrency?: string,
): {
  convertedAmount: number;
  rate: number;
  from: string;
  to: string;
} {
  const from = (fromCurrency || 'USD').toUpperCase();
  const to = (toCurrency || activeUserCurrency || 'USD').toUpperCase();

  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }

  if (from === to) {
    return { convertedAmount: amount, rate: 1.0, from, to };
  }

  const rateFrom = FX_TO_USD[from] ?? 1.0;
  const rateTo = FX_TO_USD[to] ?? 1.0;

  // Convert `from` -> USD -> `to`
  const usdAmount = from === 'USD' ? amount : amount / rateFrom;
  const convertedAmount = to === 'USD' ? usdAmount : usdAmount * rateTo;
  const effectiveRate = amount !== 0 ? convertedAmount / amount : rateTo / rateFrom;

  return {
    convertedAmount,
    rate: effectiveRate,
    from,
    to,
  };
}

export function formatCurrency(
  amount: number,
  currency?: string | null,
  options?: {
    decimals?: number;
    showCode?: boolean;
    compact?: boolean;
  },
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }

  const norm = (currency || activeUserCurrency || 'USD').toUpperCase();
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

export function convertAndFormat(
  amount: number,
  fromCurrency = 'USD',
  toCurrency?: string,
  options?: {
    decimals?: number;
    showCode?: boolean;
    compact?: boolean;
  },
): string {
  const target = (toCurrency || activeUserCurrency || 'USD').toUpperCase();
  const { convertedAmount } = convertCurrency(amount, fromCurrency, target);
  return formatCurrency(convertedAmount, target, options);
}
