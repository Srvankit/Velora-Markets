import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { riskDimensions, riskRadarData, riskMetrics } from '@/data/riskAnalysis';
import { cn } from '@/lib/utils';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '0.75rem',
};

const levelConfig = {
  low: { label: 'Low', className: 'bg-success/10 text-success border-success/20' },
  moderate: { label: 'Moderate', className: 'bg-warning/10 text-warning border-warning/20' },
  high: { label: 'High', className: 'bg-danger/10 text-danger border-danger/20' },
};

const metricStatusConfig = {
  good: 'text-success',
  moderate: 'text-warning',
  warning: 'text-danger',
};

export function RiskGauge() {
  return (
    <div className="space-y-4">
      {/* Risk Dimensions */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Risk Breakdown</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {riskDimensions.map((dim, i) => {
            const level = levelConfig[dim.level];
            const percent = (dim.score / dim.maxScore) * 100;
            return (
              <motion.div
                key={dim.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dim.label}</span>
                  <Badge variant="outline" className={cn('border text-xs', level.className)}>{level.label}</Badge>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.05 + 0.2 }}
                    className={cn('h-full rounded-full', dim.level === 'low' ? 'bg-success' : dim.level === 'moderate' ? 'bg-warning' : 'bg-danger')}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{dim.score.toFixed(1)}/{dim.maxScore}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{dim.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Radar Chart */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Risk Radar</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={riskRadarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <PolarRadiusAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 10]} />
            <Radar name="Your Portfolio" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} animationDuration={800} />
            <Radar name="Benchmark" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth={1.5} strokeDasharray="4 4" animationDuration={800} />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Your Portfolio</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-muted-foreground" /> Benchmark</span>
        </div>
      </Card>

      {/* Risk Metrics */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Risk Metrics</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {riskMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-lg border border-border p-3"
            >
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className={cn('mt-0.5 text-lg font-bold tabular-nums', metricStatusConfig[metric.status])}>{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
