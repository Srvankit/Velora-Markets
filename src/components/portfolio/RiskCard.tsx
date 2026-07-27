import { motion } from 'framer-motion';
import { Shield, Layers, Activity, TrendingDown, Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { riskMetrics } from '@/data/portfolio';
import { cn } from '@/lib/utils';

const riskLevel = (score: number) => {
  if (score <= 3) return { label: 'Low', color: 'text-success', bg: 'bg-success' };
  if (score <= 5) return { label: 'Moderate', color: 'text-warning', bg: 'bg-warning' };
  if (score <= 7) return { label: 'Elevated', color: 'text-warning', bg: 'bg-warning' };
  return { label: 'High', color: 'text-danger', bg: 'bg-danger' };
};

const diversificationLevel = (score: number) => {
  if (score >= 8) return { label: 'Excellent', color: 'text-success' };
  if (score >= 6) return { label: 'Good', color: 'text-success' };
  if (score >= 4) return { label: 'Fair', color: 'text-warning' };
  return { label: 'Poor', color: 'text-danger' };
};

export function RiskCard() {
  const risk = riskLevel(riskMetrics.riskScore);
  const div = diversificationLevel(riskMetrics.diversificationScore);

  const metrics = [
    { icon: Activity, label: 'Volatility', value: `${riskMetrics.volatility.toFixed(1)}%` },
    { icon: TrendingDown, label: 'Beta', value: riskMetrics.beta.toFixed(2) },
    { icon: Gauge, label: 'Sharpe Ratio', value: riskMetrics.sharpeRatio.toFixed(2) },
    { icon: TrendingDown, label: 'Max Drawdown', value: `${riskMetrics.maxDrawdown.toFixed(1)}%` },
  ];

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Risk Analysis</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Risk Meter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Portfolio Risk Score</p>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-gradient-to-r from-success via-warning to-danger">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(riskMetrics.riskScore / 10) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 rounded-full border-r-2 border-background"
              style={{ width: `${(riskMetrics.riskScore / 10) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className={cn('text-sm font-bold', risk.color)}>{riskMetrics.riskScore.toFixed(1)}/10</span>
            <span className={cn('text-xs font-medium', risk.color)}>{risk.label} Risk</span>
          </div>
        </div>

        {/* Diversification Score */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Diversification Score</p>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(riskMetrics.diversificationScore / 10) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold tabular-nums">{riskMetrics.diversificationScore.toFixed(1)}/10</span>
            <span className={cn('text-xs font-medium', div.color)}>{div.label}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <m.icon className="h-3 w-3" />
              {m.label}
            </div>
            <p className="text-sm font-semibold tabular-nums">{m.value}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
