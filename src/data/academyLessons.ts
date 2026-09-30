/**
 * Velora Markets — Comprehensive Interactive Academy & Gamification Curriculum
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseQuiz {
  id: string;
  title: string;
  passingScore: number; // e.g. 75
  coinReward: number; // e.g. 100
  questions: QuizQuestion[];
}

export interface AcademyLesson {
  id: string;
  courseId: string;
  title: string;
  subtitle: string;
  readTime: string;
  summary: string;
  videoUrl?: string; // YouTube embed URL
  content: string[];
  keyTakeaways: string[];
  formulasOrMetrics?: { label: string; formula: string; note: string }[];
  veloraToolAction?: {
    label: string;
    href: string;
  };
}

export interface AcademyCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  lessons: AcademyLesson[];
  quiz: CourseQuiz;
}

export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: 'fundamentals',
    title: 'Stock Market Fundamentals',
    category: 'Foundations',
    description: 'Master how modern financial markets operate, market participants, order matching engines, and exchange mechanics.',
    icon: 'GraduationCap',
    color: '#3B82F6',
    lessons: [
      {
        id: 'fundamentals-1',
        courseId: 'fundamentals',
        title: 'How Stock Markets Function',
        subtitle: 'The ecosystem of buyers, sellers, market makers, and clearing corporations',
        readTime: '5 min',
        videoUrl: 'https://www.youtube.com/embed/p7HKvqRI_Bo',
        summary: 'Understand the primary role of stock exchanges as public liquidity hubs connecting companies raising equity with capital allocators.',
        content: [
          'A stock exchange (such as the NSE, BSE, NASDAQ, or NYSE) is an electronic marketplace where shares of publicly listed companies are traded between investors. The core function is price discovery through a continuous double auction mechanism.',
          'When you place a buy or sell order, your broker transmits your order to the exchange matching engine. If a matching counterparty order exists, an execution occurs at the best bid/ask price.',
          'Behind the scenes, clearing corporations (such as NSCCL or DTCC) act as central counterparties, guaranteeing settlement (usually T+1 in modern financial markets) and eliminating counterparty default risk.',
        ],
        keyTakeaways: [
          'Exchanges provide centralized liquidity, standardized rules, and continuous price discovery.',
          'The order book matches bids (buyers) and asks (sellers) using price-time priority.',
          'T+1 settlement ensures shares and funds settle within 24 hours of trade execution.',
        ],
        formulasOrMetrics: [
          { label: 'Bid-Ask Spread', formula: 'Spread = Best Ask - Best Bid', note: 'Narrower spread indicates higher liquidity and lower transaction slippage.' },
        ],
        veloraToolAction: { label: 'Explore Live Markets', href: '/markets' },
      },
      {
        id: 'fundamentals-2',
        courseId: 'fundamentals',
        title: 'Primary vs Secondary Markets & IPOs',
        subtitle: 'Capital creation vs open-market share transfers',
        readTime: '6 min',
        videoUrl: 'https://www.youtube.com/embed/F3QpgXBtDeo',
        summary: 'Explore how companies issue initial shares via Initial Public Offerings (IPO) before they trade freely on the secondary market.',
        content: [
          'The Primary Market is where new securities are created and sold directly by the issuing corporation to institutional and retail investors. An Initial Public Offering (IPO) allows a private company to raise fresh equity capital to fund expansion, reduce debt, or provide an exit for early venture investors.',
          'Once shares are allocated in the primary market, they list on the stock exchange and begin trading on the Secondary Market. In the secondary market, trades happen exclusively between investors; the issuing company receives no proceeds from secondary trades.',
        ],
        keyTakeaways: [
          'Primary market = Company issues new shares and receives funds directly.',
          'Secondary market = Investors trade existing shares with each other for liquidity.',
          'Book building determines the issue price based on institutional demand.',
        ],
      },
    ],
    quiz: {
      id: 'quiz-fundamentals',
      title: 'Stock Market Fundamentals Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-f-1',
          question: 'What is the primary function of a stock exchange matching engine?',
          options: [
            'To set fixed stock prices arbitrarily at 9:00 AM',
            'To match buyer bids and seller asks using price-time priority',
            'To lend money directly to traders',
            'To guarantee 100% daily profit for all participants',
          ],
          correctIndex: 1,
          explanation: 'The electronic order matching engine executes trades by matching the highest buy order (bid) with the lowest sell order (ask) using price-time priority.',
        },
        {
          id: 'q-f-2',
          question: 'What happens to the proceeds when you buy 100 shares of Apple (AAPL) on the secondary market?',
          options: [
            'Apple receives 100% of the funds in their corporate bank account',
            'The seller who sold the shares receives the funds, minus brokerage fees',
            'The exchange keeps the entire amount as profit',
            'The government receives the entire share price as tax',
          ],
          correctIndex: 1,
          explanation: 'In the secondary market, transactions are peer-to-peer between investors. The seller receives the capital from the buyer.',
        },
        {
          id: 'q-f-3',
          question: 'What does a narrow Bid-Ask spread signify?',
          options: [
            'High liquidity and efficient trade execution with low slippage',
            'The market is about to crash',
            'The company is in financial distress',
            'Zero buyers are present in the order book',
          ],
          correctIndex: 0,
          explanation: 'A tight bid-ask spread indicates deep liquidity where many buyers and sellers are competing closely at market prices.',
        },
        {
          id: 'q-f-4',
          question: 'What is the standard trade settlement cycle in modern Indian equity markets?',
          options: ['T+30 days', 'T+7 days', 'T+1 day', 'Instant T+0 only with paper certificates'],
          correctIndex: 2,
          explanation: 'India and US markets operate primarily on a T+1 (Trade date plus one business day) rolling settlement cycle.',
        },
      ],
    },
  },

  {
    id: 'exchanges',
    title: 'Stocks & Exchanges',
    category: 'Foundations',
    description: 'Understand equity share classes, market capitalization tiers, corporate actions, and trading sessions.',
    icon: 'Building2',
    color: '#6366F1',
    lessons: [
      {
        id: 'exchanges-1',
        courseId: 'exchanges',
        title: 'Market Capitalization & Share Classes',
        subtitle: 'Large Cap, Mid Cap, Small Cap, and voting rights',
        readTime: '5 min',
        summary: 'Learn how companies are categorized by enterprise scale and what common equity ownership represents.',
        content: [
          'Market Capitalization represents the total equity valuation of a listed company. It is calculated by multiplying total outstanding shares by the current market price per share.',
          'Large Cap companies (often market cap > ₹20,000 Cr or $10B) are mature market leaders with proven stability and lower volatility.',
          'Mid Cap and Small Cap companies offer higher growth potential but carry greater volatility and business lifecycle risks.',
        ],
        keyTakeaways: [
          'Market Cap = Total Outstanding Shares × Current Market Price.',
          'Large Caps provide stability; Small Caps offer high growth potential with higher risk.',
          'Equity shares confer fractional ownership and voting rights.',
        ],
        formulasOrMetrics: [
          { label: 'Market Cap', formula: 'Market Cap = Shares Outstanding × Current Price', note: 'Determines the weight of the stock in market indices like NIFTY 50 and S&P 500.' },
        ],
      },
      {
        id: 'exchanges-2',
        courseId: 'exchanges',
        title: 'Corporate Actions: Dividends, Splits & Bonus',
        subtitle: 'How corporate announcements adjust stock prices and share counts',
        readTime: '6 min',
        summary: 'Understand stock splits, bonus shares, record dates, and dividend yield mechanics.',
        content: [
          'A Stock Split increases the number of shares while decreasing the price per share proportionally (e.g., a 2-for-1 split doubles shares and halves the price), keeping total investment value unchanged while improving liquidity.',
          'Dividends represent profit distributions to shareholders. The Ex-Date is the cutoff date; anyone buying on or after the Ex-Date does not receive the declared dividend.',
        ],
        keyTakeaways: [
          'Stock splits increase liquidity without altering fundamental company valuation.',
          'Dividends are paid from company net profits or retained earnings.',
          'Stock price automatically adjusts downward on the ex-dividend date by the dividend amount.',
        ],
      },
    ],
    quiz: {
      id: 'quiz-exchanges',
      title: 'Stocks & Exchanges Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-e-1',
          question: 'If a company has 10 million shares outstanding priced at ₹500 each, what is its Market Capitalization?',
          options: ['₹50 Crore', '₹500 Crore', '₹5,000 Crore', '₹50,000 Crore'],
          correctIndex: 1,
          explanation: '10,000,000 shares × ₹500 = ₹5,000,000,000 = ₹500 Crore.',
        },
        {
          id: 'q-e-2',
          question: 'If you own 50 shares of a stock priced at ₹1,000 and it executes a 5-for-1 stock split, what do you own after?',
          options: [
            '250 shares priced at ₹200 each (Total value ₹50,000)',
            '50 shares priced at ₹200 each (Total value ₹10,000)',
            '250 shares priced at ₹1,000 each (Total value ₹250,000)',
            '10 shares priced at ₹5,000 each',
          ],
          correctIndex: 0,
          explanation: 'A 5:1 split multiplies your shares by 5 (50 × 5 = 250) and divides share price by 5 (₹1,000 / 5 = ₹200). Your total capital remains ₹50,000.',
        },
        {
          id: 'q-e-3',
          question: 'To receive a declared corporate dividend, when must you buy the shares?',
          options: [
            'Before the Ex-Dividend Date',
            'After the Record Date',
            'On the Payment Date only',
            'At the end of the fiscal year',
          ],
          correctIndex: 0,
          explanation: 'You must purchase the stock before the Ex-Dividend date to be recorded on the company shareholder register on the Record Date.',
        },
        {
          id: 'q-e-4',
          question: 'Which of the following is a primary index of the US stock market?',
          options: ['NIFTY 50', 'S&P 500', 'FTSE 100', 'DAX 40'],
          correctIndex: 1,
          explanation: 'The S&P 500 is the benchmark index representing 500 of the largest listed US companies on NASDAQ and NYSE.',
        },
      ],
    },
  },

  {
    id: 'candlesticks',
    title: 'Candlesticks & Charts',
    category: 'Technical',
    description: 'Master reading OHLCV price action, Japanese candlestick anatomy, and high-probability reversal patterns.',
    icon: 'CandlestickChart',
    color: '#10B981',
    lessons: [
      {
        id: 'candlesticks-1',
        courseId: 'candlesticks',
        title: 'Anatomy of Japanese Candlesticks',
        subtitle: 'Open, High, Low, Close (OHLC), Real Body, and Wicks',
        readTime: '6 min',
        videoUrl: 'https://www.youtube.com/embed/C3U_mN7H2kI',
        summary: 'Learn how each candlestick visualizes the battle between buyers (bulls) and sellers (bears) during a specific timeframe.',
        content: [
          'A Japanese candlestick encapsulates four key data points for any given period (e.g., 1 min, 5 min, 1 day): Open, High, Low, and Close.',
          'The colored central area is the Real Body. Green (or white) signifies a bullish bar where Close > Open. Red signifies a bearish bar where Close < Open.',
          'The upper shadow (wick) shows the session high, while the lower shadow shows the session low. Long lower shadows indicate strong buying rejection at lower prices.',
        ],
        keyTakeaways: [
          'Green candle = Bullish (Close > Open); Red candle = Bearish (Close < Open).',
          'Wicks display price extremes and intraday rejection of price levels.',
          'A large body reflects strong directional momentum and institutional commitment.',
        ],
        veloraToolAction: { label: 'View Interactive Candlestick Chart', href: '/stocks/RELIANCE' },
      },
      {
        id: 'candlesticks-2',
        courseId: 'candlesticks',
        title: 'Single & Multi-Candle Reversal Patterns',
        subtitle: 'Doji, Hammer, Shooting Star, Bullish Engulfing, and Morning Star',
        readTime: '7 min',
        videoUrl: 'https://www.youtube.com/embed/fD_0aM5iLz4',
        summary: 'Identify actionable chart patterns that signal impending momentum shifts and trend reversals.',
        content: [
          'A Hammer forms at the bottom of a downtrend with a small upper body and a long lower shadow (at least 2x the body length), signaling aggressive buyers absorbing supply.',
          'A Shooting Star forms at the top of an uptrend with a long upper wick, indicating buyers failed to sustain higher prices.',
          'A Bullish Engulfing pattern occurs when a large green candle completely engulfs the real body of the prior red candle, indicating a dramatic shift in market control.',
        ],
        keyTakeaways: [
          'Hammer at support = Bullish reversal setup.',
          'Shooting star at resistance = Bearish reversal setup.',
          'Candlestick patterns require volume confirmation and key support/resistance confluence.',
        ],
      },
    ],
    quiz: {
      id: 'quiz-candlesticks',
      title: 'Candlesticks & Charts Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-c-1',
          question: 'What does a candlestick with a very long lower shadow and tiny upper body at a major support level indicate?',
          options: [
            'Hammer candle: Strong buyer rejection of lower prices (Bullish signal)',
            'Shooting star: Strong seller domination',
            'Neutral doji with no trading volume',
            'Guaranteed stock bankruptcy',
          ],
          correctIndex: 0,
          explanation: 'A long lower shadow indicates that sellers drove prices down, but buyers aggressively stepped in and pushed prices back up to close near the top.',
        },
        {
          id: 'q-c-2',
          question: 'In a standard candlestick chart, what does a red candle indicate?',
          options: [
            'The closing price was lower than the opening price (Close < Open)',
            'The stock increased in value by 10%',
            'The stock was halted by the exchange',
            'Trading volume was equal to zero',
          ],
          correctIndex: 0,
          explanation: 'A red candle represents a session where sellers had control, causing the closing price to be below the opening price.',
        },
        {
          id: 'q-c-3',
          question: 'What is a "Doji" candlestick pattern characterized by?',
          options: [
            'Open and Close prices are almost identical, reflecting market indecision',
            'An extremely large green body with no wicks',
            'A 100% gap up on market opening',
            'A single horizontal line representing halted trading',
          ],
          correctIndex: 0,
          explanation: 'A Doji has virtually the same open and close price, showing equilibrium and indecision between buyers and sellers.',
        },
        {
          id: 'q-c-4',
          question: 'What constitutes a Bullish Engulfing pattern?',
          options: [
            'A large green candle whose real body completely covers the preceding small red candle body',
            'Two consecutive red candles making lower lows',
            'A candle with no upper or lower wicks',
            'A gap down that continues falling all day',
          ],
          correctIndex: 0,
          explanation: 'A Bullish Engulfing pattern signals buyer takeover when the current green bar completely covers the prior red bar.',
        },
      ],
    },
  },

  {
    id: 'indicators',
    title: 'Technical Indicators',
    category: 'Technical',
    description: 'Understand trend following, momentum oscillators, volume analytics, and volatility bands.',
    icon: 'TrendingUp',
    color: '#06B6D4',
    lessons: [
      {
        id: 'indicators-1',
        courseId: 'indicators',
        title: 'Moving Averages: SMA, EMA & Golden Cross',
        subtitle: 'Dynamic trend filters and momentum crossovers',
        readTime: '6 min',
        videoUrl: 'https://www.youtube.com/embed/n3eJ_J32d5Y',
        summary: 'Learn how Simple Moving Averages (SMA) and Exponential Moving Averages (EMA) smooth noise to highlight primary trends.',
        content: [
          'A Simple Moving Average (SMA) calculates the arithmetic mean of closing prices over a specific period (e.g., 20, 50, 200 days).',
          'An Exponential Moving Average (EMA) assigns greater weight to recent price data, making it faster to respond to recent price action.',
          'A Golden Cross occurs when a short-term moving average (e.g., 50 EMA) crosses above a long-term moving average (e.g., 200 SMA), signaling sustained bullish momentum. A Death Cross is the opposite.',
        ],
        keyTakeaways: [
          'EMA reacts faster than SMA to recent price changes.',
          '50 EMA above 200 SMA = Bullish market structure (Golden Cross).',
          'Moving averages act as dynamic support during uptrends.',
        ],
        formulasOrMetrics: [
          { label: 'SMA Calculation', formula: 'SMA = (P1 + P2 + ... + Pn) / n', note: 'Standard reference period: 20-day (short-term), 50-day (medium-term), 200-day (long-term).' },
        ],
        veloraToolAction: { label: 'Open Technical Indicators on Charts', href: '/markets' },
      },
      {
        id: 'indicators-2',
        courseId: 'indicators',
        title: 'Momentum & Volatility: RSI, MACD & Bollinger Bands',
        subtitle: 'Oscillators, divergences, and volatility expansion',
        readTime: '7 min',
        videoUrl: 'https://www.youtube.com/embed/F4q9t7N382I',
        summary: 'Master using Relative Strength Index (RSI), MACD momentum, and Bollinger Bands standard deviation envelopes.',
        content: [
          'The Relative Strength Index (RSI) measures the velocity and magnitude of directional price movement on a scale of 0 to 100. Traditional levels consider RSI > 70 as Overbought and RSI < 30 as Oversold.',
          'Bullish Divergence occurs when price makes a lower low while RSI makes a higher low, warning of an impending upward reversal.',
          'Bollinger Bands consist of a 20-period SMA and upper/lower bands plotted 2 standard deviations away. A "Bollinger Squeeze" precedes major volatility breakouts.',
        ],
        keyTakeaways: [
          'RSI > 70 = Overbought; RSI < 30 = Oversold.',
          'Divergences between price and RSI provide early trend reversal warnings.',
          'Bollinger Squeezes indicate volatility compression ready for a breakout.',
        ],
      },
    ],
    quiz: {
      id: 'quiz-indicators',
      title: 'Technical Indicators Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-i-1',
          question: 'What is a "Golden Cross" in technical analysis?',
          options: [
            'A 50-period moving average crossing above a 200-period moving average (Bullish signal)',
            'A 50-period moving average crossing below a 200-period moving average (Bearish signal)',
            'RSI dropping below 10',
            'A stock paying a special gold dividend',
          ],
          correctIndex: 0,
          explanation: 'A Golden Cross is a widely followed long-term bullish signal where shorter-term momentum overcomes long-term resistance.',
        },
        {
          id: 'q-i-2',
          question: 'If a stock price creates a lower low while the RSI indicator creates a higher low, what is this called?',
          options: ['Bullish Divergence', 'Bearish Convergence', 'Death Cross', 'False Breakdown'],
          correctIndex: 0,
          explanation: 'Bullish divergence shows that downward price momentum is exhausting even though prices made a lower low.',
        },
        {
          id: 'q-i-3',
          question: 'What is the mathematical width of standard Bollinger Bands around the 20 SMA?',
          options: [
            '± 2 Standard Deviations',
            '± 50 Rupees fixed',
            '± 10% regardless of volatility',
            '± 0.5 Moving Average points',
          ],
          correctIndex: 0,
          explanation: 'Standard Bollinger Bands use 2 standard deviations, capturing approximately 95% of normal price distribution.',
        },
        {
          id: 'q-i-4',
          question: 'Why do traders often prefer the Exponential Moving Average (EMA) over the Simple Moving Average (SMA) for intraday trading?',
          options: [
            'EMA gives higher weight to recent prices, reducing lag',
            'EMA is always higher in value than SMA',
            'EMA eliminates all losses completely',
            'EMA requires no mathematical formula',
          ],
          correctIndex: 0,
          explanation: 'The weighting multiplier in EMA places greater emphasis on recent price data, making it more responsive to fresh price moves.',
        },
      ],
    },
  },

  {
    id: 'fundamental_analysis',
    title: 'Fundamental Analysis',
    category: 'Analysis',
    description: 'Learn to read balance sheets, calculate valuation multiples, and evaluate corporate cash flows.',
    icon: 'FileSpreadsheet',
    color: '#8B5CF6',
    lessons: [
      {
        id: 'fa-1',
        courseId: 'fundamental_analysis',
        title: 'The Three Financial Statements',
        subtitle: 'Balance Sheet, Income Statement (P&L), and Cash Flow Statement',
        readTime: '7 min',
        videoUrl: 'https://www.youtube.com/embed/5a39VIdTjFs',
        summary: 'Understand how revenues convert into net earnings and free cash flows across corporate financial statements.',
        content: [
          'The Income Statement shows revenue generated, cost of goods sold (COGS), operating expenses, and net profit over a reporting quarter or fiscal year.',
          'The Balance Sheet shows assets owned (cash, plant, inventory), liabilities owed (debt, payables), and shareholder equity at a specific snapshot in time: Assets = Liabilities + Equity.',
          'The Cash Flow Statement tracks actual cash generated from operations, investments, and financing activities. Free Cash Flow (Operating Cash Flow - Capital Expenditures) represents true economic surplus.',
        ],
        keyTakeaways: [
          'Accounting profit (P&L) does not equal actual cash generated (Cash Flow).',
          'Assets must always equal Liabilities plus Shareholder Equity.',
          'Free Cash Flow is the primary driver of intrinsic business value.',
        ],
        formulasOrMetrics: [
          { label: 'Free Cash Flow (FCF)', formula: 'FCF = Operating Cash Flow - Capital Expenditures (CapEx)', note: 'Surplus cash available for dividends, buybacks, or debt retirement.' },
        ],
      },
      {
        id: 'fa-2',
        courseId: 'fundamental_analysis',
        title: 'Core Valuation Multiples: P/E, P/B, EV/EBITDA & ROE',
        subtitle: 'Comparing market price against earnings power and capital efficiency',
        readTime: '6 min',
        summary: 'Learn how to benchmark stock valuations against industry peers and historical multiples.',
        content: [
          'The Price-to-Earnings (P/E) Ratio divides current share price by annual Earnings Per Share (EPS). A lower P/E relative to peer growth rates may indicate undervalued shares.',
          'Return on Equity (ROE = Net Income / Shareholder Equity) measures how effectively management reinvests shareholder capital to generate profits.',
          'Debt-to-Equity assesses financial leverage; excessive leverage increases bankruptcy risk during economic contractions.',
        ],
        keyTakeaways: [
          'P/E ratio compares market price with company earnings power.',
          'ROE above 15-20% indicates a strong competitive advantage (economic moat).',
          'Low debt-to-equity protects the company during industry downturns.',
        ],
        formulasOrMetrics: [
          { label: 'P/E Ratio', formula: 'P/E = Market Price per Share / Earnings Per Share (EPS)', note: 'Indicates how many rupees/dollars investors are willing to pay for ₹1/$1 of earnings.' },
          { label: 'Return on Equity (ROE)', formula: 'ROE = (Net Income / Total Shareholder Equity) × 100', note: 'Benchmarks capital allocation efficiency.' },
        ],
        veloraToolAction: { label: 'Analyze Financial Ratios', href: '/stocks/TCS' },
      },
    ],
    quiz: {
      id: 'quiz-fa',
      title: 'Fundamental Analysis Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-fa-1',
          question: 'What is the fundamental accounting equation represented on the Balance Sheet?',
          options: [
            'Assets = Liabilities + Shareholder Equity',
            'Assets = Net Income - Taxes',
            'Revenue = Expenses + Debt',
            'Equity = Assets × Liabilities',
          ],
          correctIndex: 0,
          explanation: 'The balance sheet must always balance: every asset is funded either by debt (liabilities) or owners capital (shareholder equity).',
        },
        {
          id: 'q-fa-2',
          question: 'How is the Price-to-Earnings (P/E) ratio calculated?',
          options: [
            'Stock Price per Share / Earnings Per Share (EPS)',
            'Total Revenue / Total Debt',
            'Operating Cash Flow / Market Cap',
            'Dividend Yield × Book Value',
          ],
          correctIndex: 0,
          explanation: 'P/E ratio divides current market price per share by the annual earnings per share (EPS).',
        },
        {
          id: 'q-fa-3',
          question: 'Why is Free Cash Flow (FCF) often considered a cleaner metric than Net Accounting Income?',
          options: [
            'FCF measures real cash generated after CapEx, making it harder to manipulate with accounting estimates',
            'FCF is always double the net profit',
            'FCF guarantees zero taxes will be paid',
            'FCF only applies to government bonds',
          ],
          correctIndex: 0,
          explanation: 'Free cash flow tracks actual physical cash inflow and outflow, whereas net income includes non-cash items and revenue recognition timing.',
        },
        {
          id: 'q-fa-4',
          question: 'What does a consistently high Return on Equity (ROE > 20%) suggest about a company?',
          options: [
            'Management efficiently generates strong returns on invested shareholder capital',
            'The company has no customers',
            'The stock is legally forbidden from paying dividends',
            'The company has zero assets',
          ],
          correctIndex: 0,
          explanation: 'High ROE demonstrates that the company possesses high pricing power and capital efficiency, generating high earnings per unit of equity.',
        },
      ],
    },
  },

  {
    id: 'risk_management',
    title: 'Risk Management',
    category: 'Risk & Strategy',
    description: 'Protect your capital with position sizing rules, stop-loss calculations, and risk-to-reward ratios.',
    icon: 'ShieldCheck',
    color: '#EF4444',
    lessons: [
      {
        id: 'rm-1',
        courseId: 'risk_management',
        title: 'The 1-2% Risk Rule & Position Sizing',
        subtitle: 'Never risk more than 1-2% of total trading capital on any single setup',
        readTime: '6 min',
        videoUrl: 'https://www.youtube.com/embed/5A05a6jM_00',
        summary: 'Learn the mathematical formula to calculate exact share quantities based on account equity and stop loss distance.',
        content: [
          'Professional traders do not measure success by win rate alone; they focus on capital preservation. The 1% Risk Rule dictates that if a trade hits your stop loss, you lose no more than 1% of total portfolio capital.',
          'Position Size is calculated using: Quantity = (Total Capital × Risk %) / (Entry Price - Stop Loss Price).',
          'Following this rule prevents account ruin even during an unexpected sequence of 10 consecutive losing trades.',
        ],
        keyTakeaways: [
          'Risk per trade = Maximum acceptable capital loss if stop-loss is triggered.',
          'Position size must adapt to the stop loss distance, not vice versa.',
          'Risk management is what separates professional trading from gambling.',
        ],
        formulasOrMetrics: [
          { label: 'Position Size Formula', formula: 'Shares = (Account Balance × Max Risk %) / (Entry - Stop Loss)', note: 'Example: On ₹100,000 capital with 1% risk (₹1,000), if Entry = ₹500 and SL = ₹480 (₹20 risk/share), Quantity = 1,000 / 20 = 50 shares.' },
        ],
        veloraToolAction: { label: 'Practice Risk Management in Virtual Portfolio', href: '/trade' },
      },
      {
        id: 'rm-2',
        courseId: 'risk_management',
        title: 'Risk-to-Reward Ratios & Asymmetric Payoffs',
        subtitle: 'Why a 40% win rate can produce compounding profits with 1:2 and 1:3 setups',
        readTime: '6 min',
        summary: 'Understand the power of positive expectancy and why losing small and winning big creates profitable long-term outcomes.',
        content: [
          'Risk-to-Reward (R:R) compares potential downside against projected profit target. A minimum 1:2 R:R ratio means for every ₹1 risked, the target profit is ₹2.',
          'With a 1:2 R:R ratio, you only need to win 34% of your trades to break even. At a 50% win rate, your portfolio compounds steadily.',
        ],
        keyTakeaways: [
          'Always establish entry, stop loss, and target before executing any order.',
          'Avoid taking trades with an R:R of less than 1:1.5.',
          'Cut losing trades quickly without emotional attachment.',
        ],
      },
    ],
    quiz: {
      id: 'quiz-rm',
      title: 'Risk Management Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-rm-1',
          question: 'If you have a ₹100,000 trading portfolio and follow the 1% risk rule, what is the maximum amount you can lose on a single trade?',
          options: ['₹1,000', '₹10,000', '₹500', '₹50,000'],
          correctIndex: 0,
          explanation: '1% of ₹100,000 = ₹1,000 maximum risk on the trade.',
        },
        {
          id: 'q-rm-2',
          question: 'If you buy a stock at ₹200 with a Stop Loss at ₹190, and your maximum risk is ₹1,000, how many shares should you buy?',
          options: ['100 shares', '500 shares', '10 shares', '1,000 shares'],
          correctIndex: 0,
          explanation: 'Risk per share = ₹200 - ₹190 = ₹10. Total shares = ₹1,000 maximum risk / ₹10 risk per share = 100 shares.',
        },
        {
          id: 'q-rm-3',
          question: 'With a 1:3 Risk-to-Reward ratio, what minimum win rate is needed to break even?',
          options: ['25%', '50%', '75%', '90%'],
          correctIndex: 0,
          explanation: 'With 1:3, losing 3 trades of ₹1 (-₹3) is offset by winning 1 trade (+₹3). 1 win out of 4 trades = 25% win rate to break even.',
        },
        {
          id: 'q-rm-4',
          question: 'What is the primary danger of removing or moving your stop-loss further away during an active loss?',
          options: [
            'It transforms a controlled risk into an uncontrolled catastrophic loss',
            'It forces your broker to double your commissions',
            'It legally invalidates your tax returns',
            'It triggers an automatic dividend',
          ],
          correctIndex: 0,
          explanation: 'Moving a stop-loss is an emotional violation of risk management that frequently leads to large account drawdowns.',
        },
      ],
    },
  },

  {
    id: 'trading_psychology',
    title: 'Trading Psychology',
    category: 'Risk & Strategy',
    description: 'Master discipline, overcome FOMO, revenge trading, and emotional cognitive biases.',
    icon: 'Brain',
    color: '#EC4899',
    lessons: [
      {
        id: 'psy-1',
        courseId: 'trading_psychology',
        title: 'Mastering FOMO, Greed & Revenge Trading',
        subtitle: 'The psychological traps that cause retail account blowups',
        readTime: '5 min',
        videoUrl: 'https://www.youtube.com/embed/fD_0aM5iLz4',
        summary: 'Identify the emotional triggers behind impulse trading and build psychological barriers against revenge trading.',
        content: [
          'Fear of Missing Out (FOMO) causes traders to buy parabolic tops when a stock has already extended beyond logical risk-reward entry points.',
          'Revenge Trading happens after taking a painful loss, when the trader immediately enters larger, unplanned positions to win back money.',
          'Professional traders view individual trades as probabilistic statistics in a large sample set rather than personal validation.',
        ],
        keyTakeaways: [
          'Never enter a trade out of boredom or FOMO.',
          'Accept losses as regular business operating expenses.',
          'Step away from screens after hitting a daily loss limit.',
        ],
      },
      {
        id: 'psy-2',
        courseId: 'trading_psychology',
        title: 'Building a Disciplined Trading Journal',
        subtitle: 'Tracking trade rationale, emotions, execution quality, and mistakes',
        readTime: '5 min',
        summary: 'Why consistent trade logging is the fastest catalyst for trader profitability.',
        content: [
          'A Trading Journal records every executed order, entry setup, planned stop-loss, target, actual exit, screenshot of chart, and psychological state.',
          'Reviewing your journal weekly reveals personal blind spots, such as cutting winners too early or holding losers past stop losses.',
        ],
        keyTakeaways: [
          'What gets measured gets improved.',
          'Review losing trades to identify recurring behavioral patterns.',
          'Stick to your checklist before clicking buy or sell.',
        ],
      },
    ],
    quiz: {
      id: 'quiz-psy',
      title: 'Trading Psychology Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-p-1',
          question: 'What is "Revenge Trading"?',
          options: [
            'Immediately taking impulsive, oversized trades to quickly recover a recent loss',
            'Filing a lawsuit against the exchange',
            'Trading against high-frequency trading algorithms',
            'Shorting a stock that previously paid a low dividend',
          ],
          correctIndex: 0,
          explanation: 'Revenge trading is an emotional reaction to loss where traders abandon their rules to aggressively try and win back capital.',
        },
        {
          id: 'q-p-2',
          question: 'How should a disciplined trader view a stopped-out losing trade that followed their written plan?',
          options: [
            'As an acceptable, necessary cost of doing business in a probabilistic market',
            'As personal failure requiring immediate revenge trading',
            'As proof that the stock market is rigged against them',
            'As reason to delete all trading apps forever',
          ],
          correctIndex: 0,
          explanation: 'In trading, losses that adhere to risk rules are normal probabilistic events. Consistency comes from execution quality.',
        },
        {
          id: 'q-p-3',
          question: 'What is the primary benefit of maintaining a comprehensive Trading Journal?',
          options: [
            'To identify recurring execution mistakes, emotional biases, and optimize profitable setups',
            'To show off winning trades on social media',
            'To avoid paying taxes on capital gains',
            'To guarantee 100% win rate on next week trades',
          ],
          correctIndex: 0,
          explanation: 'A trading journal provides objective empirical feedback on your trading habits and system performance.',
        },
        {
          id: 'q-p-4',
          question: 'What is Confirmation Bias in market analysis?',
          options: [
            'Seeking only news and opinions that support your existing trade while ignoring contrary risk signals',
            'Waiting for order confirmation from the broker',
            'Confirming payment with the bank',
            'Double-checking that the market is open',
          ],
          correctIndex: 0,
          explanation: 'Confirmation bias blinds traders to negative developments by filtering out evidence that conflicts with their position.',
        },
      ],
    },
  },

  {
    id: 'long_term_investing',
    title: 'Long-Term Investing',
    category: 'Wealth Building',
    description: 'Value investing principles, identifying economic moats, and building generational wealth.',
    icon: 'TrendingUp',
    color: '#10B981',
    lessons: [
      {
        id: 'lt-1',
        courseId: 'long_term_investing',
        title: 'Value Investing & Economic Moats',
        subtitle: 'Warren Buffett principles: buying quality businesses at reasonable prices',
        readTime: '6 min',
        videoUrl: 'https://www.youtube.com/embed/e_XwQf3F9XQ',
        summary: 'Learn how sustainable competitive advantages (moats) protect corporate profits against competition over decades.',
        content: [
          'An Economic Moat is a structural competitive advantage that protects a company from competitors, preserving high returns on capital.',
          'Types of moats include Brand Power (Apple), Network Effects (Visa, Google), High Switching Costs (Microsoft, SAP), and Cost Advantages (Costco, Reliance Retail).',
          'Value investing involves estimating intrinsic business value and buying with a Margin of Safety when market price temporarily disconnects from reality.',
        ],
        keyTakeaways: [
          'Invest in businesses you understand with durable competitive advantages.',
          'Margin of safety protects your downside against estimation errors.',
          'Time in the market beats timing the market for long-term compounders.',
        ],
      },
      {
        id: 'lt-2',
        courseId: 'long_term_investing',
        title: 'Index Investing & Low-Cost ETFs',
        subtitle: 'Harnessing the relentless growth of broad market indices',
        readTime: '5 min',
        summary: 'Why low-cost broad index ETFs (NIFTY 50, S&P 500) outperform the majority of active fund managers over 15+ years.',
        content: [
          'Index Funds and ETFs hold all constituent stocks in a market index proportionally. As companies grow, their index weighting increases naturally; deteriorating companies are systematically dropped.',
          'With expense ratios often below 0.1%, index funds minimize frictional drag, allowing 100% of compound market returns to accrue to the investor.',
        ],
        keyTakeaways: [
          'Low fees significantly compound long-term wealth over 20-30 years.',
          'Automatic self-cleansing: winning companies expand in the index while declining ones exit.',
          'Broad diversification reduces unsystematic single-stock bankruptcy risk.',
        ],
      },
    ],
    quiz: {
      id: 'quiz-lt',
      title: 'Long-Term Investing Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-lt-1',
          question: 'What is an "Economic Moat" in fundamental investing?',
          options: [
            'A sustainable competitive advantage that prevents rivals from eroding profitability',
            'A water barrier built around a physical corporate factory',
            'A short-term legal injunction against a competitor',
            'A high interest loan given by a central bank',
          ],
          correctIndex: 0,
          explanation: 'An economic moat represents structural advantages like network effects, brand power, patents, or switching costs that protect high returns on capital.',
        },
        {
          id: 'q-lt-2',
          question: 'What does "Margin of Safety" mean in value investing?',
          options: [
            'Purchasing an asset at a substantial discount to its intrinsic valuation to provide a cushion against future errors',
            'Keeping 100% of your net worth in physical cash under a mattress',
            'Setting a 50% stop loss on every speculative penny stock',
            'Relying exclusively on government subsidies',
          ],
          correctIndex: 0,
          explanation: 'Margin of safety provides a buffer against adverse developments and analytical mistakes.',
        },
        {
          id: 'q-lt-3',
          question: 'Why do low expense ratio index ETFs (like NIFTY 50 or S&P 500) often outperform high-fee active mutual funds over 20 years?',
          options: [
            'Lower management fee drag and automatic self-cleansing diversification',
            'They guarantee 50% annual returns without risk',
            'They trade 24 hours on weekends',
            'They never experience market downturns',
          ],
          correctIndex: 0,
          explanation: 'Active management fees and excessive turnover create drag. Low-cost passive indexing captures the compounding growth of entire economies.',
        },
        {
          id: 'q-lt-4',
          question: 'What is "Dollar-Cost / Rupee-Cost Averaging"?',
          options: [
            'Investing a fixed monetary amount at regular intervals regardless of stock price fluctuations',
            'Converting all rupees to US dollars during inflation',
            'Buying only when a stock hits its all-time high',
            'Borrowing money to double down on a losing stock',
          ],
          correctIndex: 0,
          explanation: 'Cost averaging buys more units when prices are low and fewer units when prices are high, lowering average purchase cost over time.',
        },
      ],
    },
  },

  {
    id: 'portfolio_management',
    title: 'Portfolio Management',
    category: 'Wealth Building',
    description: 'Construct core-satellite asset allocations, rebalance systematically, and manage portfolio beta.',
    icon: 'PieChart',
    color: '#F59E0B',
    lessons: [
      {
        id: 'pm-1',
        courseId: 'portfolio_management',
        title: 'Core-Satellite Asset Allocation Strategy',
        subtitle: 'Balancing passive index stability with targeted tactical alpha',
        readTime: '6 min',
        summary: 'Learn how institutional investors structure portfolios into a 70% Core index base and 30% Satellite thematic growth picks.',
        content: [
          'The Core-Satellite framework combines the stability of broad passive index funds (60-80% of capital) with the active alpha generation of concentrated high-conviction stocks or sector themes (20-40%).',
          'This structure prevents catastrophic portfolio failure while preserving opportunities to outperform benchmark averages.',
        ],
        keyTakeaways: [
          'Core = Stable, broad-market index ETFs (NIFTY 50, S&P 500).',
          'Satellite = High-conviction individual stocks and tactical sector opportunities.',
          'Minimizes drawdown risk without giving up upside potential.',
        ],
        veloraToolAction: { label: 'View Portfolio Allocation', href: '/portfolio' },
      },
      {
        id: 'pm-2',
        courseId: 'portfolio_management',
        title: 'Systematic Rebalancing & Risk Parity',
        subtitle: 'Harvesting gains and managing cross-asset risk',
        readTime: '5 min',
        summary: 'Understand annual rebalancing rules to buy low and sell high automatically across equities, debt, and gold.',
        content: [
          'Over time, higher-performing assets drift and expand their portfolio allocation percentage, increasing portfolio volatility.',
          'Periodic rebalancing (e.g., annually or when an asset drifts by ±5%) systematically sells overweight assets and reallocates capital into undervalued underweight assets.',
        ],
        keyTakeaways: [
          'Rebalancing enforces a disciplined "buy low, sell high" process without emotional timing.',
          'Asset classes: Equities (Growth), Debt/Bonds (Income & Stability), Gold (Inflation Hedge).',
        ],
      },
    ],
    quiz: {
      id: 'quiz-pm',
      title: 'Portfolio Management Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-pm-1',
          question: 'In a Core-Satellite portfolio strategy, what does the "Core" typically consist of?',
          options: [
            'Broad, diversified, low-cost index ETFs (e.g., NIFTY 50 or S&P 500)',
            'Speculative crypto meme coins',
            'Unregulated penny stocks',
            'A single illiquid startup company',
          ],
          correctIndex: 0,
          explanation: 'The core provides the foundational bedrock of stable market-matching returns across diversified industry sectors.',
        },
        {
          id: 'q-pm-2',
          question: 'What is the primary objective of annual portfolio rebalancing?',
          options: [
            'To realign asset allocations back to target risk tolerances and systematically take profits from outperformed assets',
            'To generate maximum transaction fees for brokers',
            'To sell all assets and hold zero investments',
            'To guarantee that no taxes are ever calculated',
          ],
          correctIndex: 0,
          explanation: 'Rebalancing maintains intended risk parameters and enforces buying depressed asset classes while trimming extended ones.',
        },
        {
          id: 'q-pm-3',
          question: 'Why do investors allocate capital to Gold alongside Equities in a multi-asset portfolio?',
          options: [
            'Gold serves as a non-correlated inflation hedge and crisis stabilizer',
            'Gold always yields a 20% guaranteed cash dividend quarterly',
            'Gold eliminates the need for stock research completely',
            'Gold has zero price fluctuations',
          ],
          correctIndex: 0,
          explanation: 'Gold historically exhibits low correlation to corporate equities, dampening portfolio drawdown volatility during economic shocks.',
        },
        {
          id: 'q-pm-4',
          question: 'What does a portfolio "Beta" (β) of 1.3 relative to the NIFTY 50 indicate?',
          options: [
            'The portfolio is approximately 30% more volatile than the benchmark index',
            'The portfolio is 30% less volatile than cash',
            'The portfolio is guaranteed to generate 130% profit annually',
            'The portfolio holds only 1.3 individual stocks',
          ],
          correctIndex: 0,
          explanation: 'A Beta of 1.3 indicates that when the index moves 10%, the portfolio is expected to move 13% in the same direction.',
        },
      ],
    },
  },

  {
    id: 'sip_compounding',
    title: 'SIP & Compounding',
    category: 'Wealth Building',
    description: 'Harness the eighth wonder of the world: compound interest mechanics, Rule of 72, and SIP automation.',
    icon: 'Sparkles',
    color: '#EC4899',
    lessons: [
      {
        id: 'sip-1',
        courseId: 'sip_compounding',
        title: 'The Mathematics of Compounding & Rule of 72',
        subtitle: 'Exponential growth curve: earnings generating their own earnings',
        readTime: '6 min',
        videoUrl: 'https://www.youtube.com/embed/rmTCvCqJpzs',
        summary: 'Discover how compounding accelerates exponentially over 10, 20, and 30 years and how to calculate doubling time.',
        content: [
          'Compound interest occurs when earnings on principal generate subsequent returns of their own. Over short horizons (1-5 years), compounding appears linear; over long horizons (15-30 years), the wealth curve turns exponential.',
          'The Rule of 72 is a mental shortcut to estimate doubling time: Years to Double = 72 / Annual Return Rate. At a 12% CAGR, your capital doubles every 6 years (72 / 12 = 6).',
        ],
        keyTakeaways: [
          'Time in the market is the primary exponent of the compound interest formula.',
          'Rule of 72: Doubling Years = 72 / CAGR.',
          'Starting 5 years earlier can double your eventual retirement nest egg.',
        ],
        formulasOrMetrics: [
          { label: 'Compound Interest Formula', formula: 'A = P × (1 + r/n)^(nt)', note: 'P = Principal, r = Annual rate, n = Compounding frequency, t = Time in years.' },
          { label: 'Rule of 72', formula: 'Years to Double = 72 / CAGR', note: 'At 12% CAGR: 72 / 12 = 6 years to double capital.' },
        ],
      },
      {
        id: 'sip-2',
        courseId: 'sip_compounding',
        title: 'Systematic Investment Plan (SIP) Discipline',
        subtitle: 'Automating wealth accumulation and eliminating emotional market timing',
        readTime: '5 min',
        summary: 'Learn how automated monthly SIPs turn market volatility into an advantage through Rupee-Cost Averaging.',
        content: [
          'A Systematic Investment Plan (SIP) automates investing a fixed sum every month into diversified equity funds regardless of market headlines.',
          'When markets dip, your fixed SIP buys more units at cheaper valuations. When markets rally, those accumulated units produce outsized portfolio capital gains.',
        ],
        keyTakeaways: [
          'SIP removes emotional hesitation and procrastination from investing.',
          'Step-up SIP: Increasing monthly SIP by 10% annually dramatically boosts long-term corpus.',
          'Market downturns are buying opportunities for systematic SIP allocators.',
        ],
      },
    ],
    quiz: {
      id: 'quiz-sip',
      title: 'SIP & Compounding Knowledge Check',
      passingScore: 75,
      coinReward: 100,
      questions: [
        {
          id: 'q-s-1',
          question: 'According to the Rule of 72, how many years will it take for an investment to double at a 12% annual return rate?',
          options: ['6 years', '12 years', '7.2 years', '24 years'],
          correctIndex: 0,
          explanation: '72 / 12% = 6 years to double your initial capital.',
        },
        {
          id: 'q-s-2',
          question: 'What is the most critical factor in maximizing the final result of compound interest?',
          options: [
            'Time horizon (length of time capital remains invested)',
            'The specific day of the week orders are placed',
            'Using maximum leverage on daily trades',
            'Constantly withdrawing profits every month',
          ],
          correctIndex: 0,
          explanation: 'Because time is an exponent in the compound growth equation, longer duration produces exponential compounding.',
        },
        {
          id: 'q-s-3',
          question: 'What is a "Step-Up SIP"?',
          options: [
            'Increasing your monthly SIP contribution periodically (e.g., by 10% annually) as your income grows',
            'Walking up stairs while placing an order',
            'Stopping all investments when markets fall',
            'Investing only in footwear manufacturing companies',
          ],
          correctIndex: 0,
          explanation: 'A Step-up SIP increases investment amounts as your career earnings grow, multiplying long-term terminal wealth.',
        },
        {
          id: 'q-s-4',
          question: 'How does an ongoing SIP benefit when stock markets experience a temporary 15% market correction?',
          options: [
            'The fixed monthly SIP automatically buys more fund units at discounted lower prices',
            'The SIP is cancelled by the exchange automatically',
            'All prior profits are erased permanently',
            'The investor is forced to sell their holdings',
          ],
          correctIndex: 0,
          explanation: 'During market corrections, the same monthly contribution acquires more units, which accelerate compounding when the market recovers.',
        },
      ],
    },
  },
];

export const ACADEMY_CATEGORIES = [
  { id: 'all', title: 'All Courses', count: 10 },
  { id: 'Foundations', title: 'Foundations', count: 2 },
  { id: 'Technical', title: 'Technical Analysis', count: 2 },
  { id: 'Analysis', title: 'Fundamental Analysis', count: 1 },
  { id: 'Risk & Strategy', title: 'Risk & Psychology', count: 2 },
  { id: 'Wealth Building', title: 'Wealth Building', count: 3 },
];

export const ALL_LESSONS = ACADEMY_COURSES.flatMap((c) => c.lessons);
