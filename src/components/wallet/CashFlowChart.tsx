import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { cashFlowData } from '@/data/wallet';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem',
  fontSize: '0.75rem',
};

type ChartMode = 'deposits' | 'withdrawals' | 'investments' | 'netFlow';

const modes: { label: string; value: ChartMode }[] = [
  { label: 'Deposits', value: 'deposits' },
  { label: 'Withdrawals', value: 'withdrawals' },
  { label: 'Investments', value: 'investments' },
  { label: 'Net Flow', value: 'netFlow' },
];

export function CashFlowChart() {
  const [mode, setMode] = useState<ChartMode>('deposits');

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-semibold">Cash Flow</h3>
          <p className="text-xs text-muted-foreground">Monthly financial activity</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                mode === m.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={cashFlowData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [formatCurrency(v), n === 'value' ? modes.find((m) => m.value === mode)?.label : n]} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
              {mode === 'netFlow' ? (
                <>
                  <Bar dataKey="deposits" fill="hsl(var(--success))" opacity={0.3} radius={[4, 4, 0, 0]} animationDuration={800} />
                  <Bar dataKey="withdrawals" fill="hsl(var(--danger))" opacity={0.3} radius={[4, 4, 0, 0]} animationDuration={800} />
                  <Line type="monotone" dataKey="netFlow" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} animationDuration={800} />
                </>
              ) : (
                <Bar dataKey={mode} fill={mode === 'deposits' ? 'hsl(var(--success))' : mode === 'withdrawals' ? 'hsl(var(--danger))' : 'hsl(var(--chart-2))'} radius={[4, 4, 0, 0]} animationDuration={800} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}
