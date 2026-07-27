import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { OrderTable } from '@/components/trading/OrderTable';

export default function OrdersPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">View and manage your order history</p>
        </div>
      </div>
      <OrderTable />
    </motion.div>
  );
}
