import { motion } from 'framer-motion';
import { Receipt, FileDown, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionTable } from '@/components/wallet/TransactionTable';

export default function TransactionsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Transactions</h1>
            <p className="text-sm text-muted-foreground">Complete history of your wallet activity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileDown className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Statement Generator */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Monthly Statement</p>
            <p className="text-xs text-muted-foreground">Generate a detailed statement for any month</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="h-9 rounded-lg border border-border bg-card px-3 text-sm">
              <option>January 2025</option>
              <option>December 2024</option>
              <option>November 2024</option>
              <option>October 2024</option>
            </select>
            <Button size="sm">Generate Statement</Button>
          </div>
        </div>
      </Card>

      <TransactionTable />
    </motion.div>
  );
}
