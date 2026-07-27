import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Sparkline } from '@/components/common/Sparkline';
import type { MarketStock } from '@/data/stocks';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

interface RelatedStockCardProps {
  stock: MarketStock;
  delay?: number;
}

export function RelatedStockCard({ stock, delay = 0 }: RelatedStockCardProps) {
  const navigate = useNavigate();
  const positive = stock.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
    >
      <Card
        className="cursor-pointer p-4 transition-shadow hover:shadow-card-hover"
        onClick={() => navigate(`/stocks/${stock.symbol}`)}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
            style={{ backgroundColor: stock.logoColor }}
          >
            {stock.symbol.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{stock.symbol}</p>
            <p className="truncate text-xs text-muted-foreground">{stock.name}</p>
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold tabular-nums">{formatCurrency(stock.price)}</p>
            <p className={cn('text-xs font-medium', positive ? 'text-success' : 'text-danger')}>
              {positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </p>
          </div>
          <Sparkline data={stock.sparkline} width={56} height={24} positive={positive} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{stock.sector}</p>
      </Card>
    </motion.div>
  );
}
