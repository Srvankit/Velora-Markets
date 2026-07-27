import { motion } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { newsSentiment, type NewsSentimentItem } from '@/data/aiInsights';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const sentimentConfig = {
  positive: { label: 'Positive', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  neutral: { label: 'Neutral', icon: Minus, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  negative: { label: 'Negative', icon: TrendingDown, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
};

interface NewsSentimentCardProps {
  item: NewsSentimentItem;
  delay?: number;
}

export function NewsSentimentCard({ item, delay = 0 }: NewsSentimentCardProps) {
  const config = sentimentConfig[item.sentiment];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn('h-full p-4 transition-shadow hover:shadow-card-hover', config.border)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="border-0 bg-muted text-[10px]">{item.category}</Badge>
            <span className="text-xs text-muted-foreground">{item.source}</span>
          </div>
          <span className={cn('flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-medium', config.bg, config.color)}>
            <config.icon className="h-3 w-3" />
            {config.label} ({item.sentimentScore})
          </span>
        </div>

        <p className="mt-2 text-sm font-semibold leading-snug">{item.headline}</p>

        <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
          <p className="flex items-center gap-1 text-[10px] font-medium text-primary">
            <Newspaper className="h-3 w-3" />
            AI Summary
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.aiSummary}</p>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">AI Confidence</span>
            <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.confidence}%` }}
                transition={{ duration: 0.6, delay: delay + 0.3 }}
                className={cn('h-full rounded-full', config.color === 'text-success' ? 'bg-success' : config.color === 'text-danger' ? 'bg-danger' : 'bg-warning')}
              />
            </div>
            <span className="font-medium tabular-nums">{item.confidence}%</span>
          </div>
          <span className="text-muted-foreground">{formatRelativeTime(item.publishedAt)}</span>
        </div>

        {item.symbols.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.symbols.map((sym) => (
              <span key={sym} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium">{sym}</span>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export function NewsSentimentGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {newsSentiment.map((item, i) => (
        <NewsSentimentCard key={item.id} item={item} delay={i * 0.05} />
      ))}
    </div>
  );
}
