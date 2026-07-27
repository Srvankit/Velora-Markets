import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Line } from 'recharts';
import { Card } from '@/components/ui/card';
import { getPerformanceData, performanceTimeframes, type PerformanceTimeframe } from '@/data/performance';
import { cn } from '@/lib/utils';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '0.75rem',
};

export function PerformanceChart() {
  const [timeframe, setTimeframe] = useState<PerformanceTimeframe>('3M');
  const data = getPerformanceData(timeframe);
  const positive = data[data.length - 1].value >= data[0].value;
  const chartColor = positive ? 'hsl(var(--success))' : 'hsl(var(--danger))';

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">Portfolio Performance</h3>
          <p className="text-xs text-muted-foreground">Growth vs. benchmark</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {performanceTimeframes.map((tf) => (
            <button
              key={tf.label}
              onClick={() => setTimeframe(tf.label)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                timeframe === tf.label
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={timeframe}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id="portfolio-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, n: string) => [`$${v.toLocaleString()}`, n === 'value' ? 'Portfolio' : 'Benchmark']}
                labelFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill="url(#portfolio-grad)" animationDuration={800} />
              <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
