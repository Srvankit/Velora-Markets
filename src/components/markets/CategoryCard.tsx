import { motion } from 'framer-motion';
import { CandlestickChart, Layers, PieChart, Bitcoin, Gem, Landmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { MarketCategory } from '@/data/news';
import { formatNumber } from '@/lib/format';

const iconMap = { CandlestickChart, Layers, PieChart, Bitcoin, Gem, Landmark };

interface CategoryCardProps {
  category: MarketCategory;
  delay?: number;
}

export function CategoryCard({ category, delay = 0 }: CategoryCardProps) {
  const Icon = iconMap[category.icon as keyof typeof iconMap] ?? CandlestickChart;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
    >
      <Card className="group relative overflow-hidden p-4 transition-shadow hover:shadow-card-hover">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
          style={{ backgroundColor: category.color }}
        />
        <div className="relative flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{category.name}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{category.description}</p>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">
              {formatNumber(category.assetCount, true)} assets
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
