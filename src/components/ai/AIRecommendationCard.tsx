import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Shield, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Recommendation } from '@/data/recommendations';
import { priorityConfig, riskLevelConfig, timeHorizonConfig } from '@/data/recommendations';
import { cn } from '@/lib/utils';

interface AIRecommendationCardProps {
  recommendation: Recommendation;
  delay?: number;
}

const iconMap: Record<string, typeof TrendingUp> = {
  HeartPulse: TrendingUp,
  Cpu: TrendingUp,
  Repeat: TrendingUp,
  Search: TrendingUp,
  DollarSign: TrendingUp,
  ShieldCheck: Shield,
};

export function AIRecommendationCard({ recommendation, delay = 0 }: AIRecommendationCardProps) {
  const navigate = useNavigate();
  const priority = priorityConfig[recommendation.priority];
  const risk = riskLevelConfig[recommendation.riskLevel];
  const Icon = iconMap[recommendation.icon] ?? TrendingUp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Card className="flex h-full flex-col p-4 transition-shadow hover:shadow-card-hover">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{recommendation.title}</p>
              <p className="text-xs text-muted-foreground">{recommendation.category}</p>
            </div>
          </div>
          <Badge variant="outline" className={cn('border text-xs', priority.className)}>
            {priority.label}
          </Badge>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{recommendation.reason}</p>

        <div className="mt-3 rounded-lg border border-success/20 bg-success/5 p-2.5">
          <p className="text-xs font-medium text-success">Expected Benefit</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{recommendation.expectedBenefit}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={cn('flex items-center gap-1 font-medium', risk.className)}>
            <Shield className="h-3 w-3" />
            {risk.label}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeHorizonConfig[recommendation.timeHorizon]}
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="font-medium">{recommendation.confidence}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${recommendation.confidence}%` }}
              transition={{ duration: 0.6, delay: delay + 0.3 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-3 gap-1.5"
          onClick={() => navigate('/trade')}
        >
          {recommendation.action}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Card>
    </motion.div>
  );
}
