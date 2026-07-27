import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Landmark, Smartphone, CreditCard as CardIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentMethodCard } from '@/components/wallet/PaymentMethodCard';
import { paymentMethods, type PaymentMethodType } from '@/data/paymentMethods';
import { cn } from '@/lib/utils';

const typeFilters: { value: PaymentMethodType | 'all'; label: string; icon: typeof Landmark }[] = [
  { value: 'all', label: 'All', icon: CreditCard },
  { value: 'bank', label: 'Bank Accounts', icon: Landmark },
  { value: 'upi', label: 'UPI IDs', icon: Smartphone },
  { value: 'debit_card', label: 'Debit Cards', icon: CardIcon },
  { value: 'credit_card', label: 'Credit Cards', icon: CardIcon },
];

export default function PaymentMethodsPage() {
  const [filter, setFilter] = useState<PaymentMethodType | 'all'>('all');
  const [methods, setMethods] = useState(paymentMethods);

  const filtered = filter === 'all' ? methods : methods.filter((m) => m.type === filter);

  const handleSetDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const handleRemove = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Payment Methods</h1>
            <p className="text-sm text-muted-foreground">Manage your linked bank accounts, cards, and UPI IDs</p>
          </div>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {typeFilters.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setFilter(tf.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              filter === tf.value ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-accent',
            )}
          >
            <tf.icon className="h-3.5 w-3.5" />
            {tf.label}
          </button>
        ))}
      </div>

      {/* Payment Methods Grid */}
      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <CreditCard className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-display text-base font-semibold">No payment methods found</p>
            <p className="text-sm text-muted-foreground">Add a bank account, card, or UPI ID to get started.</p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((method, i) => (
            <PaymentMethodCard key={method.id} method={method} onSetDefault={handleSetDefault} onRemove={handleRemove} delay={i * 0.05} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
