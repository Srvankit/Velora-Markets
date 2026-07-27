import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { sectorAllocation } from '@/data/portfolio';
import { formatCurrency, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '0.75rem',
};

export function SectorChart() {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Sector Allocation</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={sectorAllocation} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={80} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number, _n: string, p) => [formatCurrency(v), p?.payload?.name ?? '']} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
            {sectorAllocation.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 sm:grid-cols-3 lg:grid-cols-4">
        {sectorAllocation.map((sector, i) => (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="space-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sector.color }} />
              <span className="text-xs font-medium">{sector.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">{formatCurrency(sector.value, 'USD', true)} \u00b7 {sector.percentage.toFixed(1)}%</p>
            <p className={cn('text-xs font-semibold', sector.changePercent >= 0 ? 'text-success' : 'text-danger')}>
              {formatPercent(sector.changePercent)}
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
