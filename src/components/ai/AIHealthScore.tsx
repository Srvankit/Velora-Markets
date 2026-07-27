import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { portfolioHealth } from '@/data/aiInsights';
import { cn } from '@/lib/utils';

function getScoreColor(score: number) {
  if (score >= 85) return { stroke: 'hsl(var(--success))', text: 'text-success', label: 'Excellent' };
  if (score >= 75) return { stroke: 'hsl(var(--success))', text: 'text-success', label: 'Very Good' };
  if (score >= 60) return { stroke: 'hsl(var(--warning))', text: 'text-warning', label: 'Moderate' };
  return { stroke: 'hsl(var(--danger))', text: 'text-danger', label: 'Needs Attention' };
}

export function AIHealthScore() {
  const { score, confidence, trend, breakdown } = portfolioHealth;
  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Circular Gauge */}
        <div className="relative h-[160px] w-[160px] shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <motion.circle
              cx="80" cy="80" r="70" fill="none" stroke={color.stroke} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold tabular-nums">
              <AnimatedCounter value={score} decimals={0} duration={1.2} />
            </span>
            <span className={cn('text-xs font-medium', color.text)}>{color.label}</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Portfolio Health Score</p>
            <span className={cn('flex items-center gap-0.5 text-xs font-medium', trend >= 0 ? 'text-success' : 'text-danger')}>
              {trend >= 0 ? '+' : ''}{trend} pts
            </span>
          </div>
          <div className="space-y-1.5">
            {breakdown.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="space-y-0.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium tabular-nums">{item.score.toFixed(1)}/{item.maxScore}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.06 + 0.2 }}
                    className={cn(
                      'h-full rounded-full',
                      item.score / item.maxScore >= 0.8 ? 'bg-success' : item.score / item.maxScore >= 0.6 ? 'bg-warning' : 'bg-danger',
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            AI Confidence: <span className="font-medium text-foreground">{confidence}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
