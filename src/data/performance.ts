export interface PerformancePoint {
  date: string;
  value: number;
  benchmark: number;
}

export type PerformanceTimeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';

function generatePerformanceData(baseValue: number, points: number, volatility: number, trend: number): PerformancePoint[] {
  const data: PerformancePoint[] = [];
  let value = baseValue * 0.75;
  let benchmark = baseValue * 0.78;
  const now = new Date();

  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.45) * volatility * value;
    value = Math.max(value + noise + trend, baseValue * 0.5);
    const bNoise = (Math.random() - 0.45) * volatility * 0.8 * benchmark;
    benchmark = Math.max(benchmark + bNoise + trend * 0.7, baseValue * 0.5);
    const d = new Date(now);
    d.setDate(d.getDate() - (points - i));
    data.push({ date: d.toISOString(), value: Number(value.toFixed(2)), benchmark: Number(benchmark.toFixed(2)) });
  }
  data[points - 1].value = baseValue;
  return data;
}

export const performanceTimeframes: { label: PerformanceTimeframe; points: number; volatility: number; trend: number }[] = [
  { label: '1D', points: 24, volatility: 0.003, trend: 2 },
  { label: '1W', points: 35, volatility: 0.005, trend: 15 },
  { label: '1M', points: 30, volatility: 0.008, trend: 40 },
  { label: '3M', points: 45, volatility: 0.012, trend: 120 },
  { label: '6M', points: 50, volatility: 0.015, trend: 250 },
  { label: '1Y', points: 52, volatility: 0.018, trend: 500 },
  { label: '5Y', points: 60, volatility: 0.025, trend: 2500 },
  { label: 'MAX', points: 70, volatility: 0.03, trend: 5000 },
];

export function getPerformanceData(timeframe: PerformanceTimeframe): PerformancePoint[] {
  const tf = performanceTimeframes.find((t) => t.label === timeframe) ?? performanceTimeframes[2];
  return generatePerformanceData(27822.82, tf.points, tf.volatility, tf.trend);
}
