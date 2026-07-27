import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { marketSentiment, sectorSentiment, globalSentiment, sentimentConfig, type SentimentType } from '@/data/marketSentiment';
import { cn } from '@/lib/utils';

function getFearGreedColor(index: number) {
  if (index >= 75) return { bg: 'bg-success', text: 'text-success' };
  if (index >= 55) return { bg: 'bg-success/70', text: 'text-success' };
  if (index >= 45) return { bg: 'bg-warning', text: 'text-warning' };
  if (index >= 25) return { bg: 'bg-danger/70', text: 'text-danger' };
  return { bg: 'bg-danger', text: 'text-danger' };
}

export function SentimentMeter() {
  const fgColor = getFearGreedColor(marketSentiment.fearGreedIndex);
  const overallConfig = sentimentConfig[marketSentiment.overall];

  return (
    <div className="space-y-4">
      {/* Fear & Greed Meter */}
      <Card className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <h3 className="mb-4 font-display text-base font-semibold">Fear & Greed Index</h3>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-3 w-full max-w-sm overflow-hidden rounded-full bg-gradient-to-r from-danger via-warning to-success">
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: `${marketSentiment.fearGreedIndex}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow-lg"
              />
            </div>
            <div className="flex w-full max-w-sm items-center justify-between text-xs text-muted-foreground">
              <span>Extreme Fear</span>
              <span>Neutral</span>
              <span>Extreme Greed</span>
            </div>
            <div className="text-center">
              <p className={cn('font-display text-3xl font-bold', fgColor.text)}>
                {marketSentiment.fearGreedIndex}
              </p>
              <p className="text-sm font-medium">{marketSentiment.fearGreedLabel}</p>
            </div>
            <p className="max-w-sm text-center text-xs text-muted-foreground">{marketSentiment.description}</p>
            <div className={cn('rounded-lg px-3 py-1 text-sm font-semibold', overallConfig.bg, overallConfig.color)}>
              Overall: {overallConfig.label}
            </div>
          </div>
        </div>
      </Card>

      {/* Sector Sentiment */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Sector Sentiment</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {sectorSentiment.map((sector, i) => {
            const config = sentimentConfig[sector.sentiment as SentimentType];
            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{sector.sector}</span>
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', config.bg, config.color)}>
                    {config.label}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sector.score}%` }}
                      transition={{ duration: 0.6, delay: i * 0.04 + 0.2 }}
                      className={cn('h-full rounded-full', sector.sentiment === 'bullish' ? 'bg-success' : sector.sentiment === 'bearish' ? 'bg-danger' : 'bg-warning')}
                    />
                  </div>
                  <span className="text-xs font-medium tabular-nums">{sector.score}</span>
                </div>
                <p className={cn('mt-1 text-xs', sector.change >= 0 ? 'text-success' : 'text-danger')}>
                  {sector.change >= 0 ? '+' : ''}{sector.change} pts
                </p>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Global Sentiment */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Global Sentiment</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {globalSentiment.map((region, i) => {
            const config = sentimentConfig[region.sentiment];
            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-lg border border-border p-3 text-center"
              >
                <p className="text-xs font-medium">{region.region}</p>
                <div className={cn('mx-auto mt-2 flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold', config.bg, config.color)}>
                  {region.score}
                </div>
                <p className={cn('mt-1.5 text-xs font-medium', config.color)}>{config.label}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
