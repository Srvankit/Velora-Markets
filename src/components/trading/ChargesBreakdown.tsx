import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { ChargeBreakdown } from '@/types/trading';
import { formatCurrency } from '@/lib/format';

interface ChargesBreakdownProps {
  charges: ChargeBreakdown;
  investment: number;
  total: number;
  side: 'buy' | 'sell';
}

export function ChargesBreakdown({ charges, investment, total, side }: ChargesBreakdownProps) {
  const rows = [
    { label: 'Investment Amount', value: investment },
    { label: 'Brokerage', value: charges.brokerage },
    { label: 'Exchange Charges', value: charges.exchangeCharges },
    { label: 'STT / CTT', value: charges.stt },
    { label: 'GST (18%)', value: charges.gst },
    { label: 'Stamp Duty', value: charges.stampDuty },
    { label: 'SEBI Charges', value: charges.sebiCharges },
  ];

  return (
    <Card className="p-4">
      <p className="mb-3 text-xs font-medium text-muted-foreground">Charges Breakdown</p>
      <div className="space-y-1.5">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium tabular-nums">{formatCurrency(row.value)}</span>
          </motion.div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm">
          <span className="font-semibold">{side === 'buy' ? 'Total Cost' : 'Net Proceeds'}</span>
          <span className="font-bold tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>
    </Card>
  );
}
