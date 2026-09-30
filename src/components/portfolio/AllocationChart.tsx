import { motion } from 'framer-motion';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { assetAllocation } from '@/data/portfolio';
import { useAuth } from '@/contexts/auth-context';
import { formatCurrency } from '@/lib/currency';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '0.75rem',
};

export function AllocationChart() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';
  const totalValue = assetAllocation.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Asset Allocation</h3>
      <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
        <div className="relative h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetAllocation}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                animationDuration={800}
              >
                {assetAllocation.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, n: string) => [formatCurrency(v, currency), n]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="font-display text-sm font-bold">{formatCurrency(totalValue, currency, { compact: true })}</span>
          </div>
        </div>
        <div className="space-y-2">
          {assetAllocation.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{formatCurrency(item.value, currency, { compact: true })}</span>
                <span className="w-10 text-right font-semibold tabular-nums">{item.percentage.toFixed(1)}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
