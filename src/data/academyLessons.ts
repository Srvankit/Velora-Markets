/**
 * Velora Markets — Interactive Study & Academy Curriculum
 */

export interface AcademyLesson {
  id: string;
  category: 'beginner' | 'trading' | 'technical' | 'fundamental' | 'investing';
  title: string;
  subtitle: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  veloraToolAction?: {
    label: string;
    href: string;
  };
}

export interface AcademyCategory {
  id: 'beginner' | 'trading' | 'technical' | 'fundamental' | 'investing';
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const ACADEMY_CATEGORIES: AcademyCategory[] = [
  {
    id: 'beginner',
    title: 'Market Essentials',
    description: 'Foundational concepts: exchanges, indices, market cap, order books, and liquidity.',
    icon: 'BookOpen',
    color: '#3B82F6',
  },
  {
    id: 'trading',
    title: 'Trading Mechanics & Risk',
    description: 'Order execution types, position sizing, stop losses, risk-to-reward, and trading psychology.',
    icon: 'Flame',
    color: '#F59E0B',
  },
  {
    id: 'technical',
    title: 'Technical Analysis & Indicators',
    description: 'Candlestick patterns, support & resistance, SMA, EMA, RSI, MACD, Bollinger Bands, and VWAP.',
    icon: 'TrendingUp',
    color: '#10B981',
  },
  {
    id: 'fundamental',
    title: 'Fundamental Analysis',
    description: 'Financial statement dissection, EPS, P/E, P/B, ROE, free cash flows, and intrinsic valuation.',
    icon: 'LineChart',
    color: '#8B5CF6',
  },
  {
    id: 'investing',
    title: 'Wealth & Long-Term Investing',
    description: 'Systematic Investment Plans (SIP), compounding power, asset allocation, and index ETFs.',
    icon: 'ShieldCheck',
    color: '#EC4899',
  },
];

export const ACADEMY_LESSONS: AcademyLesson[] = [
  // 1. BEGINNER MODULE
  {
    id: 'stock-market-basics',
    category: 'beginner',
    title: 'Introduction to Stock Markets & Equity Shares',
    subtitle: 'What represents an equity share and how secondary markets work.',
    readTime: '4 min',
    summary: 'A stock (equity) represents fractional ownership in a corporation, conveying claims on future earnings and voting power.',
    content: [
      'The stock market is a centralized, regulated public venue where buyers and sellers trade fractional ownership stakes in publicly held corporations.',
      'When you purchase a share of stock in a company such as Apple Inc. or Reliance Industries, you become a partial owner (equity shareholder) entitled to participate in company growth, dividends, and shareholder votes.',
      'Primary vs. Secondary Market: In the primary market, corporations issue new securities to the public through an Initial Public Offering (IPO) to raise capital. In the secondary market, existing investors trade those securities among themselves without direct corporate intervention.',
    ],
    keyTakeaways: [
      'Equity ownership gives you a proportional claim on corporate assets and profits.',
      'Stock exchanges enable transparent price discovery and continuous liquidity.',
      'Velora Markets provides a 100% risk-free virtual simulator mirroring real market dynamics.',
    ],
    veloraToolAction: {
      label: 'Explore Live Markets',
      href: '/markets',
    },
  },
  {
    id: 'exchanges-and-indices',
    category: 'beginner',
    title: 'Stock Exchanges & Benchmark Indices',
    subtitle: 'NSE, BSE, NASDAQ, NYSE, NIFTY 50, and S&P 500 explained.',
    readTime: '5 min',
    summary: 'Exchanges are the physical and electronic clearing venues; benchmark indices aggregate representative baskets to gauge macroeconomic health.',
    content: [
      'Stock Exchanges act as clearing houses providing the infrastructure for matching buy and sell orders. Major global exchanges include the National Stock Exchange (NSE) and Bombay Stock Exchange (BSE) in India, and the NASDAQ and New York Stock Exchange (NYSE) in the United States.',
      'Benchmark Indices: An index tracks a curated basket of representative stocks. For example, the NIFTY 50 tracks the top 50 large-cap companies across 13 sectors in India, while the S&P 500 represents the leading 500 publicly traded US corporations.',
      'Indices provide an instant snapshot of market sentiment and serve as the baseline performance benchmark against which fund managers and active traders measure returns.',
    ],
    keyTakeaways: [
      'Indices aggregate multiple equities into a single macroeconomic barometer.',
      'Exchange clearing houses guarantee settlement and minimize counterparty default risk.',
    ],
    veloraToolAction: {
      label: 'View Index Charts',
      href: '/stocks/NIFTY50',
    },
  },
  {
    id: 'market-cap-and-liquidity',
    category: 'beginner',
    title: 'Market Capitalization, Bid-Ask & Liquidity',
    subtitle: 'Understanding company size tiers and order book depth.',
    readTime: '4 min',
    summary: 'Market cap equals total shares multiplied by share price, segmenting equities into Large-Cap, Mid-Cap, and Small-Cap tiers.',
    content: [
      'Market Capitalization = Total Outstanding Shares × Current Share Price. It categorizes stocks into Large-Cap (stable, blue-chip leaders), Mid-Cap (growing established firms), and Small-Cap (high potential, higher volatility).',
      'The Bid-Ask Spread: The Bid is the highest price a buyer is willing to pay; the Ask is the lowest price a seller is willing to accept. The difference is the spread.',
      'Liquidity reflects how quickly you can execute large trades at current market prices without moving the price significantly. Highly liquid stocks have tight penny spreads and deep order books.',
    ],
    keyTakeaways: [
      'Large caps offer lower volatility and capital preservation; small caps offer aggressive growth.',
      'Always inspect spread and volume before placing high-quantity trades.',
    ],
    veloraToolAction: {
      label: 'Inspect Market Caps in Search',
      href: '/markets',
    },
  },

  // 2. TRADING MODULE
  {
    id: 'order-types',
    category: 'trading',
    title: 'Order Types: Market, Limit, and Stop Orders',
    subtitle: 'Precision execution strategies for active traders.',
    readTime: '5 min',
    summary: 'Choose Market orders for guaranteed instant execution, or Limit orders for guaranteed execution price control.',
    content: [
      'Market Orders execute immediately at the best available prevailing market price. They prioritize execution speed over exact price and are ideal in highly liquid stocks.',
      'Limit Orders specify the exact maximum price you are willing to pay on a BUY, or the minimum price you will accept on a SELL. If the market does not reach your limit price, the order remains unexecuted.',
      'Stop-Loss Orders trigger a market order automatically when the price drops to or below your predetermined threshold, protecting capital against catastrophic drawdown.',
    ],
    keyTakeaways: [
      'Never trade volatile openings with unhedged market orders.',
      'Always set an invalidation point before entering any position.',
    ],
    veloraToolAction: {
      label: 'Practice Order Placement',
      href: '/trade',
    },
  },
  {
    id: 'position-sizing-risk',
    category: 'trading',
    title: 'Position Sizing & The 1% Risk Rule',
    subtitle: 'The mathematical cornerstone of sustainable trading longevity.',
    readTime: '6 min',
    summary: 'Never risk more than 1% to 2% of your total account equity on any single trade setup.',
    content: [
      'Professional trading is a business of risk management and probabilistic edges, not fortune-telling. The single most important calculation is Position Size.',
      'The 1% Rule Formula: Position Size = (Account Equity × Max Risk %) / (Entry Price - Stop Loss Price).',
      'Example: With ₹100,000 virtual capital, a 1% risk allows a maximum loss of ₹1,000. If you buy a stock at ₹500 with a stop loss at ₹480 (₹20 risk per share), your maximum position size is ₹1,000 / ₹20 = 50 shares.',
      'Risk-to-Reward Ratio: Target minimum 1:2 or 1:3 R:R setups so that you remain profitable even with a 40% win rate.',
    ],
    keyTakeaways: [
      'Position size determines survival; leverage amplifies both errors and gains.',
      'Adhere strictly to pre-calculated stops without emotional renegotiation.',
    ],
    veloraToolAction: {
      label: 'Check Portfolio Buying Power',
      href: '/portfolio',
    },
  },
  {
    id: 'trading-psychology',
    category: 'trading',
    title: 'Trading Psychology: Conquering FOMO & Revenge Trading',
    subtitle: 'Mastering emotional discipline and cognitive biases.',
    readTime: '5 min',
    summary: 'Eliminate fear of missing out (FOMO) and avoid revenge trading after drawdowns through structured checklists.',
    content: [
      'Over 90% of retail trading failure originates from psychological failure rather than analytical incompetence.',
      'FOMO (Fear Of Missing Out): Entering extended parabolic rallies near highs after seeing peers boast gains. The remedy: Wait patiently for pullbacks to established support levels.',
      'Revenge Trading: Doubling down or taking impulsive oversized trades immediately following a loss to "get back to even". The remedy: Enforce a mandatory 30-minute cooldown or daily max loss circuit breaker.',
    ],
    keyTakeaways: [
      'Treat every individual trade as simply 1 of the next 1,000 statistical trials.',
      'Log trade rationale in your journal before clicking execute.',
    ],
    veloraToolAction: {
      label: 'Review Your Trade History',
      href: '/transactions',
    },
  },

  // 3. TECHNICAL ANALYSIS MODULE
  {
    id: 'candlestick-anatomy',
    category: 'technical',
    title: 'Candlestick Chart Anatomy & Key Formations',
    subtitle: 'Reading buyer and seller price action auction dynamics.',
    readTime: '6 min',
    summary: 'Candlesticks show Open, High, Low, and Close (OHLC). Wick rejections demonstrate aggressive supply or demand shifts.',
    content: [
      'Each candlestick depicts four vital price points: Open, High, Low, and Close. A green (bullish) candle indicates Close > Open; a red (bearish) candle indicates Close < Open.',
      'Wicks (Shadows) illustrate price rejection. Long lower wicks (e.g. Hammer, Pin Bar) signal that sellers pushed prices down, but aggressive buyers stepped in and regained control.',
      'Key Formations: Bullish Engulfing, Morning Star, Doji (indecision), and Bearish Shooting Star. Context is everything: a Hammer at major support carries high statistical significance, whereas in the middle of a range it is noise.',
    ],
    keyTakeaways: [
      'Long wicks reveal where institutional limit orders absorbed opposing momentum.',
      'Combine candlestick patterns with volume confirmation.',
    ],
    veloraToolAction: {
      label: 'Open TradingView Candlestick Chart',
      href: '/stocks/AAPL',
    },
  },
  {
    id: 'moving-averages-sma-ema',
    category: 'technical',
    title: 'Moving Averages: SMA vs. EMA & Golden Crosses',
    subtitle: 'Identifying institutional trend direction and dynamic support.',
    readTime: '5 min',
    summary: 'SMA 20/50/200 and EMA 20/50 filter out day-to-day noise to highlight the prevailing institutional trend direction.',
    content: [
      'Simple Moving Average (SMA): Arithmetic average of closing prices over a specified period (e.g. 20-day SMA). Smooths out volatility.',
      'Exponential Moving Average (EMA): Applies greater mathematical weighting to recent price bars, reacting faster to impending trend shifts.',
      'The Golden Cross occurs when the short-term 50-day moving average crosses above the long-term 200-day moving average, signaling the initiation of a major multi-month bull regime.',
    ],
    keyTakeaways: [
      'Trade in the direction of the 200-day moving average slope.',
      'Moving averages serve as dynamic pull-back bounce zones in trending markets.',
    ],
    veloraToolAction: {
      label: 'Toggle SMA & EMA on Chart',
      href: '/stocks/MSFT',
    },
  },
  {
    id: 'rsi-macd-bollinger',
    category: 'technical',
    title: 'RSI, MACD & Bollinger Bands Momentum Toolkit',
    subtitle: 'Detecting overextended extremes and momentum divergence.',
    readTime: '6 min',
    summary: 'Use RSI for momentum extremes and bullish/bearish divergence; MACD for trend acceleration; Bollinger Bands for volatility expansion.',
    content: [
      'RSI (Relative Strength Index): Oscillates between 0 and 100. Values above 70 indicate overbought conditions; values below 30 indicate oversold conditions. Look for Bullish Divergence (price makes lower low, RSI makes higher low).',
      'MACD (Moving Average Convergence Divergence): Measures the relationship between the 12-day and 26-day EMAs. Signal line crossovers and histogram expansion confirm momentum bursts.',
      'Bollinger Bands: An envelope plotted at 2 standard deviations around a 20-day SMA. A "Bollinger Squeeze" (bands narrowing tightly) precedes explosive directional volatility breakouts.',
    ],
    keyTakeaways: [
      'Do not short solely because RSI > 70 in a strong trending bull market.',
      'Combine Bollinger Band breakout with rising volume for high-probability continuation.',
    ],
    veloraToolAction: {
      label: 'Configure RSI & MACD Indicators',
      href: '/stocks/NVDA',
    },
  },

  // 4. FUNDAMENTAL ANALYSIS MODULE
  {
    id: 'financial-statements',
    category: 'fundamental',
    title: 'Reading the Big Three Financial Statements',
    subtitle: 'Income Statement, Balance Sheet, and Statement of Cash Flows.',
    readTime: '6 min',
    summary: 'Understand how top-line revenue converts into bottom-line net profit and actual operating cash flow.',
    content: [
      'Income Statement: Details Revenue (top line), Gross Profit, Operating Expenses (EBITDA), and Net Income (bottom line) over a reporting quarter or fiscal year.',
      'Balance Sheet: A point-in-time snapshot of the accounting equation: Assets = Liabilities + Shareholders Equity. Highlights working capital, debt leverage, and book value.',
      'Cash Flow Statement: The ultimate source of truth. Reconciles Net Income with actual cash inflows and outflows through Operating Activities, Capital Expenditures (CapEx), and Financing Activities.',
    ],
    keyTakeaways: [
      'Revenue is vanity, profit is sanity, but cash flow is reality.',
      'Free Cash Flow (FCF) = Operating Cash Flow - Capital Expenditures.',
    ],
    veloraToolAction: {
      label: 'Inspect Company Financials',
      href: '/stocks/RELIANCE',
    },
  },
  {
    id: 'valuation-ratios-pe-pb',
    category: 'fundamental',
    title: 'Essential Valuation Ratios: P/E, P/B, and ROE',
    subtitle: 'Determining whether a stock is attractively priced or overvalued.',
    readTime: '5 min',
    summary: 'Compare valuation multiples relative to historical averages, sectoral peers, and expected growth rates (PEG ratio).',
    content: [
      'P/E Ratio (Price-to-Earnings): Share Price / Earnings Per Share (EPS). Represents how many dollars/rupees investors are willing to pay for each unit of current annual earnings.',
      'P/B Ratio (Price-to-Book): Market Price / Book Value Per Share. Critical for evaluating asset-heavy corporations, banks, and industrials.',
      'ROE (Return on Equity): Net Income / Shareholders Equity. Measures how efficiently management reinvests shareholder capital into profitable operations (aim for > 15%).',
    ],
    keyTakeaways: [
      'A low P/E is not automatically a bargain (beware of value traps).',
      'High-growth tech companies trade at higher multiples due to rapid earnings expansion.',
    ],
    veloraToolAction: {
      label: 'Check Valuation Multiples',
      href: '/stocks/TCS',
    },
  },

  // 5. INVESTING MODULE
  {
    id: 'power-of-compounding-sip',
    category: 'investing',
    title: 'The Eighth Wonder: Compounding & SIP Strategy',
    subtitle: 'How disciplined dollar-cost averaging builds generational wealth.',
    readTime: '5 min',
    summary: 'Systematic Investment Plans (SIP) harness Rupee/Dollar Cost Averaging to eliminate market timing anxiety.',
    content: [
      'Albert Einstein allegedly called compound interest the eighth wonder of the world: "He who understands it, earns it; he who doesn\u2019t, pays it."',
      'Systematic Investment Plan (SIP): Investing a fixed sum at regular intervals (e.g. ₹10,000 monthly) regardless of short-term market fluctuations.',
      'Dollar/Rupee Cost Averaging automatically buys more units when prices decline and fewer units when prices are elevated, smoothing out your average acquisition cost over market cycles.',
    ],
    keyTakeaways: [
      'Time in the market consistently beats attempting to time the market.',
      'Starting 5 years earlier exponentially increases final compound portfolio value.',
    ],
    veloraToolAction: {
      label: 'Track Virtual Portfolio Growth',
      href: '/portfolio',
    },
  },
  {
    id: 'asset-allocation-etfs',
    category: 'investing',
    title: 'Strategic Asset Allocation & Low-Cost Index ETFs',
    subtitle: 'Constructing an all-weather portfolio across equities, debt, and gold.',
    readTime: '5 min',
    summary: 'Diversify across uncorrelated asset classes to minimize portfolio volatility and maximize risk-adjusted Sharpe ratios.',
    content: [
      'Asset Allocation determines over 85% of total long-term portfolio return variability.',
      'Exchange-Traded Funds (ETFs) allow you to buy an entire index (e.g. NIFTY 50 ETF, S&P 500 ETF) in a single transaction with fractional management expense ratios (< 0.10%).',
      'The Core-Satellite Framework: Place 70-80% of capital into broad-market index ETFs (Core), and allocate the remaining 20-30% to high-conviction thematic growth stocks (Satellite).',
    ],
    keyTakeaways: [
      'Diversification protects against company-specific catastrophic bankruptcy risk.',
      'Rebalance portfolio weights annually to lock in gains and buy discounted assets.',
    ],
    veloraToolAction: {
      label: 'View Market Breadth',
      href: '/markets',
    },
  },
];
