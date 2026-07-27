export interface RiskDimension {
  label: string;
  score: number;
  maxScore: number;
  level: 'low' | 'moderate' | 'high';
  description: string;
}

export const riskDimensions: RiskDimension[] = [
  { label: 'Portfolio Risk', score: 6.2, maxScore: 10, level: 'moderate', description: 'Overall portfolio risk based on holdings composition and market exposure.' },
  { label: 'Sector Risk', score: 7.1, maxScore: 10, level: 'high', description: 'Risk from sector concentration. High technology exposure increases this score.' },
  { label: 'Stock Concentration', score: 5.8, maxScore: 10, level: 'moderate', description: 'Risk from individual stock weighting. No single position exceeds 30% of portfolio.' },
  { label: 'Liquidity Risk', score: 3.2, maxScore: 10, level: 'low', description: 'Risk related to ability to convert holdings to cash quickly. All holdings are highly liquid.' },
  { label: 'Market Volatility', score: 6.5, maxScore: 10, level: 'moderate', description: 'Exposure to market-wide volatility. Portfolio beta of 1.12 means slightly higher than market.' },
  { label: 'Inflation Risk', score: 4.8, maxScore: 10, level: 'moderate', description: 'Risk that inflation erodes real returns. Equity holdings provide natural inflation hedge.' },
];

export interface RiskRadarPoint {
  dimension: string;
  value: number;
  benchmark: number;
}

export const riskRadarData: RiskRadarPoint[] = [
  { dimension: 'Portfolio', value: 6.2, benchmark: 5.5 },
  { dimension: 'Sector', value: 7.1, benchmark: 5.0 },
  { dimension: 'Concentration', value: 5.8, benchmark: 6.0 },
  { dimension: 'Liquidity', value: 3.2, benchmark: 4.0 },
  { dimension: 'Volatility', value: 6.5, benchmark: 5.8 },
  { dimension: 'Inflation', value: 4.8, benchmark: 5.0 },
];

export interface RiskMetric {
  label: string;
  value: string;
  description: string;
  status: 'good' | 'moderate' | 'warning';
}

export const riskMetrics: RiskMetric[] = [
  { label: 'Portfolio Beta', value: '1.12', description: 'Slightly above market beta of 1.0', status: 'moderate' },
  { label: 'Sharpe Ratio', value: '1.42', description: 'Strong risk-adjusted returns', status: 'good' },
  { label: 'Max Drawdown', value: '-12.4%', description: 'Within acceptable range', status: 'moderate' },
  { label: 'Volatility (1Y)', value: '18.4%', description: 'Moderate volatility', status: 'moderate' },
  { label: 'VaR (95%)', value: '-2.8%', description: 'Daily value at risk', status: 'good' },
  { label: 'Correlation', value: '0.87', description: 'High correlation with benchmark', status: 'warning' },
];
