export type SentimentType = 'bullish' | 'neutral' | 'bearish';

export interface MarketSentiment {
  overall: SentimentType;
  fearGreedIndex: number;
  fearGreedLabel: string;
  description: string;
}

export const marketSentiment: MarketSentiment = {
  overall: 'bullish',
  fearGreedIndex: 68,
  fearGreedLabel: 'Greed',
  description: 'Market sentiment is bullish with a Fear & Greed index of 68. Investors are showing optimism driven by strong tech earnings and cooling inflation.',
};

export interface SectorSentiment {
  id: string;
  sector: string;
  sentiment: SentimentType;
  score: number;
  change: number;
}

export const sectorSentiment: SectorSentiment[] = [
  { id: 'ss1', sector: 'Technology', sentiment: 'bullish', score: 78, change: 4 },
  { id: 'ss2', sector: 'Healthcare', sentiment: 'neutral', score: 54, change: 1 },
  { id: 'ss3', sector: 'Finance', sentiment: 'bullish', score: 67, change: 3 },
  { id: 'ss4', sector: 'Energy', sentiment: 'bullish', score: 71, change: 5 },
  { id: 'ss5', sector: 'Consumer', sentiment: 'neutral', score: 52, change: -1 },
  { id: 'ss6', sector: 'Automobile', sentiment: 'bearish', score: 38, change: -3 },
  { id: 'ss7', sector: 'Industrial', sentiment: 'neutral', score: 56, change: 2 },
];

export interface GlobalSentiment {
  id: string;
  region: string;
  sentiment: SentimentType;
  score: number;
  flag: string;
}

export const globalSentiment: GlobalSentiment[] = [
  { id: 'gs1', region: 'US Markets', sentiment: 'bullish', score: 72, flag: 'US' },
  { id: 'gs2', region: 'European Markets', sentiment: 'neutral', score: 55, flag: 'EU' },
  { id: 'gs3', region: 'Asian Markets', sentiment: 'bullish', score: 64, flag: 'AS' },
  { id: 'gs4', region: 'Emerging Markets', sentiment: 'neutral', score: 51, flag: 'EM' },
];

export const sentimentConfig: Record<SentimentType, { label: string; color: string; bg: string }> = {
  bullish: { label: 'Bullish', color: 'text-success', bg: 'bg-success/10' },
  neutral: { label: 'Neutral', color: 'text-warning', bg: 'bg-warning/10' },
  bearish: { label: 'Bearish', color: 'text-danger', bg: 'bg-danger/10' },
};
