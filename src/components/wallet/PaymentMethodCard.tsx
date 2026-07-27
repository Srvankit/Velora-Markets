import { motion } from 'framer-motion';
import { Landmark, Smartphone, CreditCard, BadgeCheck, Star, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PaymentMethod } from '@/data/paymentMethods';
import { paymentMethodTypeLabels } from '@/data/paymentMethods';
import { cn } from '@/lib/utils';

const typeIcons = {
  bank: Landmark,
  upi: Smartphone,
  debit_card: CreditCard,
  credit_card: CreditCard,
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
  delay?: number;
}

export function PaymentMethodCard({ method, onSetDefault, onRemove, delay = 0 }: PaymentMethodCardProps) {
  const Icon = typeIcons[method.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
    >
      <Card className="relative overflow-hidden p-4 transition-shadow hover:shadow-card-hover">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: method.color }}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold">{method.name}</p>
                {method.isDefault && (
                  <Badge variant="outline" className="border-0 bg-primary/10 text-xs text-primary">
                    <Star className="mr-0.5 h-2.5 w-2.5" />
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{paymentMethodTypeLabels[method.type]}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {method.isVerified ? (
              <BadgeCheck className="h-4 w-4 text-success" />
            ) : (
              <Badge variant="outline" className="border-warning/30 text-xs text-warning">Pending</Badge>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{method.type === 'upi' ? 'UPI ID' : 'Account/Card'}</span>
            <span className="font-mono font-medium">{method.maskedNumber}</span>
          </div>
          {method.ifsc && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">IFSC</span>
              <span className="font-mono">{method.ifsc}</span>
            </div>
          )}
          {method.expiry && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expires</span>
              <span className="font-mono">{method.expiry}</span>
            </div>
          )}
          {method.bankName && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span>{method.bankName}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2 border-t border-border pt-3">
          {!method.isDefault && (
            <Button variant="ghost" size="sm" className="h-7 flex-1 text-xs" onClick={() => onSetDefault?.(method.id)}>
              Set Default
            </Button>
          )}
          <Button variant="ghost" size="sm" className={cn('h-7 text-xs text-danger hover:text-danger', method.isDefault ? 'flex-1' : '')} onClick={() => onRemove?.(method.id)}>
            Remove
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
