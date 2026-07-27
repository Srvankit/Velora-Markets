import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Wallet, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

type DepositStep = 'form' | 'processing' | 'success';

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
}

const paymentOptions = [
  { value: 'upi', label: 'UPI - GPay' },
  { value: 'upi2', label: 'UPI - PhonePe' },
  { value: 'debit', label: 'Debit Card - HDFC' },
  { value: 'credit', label: 'Credit Card - ICICI' },
  { value: 'netbanking', label: 'Net Banking - HDFC' },
  { value: 'wallet', label: 'Velora Wallet' },
];

export function DepositModal({ open, onOpenChange, walletBalance }: DepositModalProps) {
  const [step, setStep] = useState<DepositStep>('form');
  const [amount, setAmount] = useState('1000');
  const [method, setMethod] = useState('upi');
  const [promo, setPromo] = useState('');
  const [txnId, setTxnId] = useState('');

  const handleDeposit = () => {
    setStep('processing');
    setTimeout(() => {
      setTxnId(`TXN-${Date.now().toString().slice(-8)}`);
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('form');
      setAmount('1000');
      setPromo('');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Deposit Funds
                </DialogTitle>
                <DialogDescription>Add funds to your Velora wallet instantly.</DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">$</span>
                    <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7" min="1" />
                  </div>
                  <div className="flex gap-1.5">
                    {['500', '1000', '5000', '10000'].map((preset) => (
                      <button key={preset} onClick={() => setAmount(preset)} className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent">
                        ${preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Payment Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {paymentOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Promo Code (Optional)</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Enter promo code" className="pl-9" />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card/40 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Balance</span>
                    <span className="font-semibold">{formatCurrency(walletBalance)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-border pt-1">
                    <span className="font-medium">Balance After Deposit</span>
                    <span className="font-bold text-success">{formatCurrency(walletBalance + (parseFloat(amount) || 0))}</span>
                  </div>
                </div>

                <Button className="w-full" onClick={handleDeposit} disabled={!amount || parseFloat(amount) <= 0}>
                  Deposit {formatCurrency(parseFloat(amount) || 0)}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-display text-lg font-semibold">Processing Deposit</p>
                <p className="text-sm text-muted-foreground">Please wait while we process your payment...</p>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-4">
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.6 }} className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </motion.div>
              <div className="text-center">
                <p className="font-display text-xl font-bold">Deposit Successful!</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(parseFloat(amount) || 0)} has been added to your wallet.</p>
              </div>
              <div className="w-full space-y-2 rounded-lg border border-border bg-card/40 p-4 text-left text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-semibold">{txnId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold">{formatCurrency(parseFloat(amount) || 0)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="font-medium">New Balance</span>
                  <span className="font-bold text-success">{formatCurrency(walletBalance + (parseFloat(amount) || 0))}</span>
                </div>
              </div>
              <Button className="w-full" onClick={handleClose}>Done</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
