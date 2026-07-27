import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { marketOpportunities, type MarketOpportunity } from '@/data/aiInsights';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

const typeConfig: Record<MarketOpportunity['type'], { label: string; icon: typeof TrendingUp; color: string }> = {
  breakout: { label: 'Potential Breakout', icon: TrendingUp, color: 'bg-success/10 text-success' },
  value: { label: 'Value Stock', icon: TrendingUp, color: 'bg-primary/10 text-primary' },
  dividend: { label: 'Dividend Pick', icon: TrendingUp, color: 'bg-chart-3/10 text-chart-3' },
  growth: { label: 'Growth Stock', icon: TrendingUp, color: 'bg-chart-2/10 text-chart-2' },
  momentum: { label: 'Momentum Stock', icon: TrendingUp, color: 'bg-chart-4/10 text-chart-4' },
};

const riskConfig = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-danger',
};

interface OpportunityCardProps {
  opportunity: MarketOpportunity;
  delay?: number;
}

export function OpportunityCard({ opportunity, delay = 0 }: OpportunityCardProps) {
  const navigate = useNavigate();
  const config = typeConfig[opportunity.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Card className="flex h-full flex-col p-4 transition-shadow hover:shadow-card-hover">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: opportunity.logoColor }}>
              {opportunity.symbol.slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold">{opportunity.symbol}</p>
              <p className="text-xs text-muted-foreground">{opportunity.name}</p>
            </div>
          </div>
          <span className={cn('rounded-lg px-2 py-0.5 text-[10px] font-medium', config.color)}>
            {config.label}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Current Price</span>
          <span className="font-semibold tabular-nums">{formatCurrency(opportunity.price)}</span>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Potential Return</span>
          <span className="font-bold text-success">+{opportunity.potentialReturn}%</span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{opportunity.rationale}</p>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className={cn('font-medium', riskConfig[opportunity.riskLevel])}>
            {opportunity.riskLevel.charAt(0).toUpperCase() + opportunity.riskLevel.slice(1)} Risk
          </span>
          <span className="text-muted-foreground">AI: {opportunity.confidence}%</span>
        </div>

        <div className="mt-2">
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${opportunity.confidence}%` }}
              transition={{ duration: 0.6, delay: delay + 0.2 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => navigate(`/trade?symbol=${opportunity.symbol}`)}>
          Trade {opportunity.symbol}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Card>
    </motion.div>
  );
}

export function OpportunityGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {marketOpportunities.map((opp, i) => (
        <OpportunityCard key={opp.id} opportunity={opp} delay={i * 0.05} />
      ))}
    </div>
  );
}
