import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, AlertCircle, ArrowUpFromLine } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency, getCurrencySymbol } from '@/lib/format';
import { cn } from '@/lib/utils';

type WithdrawStep = 'form' | 'confirm' | 'processing' | 'success';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletBalance: number;
}

const bankOptions = [
  { value: 'hdfc', label: 'HDFC Bank - **** 4521' },
  { value: 'icici', label: 'ICICI Bank - **** 7890' },
];

export function WithdrawModal({ open, onOpenChange, walletBalance }: WithdrawModalProps) {
  const [step, setStep] = useState<WithdrawStep>('form');
  const [amount, setAmount] = useState('500');
  const [bank, setBank] = useState('hdfc');
  const [remarks, setRemarks] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [txnId, setTxnId] = useState('');

  const withdrawAmount = parseFloat(amount) || 0;
  const fee = withdrawAmount * 0.0005;
  const netAmount = withdrawAmount - fee;
  const insufficient = withdrawAmount > walletBalance;

  const handleWithdraw = () => {
    setStep('confirm');
  };

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setTxnId(`WD-${Date.now().toString().slice(-8)}`);
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('form');
      setAmount('500');
      setRemarks('');
      setConfirmed(false);
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
                  <ArrowUpFromLine className="h-5 w-5 text-danger" />
                  Withdraw Funds
                </DialogTitle>
                <DialogDescription>Withdraw funds to your linked bank account.</DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">{getCurrencySymbol()}</span>
                    <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7" min="1" />
                  </div>
                  {insufficient && <p className="text-xs text-danger">Insufficient balance. Available: {formatCurrency(walletBalance)}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Destination Bank</Label>
                  <Select value={bank} onValueChange={setBank}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {bankOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Remarks (Optional)</Label>
                  <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add a note" />
                </div>

                <div className="rounded-lg border border-border bg-card/40 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Withdrawal Amount</span>
                    <span className="font-semibold">{formatCurrency(withdrawAmount)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-semibold">{formatCurrency(fee)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-border pt-1">
                    <span className="font-medium">You'll Receive</span>
                    <span className="font-bold">{formatCurrency(netAmount)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    Estimated arrival: 1-2 business days
                  </div>
                </div>

                <Button className="w-full" variant="destructive" onClick={handleWithdraw} disabled={insufficient || withdrawAmount <= 0}>
                  Withdraw {formatCurrency(withdrawAmount)}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  Confirm Withdrawal
                </DialogTitle>
                <DialogDescription>Please review and confirm your withdrawal.</DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                <div className="space-y-2 rounded-lg border border-border bg-card/40 p-4 text-sm">
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold">{formatCurrency(withdrawAmount)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Fee</span><span>{formatCurrency(fee)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Net Amount</span><span className="font-semibold">{formatCurrency(netAmount)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">To</span><span className="text-xs">{bankOptions.find((b) => b.value === bank)?.label}</span></div>
                  <div className="flex items-center justify-between border-t border-border pt-2"><span className="font-medium">Estimated Arrival</span><span className="text-xs">1-2 business days</span></div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="withdraw-confirm" checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} />
                  <label htmlFor="withdraw-confirm" className="text-xs text-muted-foreground">
                    I confirm this withdrawal request and understand it cannot be reversed.
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('form')}>Back</Button>
                  <Button variant="destructive" className="flex-1" disabled={!confirmed} onClick={handleConfirm}>Confirm</Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-display text-lg font-semibold">Processing Withdrawal</p>
                <p className="text-sm text-muted-foreground">Transferring funds to your bank account...</p>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 py-4">
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.6 }} className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </motion.div>
              <div className="text-center">
                <p className="font-display text-xl font-bold">Withdrawal Initiated!</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(netAmount)} will arrive in 1-2 business days.</p>
              </div>
              <div className="w-full space-y-2 rounded-lg border border-border bg-card/40 p-4 text-left text-sm">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono font-semibold">{txnId}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold">{formatCurrency(withdrawAmount)}</span></div>
                <div className="flex items-center justify-between border-t border-border pt-2"><span className="font-medium">New Balance</span><span className="font-bold">{formatCurrency(walletBalance - withdrawAmount)}</span></div>
              </div>
              <Button className="w-full" onClick={handleClose}>Done</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
