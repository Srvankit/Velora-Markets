import { motion } from 'framer-motion';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import type { AnalystRating } from '@/data/analystRatings';
import { cn } from '@/lib/utils';

interface AnalystRatingCardProps {
  rating: AnalystRating;
  currentPrice: number;
}

const consensusColors: Record<string, string> = {
  'Strong Buy': 'text-success',
  Buy: 'text-success',
  Hold: 'text-warning',
  Sell: 'text-danger',
  'Strong Sell': 'text-danger',
};

export function AnalystRatingCard({ rating, currentPrice }: AnalystRatingCardProps) {
  const total =
    rating.strongBuy + rating.buy + rating.hold + rating.sell + rating.strongSell;
  const buyPercent = Math.round(((rating.strongBuy + rating.buy) / total) * 100);
  const data = [{ name: 'Buy %', value: buyPercent, fill: 'hsl(var(--success))' }];

  const distribution = [
    { label: 'Strong Buy', count: rating.strongBuy, color: 'bg-success' },
    { label: 'Buy', count: rating.buy, color: 'bg-success/70' },
    { label: 'Hold', count: rating.hold, color: 'bg-warning' },
    { label: 'Sell', count: rating.sell, color: 'bg-danger/70' },
    { label: 'Strong Sell', count: rating.strongSell, color: 'bg-danger' },
  ];

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Analyst Ratings</h3>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="65%" outerRadius="100%" data={data} startAngle={90} endAngle={90 - (buyPercent / 100) * 360}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={16} angleAxisId={0} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl font-bold text-success">{buyPercent}%</span>
            <span className="text-xs text-muted-foreground">Buy</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Consensus</span>
            <span className={cn('text-sm font-bold', consensusColors[rating.consensus])}>
              {rating.consensus}
            </span>
          </div>
          <div className="space-y-1.5">
            {distribution.map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="w-20 text-xs text-muted-foreground">{d.label}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn('h-full rounded-full', d.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / total) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-medium tabular-nums">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
