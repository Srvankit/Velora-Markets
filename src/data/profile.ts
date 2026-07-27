export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  coverColor: string;
  country: string;
  city: string;
  timezone: string;
  currency: string;
  occupation: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  investmentStyle: 'Value' | 'Growth' | 'Income' | 'Mixed';
  bio: string;
  socialLinks: { linkedin?: string; github?: string; website?: string };
  joinedDate: string;
  verified: boolean;
}

export const userProfile: UserProfile = {
  id: 'u1',
  fullName: 'Alex Morgan',
  username: '@alexmorgan',
  email: 'alex.morgan@velora.com',
  phone: '+1 (415) 555-0142',
  avatar: '',
  coverColor: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--chart-2)))',
  country: 'United States',
  city: 'San Francisco',
  timezone: 'PST (UTC-8)',
  currency: 'USD ($)',
  occupation: 'Software Engineer',
  experienceLevel: 'Advanced',
  riskProfile: 'Moderate',
  investmentStyle: 'Growth',
  bio: 'Passionate investor focused on technology and growth stocks. Building a diversified portfolio for long-term wealth creation. Believer in data-driven investment decisions.',
  socialLinks: {
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    website: 'alexmorgan.dev',
  },
  joinedDate: '2024-01-15T00:00:00Z',
  verified: true,
};

export interface PortfolioQuickStat {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

export const portfolioQuickStats: PortfolioQuickStat[] = [
  { label: 'Portfolio Value', value: '$27,822.82', change: '+9.92%', positive: true },
  { label: 'Total Trades', value: '127', change: '+12 this month', positive: true },
  { label: 'Win Rate', value: '68.5%', change: '+3.2%', positive: true },
  { label: 'Dividends Earned', value: '$109.80', change: '+$12.40', positive: true },
];

export interface InvestmentProfileStat {
  label: string;
  value: string;
  icon: string;
}

export const investmentProfileStats: InvestmentProfileStat[] = [
  { label: 'Experience Level', value: 'Advanced', icon: 'TrendingUp' },
  { label: 'Risk Profile', value: 'Moderate', icon: 'Shield' },
  { label: 'Investment Style', value: 'Growth', icon: 'Target' },
  { label: 'Preferred Currency', value: 'USD ($)', icon: 'DollarSign' },
];
