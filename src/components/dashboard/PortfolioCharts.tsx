import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { ChartContainer } from '@/components/common/ChartContainer';
import { mockPortfolioGrowth, mockAssetAllocation, mockDailyPerformance } from '@/services/dashboard-data';
import { formatCurrency } from '@/lib/format';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '0.75rem',
};

export function PortfolioCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="lg:col-span-2"
      >
        <ChartContainer
          title="Portfolio Growth"
          action={<span className="text-xs text-muted-foreground">Last 12 months</span>}
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockPortfolioGrowth} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => [formatCurrency(v), 'Value']}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#growthGrad)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      >
        <ChartContainer title="Asset Allocation">
          <div className="flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={mockAssetAllocation}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                  animationDuration={1000}
                >
                  {mockAssetAllocation.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number, n: string) => [`${v}%`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid w-full grid-cols-2 gap-x-3 gap-y-1.5">
              {mockAssetAllocation.map((a) => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-xs text-muted-foreground">{a.name}</span>
                  <span className="ml-auto text-xs font-medium tabular-nums">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        className="lg:col-span-3"
      >
        <ChartContainer title="Daily Performance" action={<span className="text-xs text-muted-foreground">This week</span>}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockDailyPerformance} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => [formatCurrency(v), 'P&L']}
                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.4 }}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              >
                {mockDailyPerformance.map((entry, i) => (
                  <Cell key={i} fill={entry.value >= 0 ? 'hsl(var(--success))' : 'hsl(var(--danger))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </motion.div>
    </div>
  );
}
