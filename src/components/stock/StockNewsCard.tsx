import { motion } from 'framer-motion';
import { ArrowRight, Clock, Bookmark, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { StockNewsItem } from '@/data/stockDetails';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const sentimentConfig = {
  positive: 'bg-success/10 text-success',
  negative: 'bg-danger/10 text-danger',
  neutral: 'bg-muted text-muted-foreground',
};

interface StockNewsCardProps {
  item: StockNewsItem;
  delay?: number;
}

export function StockNewsCard({ item, delay = 0 }: StockNewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="group flex h-full flex-col p-4 transition-all hover:shadow-card-hover hover:-translate-y-0.5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-0 bg-primary/10 text-xs text-primary">
            {item.category}
          </Badge>
          <Badge variant="outline" className={cn('border-0 text-xs', sentimentConfig[item.sentiment])}>
            {item.sentiment}
          </Badge>
          <span className="ml-auto text-xs text-muted-foreground">{formatRelativeTime(item.publishedAt)}</span>
        </div>
        <h4 className="mt-2 text-sm font-semibold leading-snug">{item.headline}</h4>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">{item.source}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.readTime} min
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button aria-label="Bookmark" className="rounded-md p-1 text-muted-foreground transition-colors hover:text-primary">
              <Bookmark className="h-3.5 w-3.5" />
            </button>
            <button aria-label="Share" className="rounded-md p-1 text-muted-foreground transition-colors hover:text-primary">
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80">
              Read more
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
