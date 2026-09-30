/**
 * Velora Markets — Technical Indicator Engine
 * Calculates indicators mathematically from raw OHLCV series.
 */

export interface OHLCVPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorSettings {
  showSma: boolean;
  smaPeriod: number;
  showEma: boolean;
  emaPeriod: number;
  showBollinger: boolean;
  bbPeriod: number;
  bbStdDev: number;
  showVwap: boolean;
  showRsi: boolean;
  rsiPeriod: number;
  showMacd: boolean;
  macdFast: number;
  macdSlow: number;
  macdSignal: number;
  showVolume: boolean;
}

export const DEFAULT_INDICATOR_SETTINGS: IndicatorSettings = {
  showSma: false,
  smaPeriod: 20,
  showEma: false,
  emaPeriod: 50,
  showBollinger: false,
  bbPeriod: 20,
  bbStdDev: 2,
  showVwap: false,
  showRsi: false,
  rsiPeriod: 14,
  showMacd: false,
  macdFast: 12,
  macdSlow: 26,
  macdSignal: 9,
  showVolume: true,
};

export interface ComputedBar extends OHLCVPoint {
  sma?: number | null;
  ema?: number | null;
  bbUpper?: number | null;
  bbMiddle?: number | null;
  bbLower?: number | null;
  vwap?: number | null;
  rsi?: number | null;
  macd?: number | null;
  macdSignal?: number | null;
  macdHist?: number | null;
}

export function computeIndicators(
  data: OHLCVPoint[],
  settings: IndicatorSettings,
): ComputedBar[] {
  if (!data || data.length === 0) return [];

  const closes = data.map((d) => d.close);
  const len = data.length;

  // 1. SMA
  const smaValues: (number | null)[] = new Array(len).fill(null);
  if (settings.showSma && settings.smaPeriod > 0) {
    const p = settings.smaPeriod;
    for (let i = p - 1; i < len; i++) {
      let sum = 0;
      for (let j = i - p + 1; j <= i; j++) {
        sum += closes[j];
      }
      smaValues[i] = sum / p;
    }
  }

  // 2. EMA
  const emaValues: (number | null)[] = new Array(len).fill(null);
  if (settings.showEma && settings.emaPeriod > 0) {
    const p = settings.emaPeriod;
    if (len >= p) {
      let sum = 0;
      for (let i = 0; i < p; i++) sum += closes[i];
      let prevEma = sum / p;
      emaValues[p - 1] = prevEma;
      const k = 2 / (p + 1);

      for (let i = p; i < len; i++) {
        prevEma = closes[i] * k + prevEma * (1 - k);
        emaValues[i] = prevEma;
      }
    }
  }

  // 3. Bollinger Bands
  const bbUpper: (number | null)[] = new Array(len).fill(null);
  const bbMiddle: (number | null)[] = new Array(len).fill(null);
  const bbLower: (number | null)[] = new Array(len).fill(null);
  if (settings.showBollinger && settings.bbPeriod > 0) {
    const p = settings.bbPeriod;
    const mult = settings.bbStdDev;
    for (let i = p - 1; i < len; i++) {
      let sum = 0;
      for (let j = i - p + 1; j <= i; j++) sum += closes[j];
      const mean = sum / p;
      let varianceSum = 0;
      for (let j = i - p + 1; j <= i; j++) varianceSum += Math.pow(closes[j] - mean, 2);
      const stdDev = Math.sqrt(varianceSum / p);

      bbMiddle[i] = mean;
      bbUpper[i] = mean + mult * stdDev;
      bbLower[i] = mean - mult * stdDev;
    }
  }

  // 4. VWAP
  const vwapValues: (number | null)[] = new Array(len).fill(null);
  if (settings.showVwap) {
    let cumTypicalVol = 0;
    let cumVol = 0;
    for (let i = 0; i < len; i++) {
      const typical = (data[i].high + data[i].low + data[i].close) / 3;
      const vol = data[i].volume || 1;
      cumTypicalVol += typical * vol;
      cumVol += vol;
      vwapValues[i] = cumTypicalVol / (cumVol || 1);
    }
  }

  // 5. RSI
  const rsiValues: (number | null)[] = new Array(len).fill(null);
  if (settings.showRsi && settings.rsiPeriod > 0) {
    const p = settings.rsiPeriod;
    if (len > p) {
      let gains = 0;
      let losses = 0;
      for (let i = 1; i <= p; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff >= 0) gains += diff;
        else losses += Math.abs(diff);
      }
      let avgGain = gains / p;
      let avgLoss = losses / p;
      let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsiValues[p] = 100 - 100 / (1 + rs);

      for (let i = p + 1; i < len; i++) {
        const diff = closes[i] - closes[i - 1];
        const gain = diff >= 0 ? diff : 0;
        const loss = diff < 0 ? Math.abs(diff) : 0;

        avgGain = (avgGain * (p - 1) + gain) / p;
        avgLoss = (avgLoss * (p - 1) + loss) / p;
        rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsiValues[i] = 100 - 100 / (1 + rs);
      }
    }
  }

  // 6. MACD
  const macdLine: (number | null)[] = new Array(len).fill(null);
  const macdSig: (number | null)[] = new Array(len).fill(null);
  const macdHistogram: (number | null)[] = new Array(len).fill(null);

  if (settings.showMacd && settings.macdSlow > settings.macdFast) {
    const fastP = settings.macdFast;
    const slowP = settings.macdSlow;
    const sigP = settings.macdSignal;

    const fastEma = calculateEMA(closes, fastP);
    const slowEma = calculateEMA(closes, slowP);

    const macdSeries: number[] = [];
    const macdIndices: number[] = [];

    for (let i = 0; i < len; i++) {
      if (fastEma[i] !== null && slowEma[i] !== null) {
        const val = fastEma[i]! - slowEma[i]!;
        macdLine[i] = val;
        macdSeries.push(val);
        macdIndices.push(i);
      }
    }

    if (macdSeries.length >= sigP) {
      const sigEma = calculateEMA(macdSeries, sigP);
      for (let j = 0; j < macdSeries.length; j++) {
        const originalIndex = macdIndices[j];
        if (sigEma[j] !== null) {
          macdSig[originalIndex] = sigEma[j];
          macdHistogram[originalIndex] = macdSeries[j] - sigEma[j]!;
        }
      }
    }
  }

  return data.map((point, i) => ({
    ...point,
    sma: smaValues[i],
    ema: emaValues[i],
    bbUpper: bbUpper[i],
    bbMiddle: bbMiddle[i],
    bbLower: bbLower[i],
    vwap: vwapValues[i],
    rsi: rsiValues[i],
    macd: macdLine[i],
    macdSignal: macdSig[i],
    macdHist: macdHistogram[i],
  }));
}

function calculateEMA(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null);
  if (values.length < period) return result;

  let sum = 0;
  for (let i = 0; i < period; i++) sum += values[i];
  let prevEma = sum / period;
  result[period - 1] = prevEma;
  const k = 2 / (period + 1);

  for (let i = period; i < values.length; i++) {
    prevEma = values[i] * k + prevEma * (1 - k);
    result[i] = prevEma;
  }
  return result;
}
