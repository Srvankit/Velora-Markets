export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
}

export const suggestedPrompts = [
  'Analyze my portfolio',
  'Should I diversify?',
  'Explain P/E Ratio',
  'Is my portfolio balanced?',
  'Suggest long-term investments',
  'What are today\'s market trends?',
  'How can I reduce risk?',
  'Which sectors should I invest in?',
];

export const mockChatConversations: ChatConversation[] = [
  {
    id: 'c1',
    title: 'Portfolio Analysis',
    lastMessage: 'Your portfolio is in very good health with a score of 82/100...',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    messages: [
      { id: 'm1', role: 'user', content: 'Analyze my portfolio', timestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString() },
      { id: 'm2', role: 'assistant', content: 'Your portfolio is in very good health with a score of 82/100. Here\'s my analysis:\n\n1. **Technology allocation** is high at 69.7%, which is above the recommended 40% threshold.\n2. **Healthcare exposure** is below target at 8.6% vs. market average of 12%.\n3. **Financial sector** diversification is strong with holdings across banking and payments.\n4. **Overall risk** is moderate with a Sharpe ratio of 1.42, indicating good risk-adjusted returns.\n5. **Long-term outlook** remains positive with expected annualized returns of 10-12%.\n\nWould you like specific recommendations to improve your portfolio?', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    ],
  },
  {
    id: 'c2',
    title: 'Diversification Strategy',
    lastMessage: 'To improve diversification, I recommend...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    messages: [
      { id: 'm3', role: 'user', content: 'Should I diversify?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.1).toISOString() },
      { id: 'm4', role: 'assistant', content: 'Yes, diversification would benefit your portfolio. Your technology concentration at 69.7% is significantly above the recommended 40%. To improve diversification, I recommend:\n\n1. **Add healthcare stocks** - Your 8.6% allocation is below the 12% market average.\n2. **Consider energy sector** - Currently at 4.3%, adding positions like ONGC could help.\n3. **Add consumer staples** - Defensive stocks can reduce portfolio volatility.\n4. **Increase bond allocation** - Even a small 5% allocation can provide stability.\n\nThese changes could improve your diversification score from 4.8 to 7.5 out of 10.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
    ],
  },
  {
    id: 'c3',
    title: 'Understanding P/E Ratio',
    lastMessage: 'The P/E (Price-to-Earnings) ratio is...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    messages: [
      { id: 'm5', role: 'user', content: 'Explain P/E Ratio', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.1).toISOString() },
      { id: 'm6', role: 'assistant', content: 'The P/E (Price-to-Earnings) ratio is a valuation metric that compares a company\'s stock price to its earnings per share (EPS).\n\n**Formula:** P/E = Stock Price / Earnings Per Share\n\n**Interpretation:**\n- A **high P/E** suggests investors expect high future growth (or the stock is overvalued).\n- A **low P/E** may indicate undervaluation (or low growth expectations).\n- The **sector average** is important for comparison - a P/E of 25 might be high for utilities but low for tech.\n\n**Your portfolio:**\n- AAPL: 35.2x (above sector avg of 28x)\n- MSFT: 36.8x (in line with sector)\n- NVDA: 67.5x (high, but justified by growth)\n- JNJ: 21.5x (below sector avg of 24x - potentially undervalued)', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    ],
  },
];

export function generateMockResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('analyze') || lower.includes('portfolio')) {
    return 'Your portfolio is in very good health with a score of 82/100. Here\'s my analysis:\n\n1. **Technology allocation** is high at 69.7%, above the recommended 40% threshold.\n2. **Healthcare exposure** is below target at 8.6% vs. market average of 12%.\n3. **Financial sector** diversification is strong across banking and payments.\n4. **Overall risk** is moderate with a Sharpe ratio of 1.42.\n5. **Long-term outlook** remains positive with expected returns of 10-12%.\n\nWould you like specific recommendations to improve your portfolio?';
  }

  if (lower.includes('diversif')) {
    return 'Yes, diversification would benefit your portfolio. Your technology concentration at 69.7% is above the recommended 40%. I recommend:\n\n1. **Add healthcare stocks** to bring allocation closer to 12%.\n2. **Consider energy sector** positions like ONGC.\n3. **Add consumer staples** for defensive coverage.\n4. **Increase bond allocation** for stability.\n\nThese changes could improve your diversification score from 4.8 to 7.5 out of 10.';
  }

  if (lower.includes('p/e') || lower.includes('pe ratio') || lower.includes('pe ')) {
    return 'The P/E (Price-to-Earnings) ratio compares a stock\'s price to its earnings per share.\n\n**Formula:** P/E = Stock Price / EPS\n\n**Interpretation:**\n- High P/E = high growth expectations or overvaluation.\n- Low P/E = potential undervaluation or low growth.\n- Always compare to sector averages.\n\n**Your holdings:**\n- AAPL: 35.2x (above sector avg)\n- NVDA: 67.5x (high, justified by growth)\n- JNJ: 21.5x (below sector avg - potentially undervalued)';
  }

  if (lower.includes('balanced') || lower.includes('balance')) {
    return 'Your portfolio is moderately balanced. Here\'s the assessment:\n\n**Strengths:**\n- Good financial sector diversification.\n- Healthy cash position at 30.3%.\n- Strong risk-adjusted returns (Sharpe 1.42).\n\n**Areas for improvement:**\n- Technology overconcentration (69.7% vs. 40% target).\n- Healthcare underweight (8.6% vs. 12% target).\n- Low dividend yield (1.8% vs. 2.1% market avg).\n\nOverall balance score: 6.2/10. Consider rebalancing to improve to 8/10.';
  }

  if (lower.includes('long-term') || lower.includes('long term') || lower.includes('suggest') || lower.includes('invest')) {
    return 'For long-term investments, I recommend considering:\n\n1. **MSFT (Microsoft)** - Cloud growth accelerating on AI demand. Strong competitive moat. Expected return: 12%.\n2. **JNJ (Johnson & Johnson)** - Undervalued with 3.18% dividend yield. Defensive healthcare play.\n3. **JPM (JPMorgan)** - 2.24% dividend yield with consistent payout growth. Financial sector leader.\n4. **ONGC** - Low P/E of 8.2x with 3.86% dividend yield. Energy sector recovery play.\n\nThese selections balance growth, value, and income for a well-rounded long-term portfolio.';
  }

  if (lower.includes('trend') || lower.includes('market')) {
    return 'Today\'s market trends:\n\n**Bullish sectors:**\n- Technology (+1.42%) - Driven by AI earnings and product launches.\n- Energy (+1.18%) - Oil price recovery and demand growth.\n- Finance (+0.72%) - Strong bank earnings and rate stability.\n\n**Bearish sectors:**\n- Automobile (-0.42%) - Supply chain concerns and EV competition.\n\n**Market sentiment:** Bullish (Fear & Greed Index: 68 - Greed)\n\n**AI recommendation:** Consider increasing exposure to energy and healthcare sectors while reducing technology concentration.';
  }

  if (lower.includes('risk') || lower.includes('reduce')) {
    return 'To reduce portfolio risk, consider these strategies:\n\n1. **Reduce tech concentration** from 69.7% to 50-55%.\n2. **Add defensive stocks** like JNJ with low beta and stable dividends.\n3. **Increase bond allocation** to 5-10% for stability.\n4. **Set stop-loss orders** on high-volatility positions.\n5. **Diversify across sectors** to reduce single-sector risk.\n\nImplementing these could lower your portfolio volatility from 18.4% to approximately 14-15% while maintaining returns.';
  }

  if (lower.includes('sector')) {
    return 'Based on current market conditions, I recommend these sectors:\n\n1. **Healthcare** - Defensive characteristics, steady dividends, and your current underweight position.\n2. **Energy** - Recovery play with attractive valuations (ONGC at 8.2x P/E).\n3. **Finance** - Strong earnings, stable rates, and good dividend yields.\n4. **Consumer Staples** - Defensive coverage for market downturns.\n\nAvoid over-allocating to technology given your current 69.7% concentration.';
  }

  return 'I understand you\'re asking about: "' + prompt + '".\n\nBased on your portfolio analysis, here are my thoughts:\n\nYour portfolio is in very good health (82/100). The key areas to focus on are reducing technology concentration and increasing healthcare exposure. Your risk-adjusted returns are strong with a Sharpe ratio of 1.42.\n\nWould you like me to dive deeper into any specific aspect of your portfolio?';
}
