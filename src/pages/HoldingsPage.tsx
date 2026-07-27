import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { HoldingTable } from '@/components/trading/HoldingTable';
import { PositionsSection } from '@/components/trading/PositionsSection';

export default function HoldingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Holdings</h1>
          <p className="text-sm text-muted-foreground">Your portfolio holdings and intraday positions</p>
        </div>
      </div>
      <HoldingTable />
      <PositionsSection />
    </motion.div>
  );
}
