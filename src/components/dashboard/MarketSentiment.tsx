import { motion } from 'framer-motion';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { mockMarketSentiment } from '@/services/dashboard-data';
import { cn } from '@/lib/utils';

export function MarketSentiment() {
  const { bullish, neutral, bearish } = mockMarketSentiment;
  const dominant = bullish >= neutral && bullish >= bearish ? 'Bullish' : neutral >= bearish ? 'Neutral' : 'Bearish';
  const dominantColor = dominant === 'Bullish' ? 'hsl(var(--success))' : dominant === 'Bearish' ? 'hsl(var(--danger))' : 'hsl(var(--warning))';

  const data = [{ name: 'Bullish', value: bullish, fill: 'hsl(var(--success))' }];

  return (
    <ChartContainer title="Market Sentiment">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="68%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={90 - (bullish / 100) * 360}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={20} angleAxisId={0} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold" style={{ color: dominantColor }}>{bullish}%</span>
            <span className="text-xs text-muted-foreground">Bullish</span>
          </div>
        </div>

        <div className="w-full space-y-2.5">
          <SentimentBar label="Bullish" value={bullish} color="bg-success" />
          <SentimentBar label="Neutral" value={neutral} color="bg-warning" />
          <SentimentBar label="Bearish" value={bearish} color="bg-danger" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-1 text-center text-xs text-muted-foreground sm:text-left"
          >
            Overall sentiment is{' '}
            <span className="font-semibold" style={{ color: dominantColor }}>{dominant}</span>
          </motion.p>
        </div>
      </div>
    </ChartContainer>
  );
}

function SentimentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
