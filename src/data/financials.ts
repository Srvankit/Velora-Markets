export interface StockFinancials {
  symbol: string;
  revenueGrowth: number;
  profitGrowth: number;
  operatingMargin: number;
  netMargin: number;
  freeCashFlow: number;
  cashReserves: number;
  quarterlyRevenue: { quarter: string; revenue: number; profit: number }[];
  annualRevenue: { year: string; revenue: number }[];
}

export const stockFinancials: Record<string, StockFinancials> = {
  AAPL: {
    symbol: 'AAPL',
    revenueGrowth: 5.8,
    profitGrowth: 8.2,
    operatingMargin: 30.7,
    netMargin: 26.4,
    freeCashFlow: 108_000_000_000,
    cashReserves: 162_000_000_000,
    quarterlyRevenue: [
      { quarter: 'Q1', revenue: 119_600, profit: 33_920 },
      { quarter: 'Q2', revenue: 90_780, profit: 23_636 },
      { quarter: 'Q3', revenue: 85_500, profit: 21_440 },
      { quarter: 'Q4', revenue: 94_930, profit: 25_170 },
    ],
    annualRevenue: [
      { year: '2020', revenue: 274_515 },
      { year: '2021', revenue: 365_817 },
      { year: '2022', revenue: 394_328 },
      { year: '2023', revenue: 383_285 },
      { year: '2024', revenue: 391_035 },
    ],
  },
  MSFT: {
    symbol: 'MSFT',
    revenueGrowth: 15.1,
    profitGrowth: 19.8,
    operatingMargin: 44.4,
    netMargin: 36.4,
    freeCashFlow: 74_000_000_000,
    cashReserves: 75_000_000_000,
    quarterlyRevenue: [
      { quarter: 'Q1', revenue: 65_600, profit: 24_670 },
      { quarter: 'Q2', revenue: 62_000, profit: 22_680 },
      { quarter: 'Q3', revenue: 61_900, profit: 22_500 },
      { quarter: 'Q4', revenue: 69_600, profit: 25_350 },
    ],
    annualRevenue: [
      { year: '2020', revenue: 143_015 },
      { year: '2021', revenue: 168_088 },
      { year: '2022', revenue: 198_270 },
      { year: '2023', revenue: 211_915 },
      { year: '2024', revenue: 245_122 },
    ],
  },
  NVDA: {
    symbol: 'NVDA',
    revenueGrowth: 205.6,
    profitGrowth: 168.2,
    operatingMargin: 67.4,
    netMargin: 55.3,
    freeCashFlow: 56_000_000_000,
    cashReserves: 38_000_000_000,
    quarterlyRevenue: [
      { quarter: 'Q1', revenue: 26_040, profit: 14_880 },
      { quarter: 'Q2', revenue: 30_040, profit: 16_600 },
      { quarter: 'Q3', revenue: 35_080, profit: 19_420 },
      { quarter: 'Q4', revenue: 39_300, profit: 21_750 },
    ],
    annualRevenue: [
      { year: '2020', revenue: 16_675 },
      { year: '2021', revenue: 26_974 },
      { year: '2022', revenue: 26_974 },
      { year: '2023', revenue: 60_922 },
      { year: '2024', revenue: 130_497 },
    ],
  },
  TSLA: {
    symbol: 'TSLA',
    revenueGrowth: 9.0,
    profitGrowth: -24.0,
    operatingMargin: 8.2,
    netMargin: 7.6,
    freeCashFlow: 3_600_000_000,
    cashReserves: 30_700_000_000,
    quarterlyRevenue: [
      { quarter: 'Q1', revenue: 21_300, profit: 1_120 },
      { quarter: 'Q2', revenue: 25_500, profit: 1_470 },
      { quarter: 'Q3', revenue: 25_200, profit: 1_370 },
      { quarter: 'Q4', revenue: 25_700, profit: 1_580 },
    ],
    annualRevenue: [
      { year: '2020', revenue: 31_536 },
      { year: '2021', revenue: 53_823 },
      { year: '2022', revenue: 81_462 },
      { year: '2023', revenue: 96_773 },
      { year: '2024', revenue: 97_690 },
    ],
  },
  RELIANCE: {
    symbol: 'RELIANCE',
    revenueGrowth: 12.4,
    profitGrowth: 7.5,
    operatingMargin: 18.2,
    netMargin: 8.4,
    freeCashFlow: 1_200_000_000_000,
    cashReserves: 2_100_000_000_000,
    quarterlyRevenue: [
      { quarter: 'Q1', revenue: 241_800, profit: 17_920 },
      { quarter: 'Q2', revenue: 256_400, profit: 19_280 },
      { quarter: 'Q3', revenue: 248_700, profit: 18_450 },
      { quarter: 'Q4', revenue: 262_100, profit: 20_640 },
    ],
    annualRevenue: [
      { year: '2020', revenue: 594_700 },
      { year: '2021', revenue: 649_900 },
      { year: '2022', revenue: 876_400 },
      { year: '2023', revenue: 928_200 },
      { year: '2024', revenue: 1_043_600 },
    ],
  },
  TCS: {
    symbol: 'TCS',
    revenueGrowth: 8.1,
    profitGrowth: 9.6,
    operatingMargin: 24.3,
    netMargin: 20.2,
    freeCashFlow: 384_000_000_000,
    cashReserves: 524_000_000_000,
    quarterlyRevenue: [
      { quarter: 'Q1', revenue: 64_300, profit: 12_890 },
      { quarter: 'Q2', revenue: 65_800, profit: 13_320 },
      { quarter: 'Q3', revenue: 67_100, profit: 13_580 },
      { quarter: 'Q4', revenue: 66_400, profit: 13_410 },
    ],
    annualRevenue: [
      { year: '2020', revenue: 197_500 },
      { year: '2021', revenue: 197_500 },
      { year: '2022', revenue: 243_100 },
      { year: '2023', revenue: 257_100 },
      { year: '2024', revenue: 263_600 },
    ],
  },
};

const defaultFinancials: StockFinancials = {
  symbol: '',
  revenueGrowth: 6.2,
  profitGrowth: 4.8,
  operatingMargin: 15.4,
  netMargin: 10.2,
  freeCashFlow: 2_400_000_000,
  cashReserves: 5_800_000_000,
  quarterlyRevenue: [
    { quarter: 'Q1', revenue: 12_400, profit: 1_260 },
    { quarter: 'Q2', revenue: 13_100, profit: 1_340 },
    { quarter: 'Q3', revenue: 12_800, profit: 1_300 },
    { quarter: 'Q4', revenue: 13_600, profit: 1_390 },
  ],
  annualRevenue: [
    { year: '2020', revenue: 45_200 },
    { year: '2021', revenue: 48_600 },
    { year: '2022', revenue: 52_100 },
    { year: '2023', revenue: 51_400 },
    { year: '2024', revenue: 51_900 },
  ],
};

export function getStockFinancials(symbol: string): StockFinancials {
  return stockFinancials[symbol] ?? { ...defaultFinancials, symbol };
}
