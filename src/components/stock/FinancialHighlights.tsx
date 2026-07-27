import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Card } from '@/components/ui/card';
import type { StockFinancials } from '@/data/financials';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '0.75rem',
};

interface FinancialHighlightsProps {
  financials: StockFinancials;
}

export function FinancialHighlights({ financials }: FinancialHighlightsProps) {
  const stats = [
    { label: 'Revenue Growth', value: `${financials.revenueGrowth > 0 ? '+' : ''}${financials.revenueGrowth.toFixed(1)}%`, positive: financials.revenueGrowth >= 0 },
    { label: 'Profit Growth', value: `${financials.profitGrowth > 0 ? '+' : ''}${financials.profitGrowth.toFixed(1)}%`, positive: financials.profitGrowth >= 0 },
    { label: 'Operating Margin', value: `${financials.operatingMargin.toFixed(1)}%`, positive: true },
    { label: 'Net Margin', value: `${financials.netMargin.toFixed(1)}%`, positive: true },
    { label: 'Free Cash Flow', value: formatCurrency(financials.freeCashFlow, 'USD', true), positive: true },
    { label: 'Cash Reserves', value: formatCurrency(financials.cashReserves, 'USD', true), positive: true },
  ];

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Financial Highlights</h3>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="rounded-lg border border-border bg-card/40 p-3"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={cn('mt-1 text-sm font-semibold tabular-nums', stat.positive ? 'text-success' : 'text-danger')}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Quarterly Revenue & Profit ($M)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={financials.quarterlyRevenue} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v, true)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [`$${formatNumber(v, true)}`, n === 'revenue' ? 'Revenue' : 'Profit']} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} animationDuration={800} />
              <Bar dataKey="profit" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Annual Revenue ($M)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={financials.annualRevenue} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v, true)} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${formatNumber(v, true)}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
