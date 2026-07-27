import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { generateChartData, chartTimeframes } from '@/data/stockDetails';
import { cn } from '@/lib/utils';

interface StockChartProps {
  symbol: string;
  basePrice: number;
}

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '0.75rem',
};

export function StockChart({ symbol, basePrice }: StockChartProps) {
  const [activeTimeframe, setActiveTimeframe] = useState(1);
  const tf = chartTimeframes[activeTimeframe];
  const data = generateChartData(basePrice, tf.points, tf.volatility);
  const positive = data[data.length - 1].price >= data[0].price;
  const chartColor = positive ? 'hsl(var(--success))' : 'hsl(var(--danger))';

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">{symbol} Price Chart</h3>
          <p className="text-xs text-muted-foreground">Interactive price history</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {chartTimeframes.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveTimeframe(i)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                activeTimeframe === i
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTimeframe}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id={`chart-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
                tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => [`$${v.toFixed(2)}`, 'Price']}
                cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#chart-${symbol})`}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
