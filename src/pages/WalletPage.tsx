import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Info,
  Crown,
  AlertCircle,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

import {
  backendApi,
  getApiErrorMessage,
  type BackendWalletSummary,
  type BackendWalletLedger,
} from '@/services/backend';

export default function WalletPage() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<BackendWalletSummary | null>(null);
  const [ledger, setLedger] = useState<BackendWalletLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWalletData = useCallback(async () => {
    try {
      setError(null);
      const [walletRes, ledgerRes] = await Promise.allSettled([
        backendApi.wallet(),
        backendApi.walletLedger(0, 50),
      ]);

      let errorMsg: string | null = null;

      if (walletRes.status === 'fulfilled') {
        setWallet(walletRes.value);
      } else {
        console.error('Failed to load wallet summary:', walletRes.reason);
        errorMsg = getApiErrorMessage(walletRes.reason, 'Unable to load wallet summary.');
      }

      if (ledgerRes.status === 'fulfilled') {
        const data = ledgerRes.value;
        setLedger(Array.isArray(data) ? data : (data?.content ?? []));
      } else {
        console.error('Failed to load wallet ledger:', ledgerRes.reason);
      }

      if (walletRes.status === 'rejected' && ledgerRes.status === 'rejected') {
        setError(errorMsg || 'Unable to connect to virtual wallet service.');
      }
    } catch (err) {
      console.error('Failed to load wallet data:', err);
      setError(getApiErrorMessage(err, 'Unable to load virtual wallet details.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadWalletData();
  }, [loadWalletData]);

  const handleRefresh = () => {
    setRefreshing(true);
    void loadWalletData();
  };

  const currency = wallet?.currency || 'INR';
  const availableCash = wallet?.availableCash ?? 0;
  const investedValue = wallet?.investedValue ?? 0;
  const totalPortfolioValue = wallet?.totalPortfolioValue ?? 0;
  const totalVirtualCapital = wallet?.totalVirtualCapital ?? (availableCash + investedValue);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-xl bg-muted/30" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/30" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-muted/30" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Virtual Trading Wallet
            </h1>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-mono text-[11px]">
              100% Virtual Capital
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Auditable server-backed virtual ledger for portfolio tracking, simulation funds, and trade settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/billing')}
            className="gap-1.5 text-xs"
          >
            <Crown className="h-3.5 w-3.5 text-warning" />
            <span>Virtual Capital Plans</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-9 w-9"
            title="Refresh Wallet"
          >
            <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* VIRTUAL NOTICE BANNER */}
      <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground/90">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div>
          <strong>Virtual Money Only:</strong> All funds displayed are virtual practice currency allocated upon registration or platform subscription. No real deposits, withdrawals, or real bank accounts are involved.
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-2.5 rounded-xl border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => void loadWalletData()}>
            Retry
          </Button>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Available Virtual Cash */}
        <Card className="p-5 border-border/80 bg-card/60 backdrop-blur-xl">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Available Virtual Cash
          </span>
          <p className="font-display text-2xl font-bold tracking-tight text-foreground mt-1">
            {formatCurrency(availableCash, currency)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Ready for instant paper order execution
          </p>
        </Card>

        {/* Invested Market Value */}
        <Card className="p-5 border-border/80 bg-card/60 backdrop-blur-xl">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Invested Value
          </span>
          <p className="font-display text-2xl font-bold tracking-tight text-foreground mt-1">
            {formatCurrency(investedValue, currency)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Current value of open holdings
          </p>
        </Card>

        {/* Total Account Valuation */}
        <Card className="p-5 border-border/80 bg-card/60 backdrop-blur-xl">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Portfolio Value
          </span>
          <p className="font-display text-2xl font-bold tracking-tight text-foreground mt-1">
            {formatCurrency(totalPortfolioValue, currency)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Cash + live stock valuation
          </p>
        </Card>

        {/* Total Allocated Virtual Capital */}
        <Card className="p-5 border-border/80 bg-card/60 backdrop-blur-xl">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Virtual Capital
          </span>
          <p className="font-display text-2xl font-bold tracking-tight text-foreground mt-1">
            {formatCurrency(totalVirtualCapital, currency)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Initial grant + subscription top-ups
          </p>
        </Card>
      </div>

      {/* AUDITABLE VIRTUAL WALLET LEDGER TABLE */}
      <Card className="overflow-hidden border border-border/80 p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h3 className="font-display text-base font-semibold text-foreground">
              Auditable Virtual Ledger History
            </h3>
            <p className="text-xs text-muted-foreground">
              Complete chronological audit trail of all virtual capital initializations, trades, and adjustments.
            </p>
          </div>

          <Badge variant="outline" className="font-mono text-xs">
            {ledger.length} Entries
          </Badge>
        </div>

        {ledger.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No ledger entries found. Your initial starting capital will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Txn ID / Ref</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-right text-xs">Amount</TableHead>
                  <TableHead className="text-right text-xs">Balance Before</TableHead>
                  <TableHead className="text-right text-xs">Balance After</TableHead>
                  <TableHead className="text-right text-xs">Timestamp</TableHead>
                  <TableHead className="text-center text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {ledger.map((entry, i) => {
                  const isCredit =
                    entry.type === 'INITIAL_CAPITAL' ||
                    entry.type === 'SELL' ||
                    entry.type === 'ADJUSTMENT';

                  return (
                    <motion.tr
                      key={entry.id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      className="group border-b border-border/50 transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {entry.referenceId || `#LED-${entry.id}`}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] uppercase font-mono',
                            entry.type === 'INITIAL_CAPITAL'
                              ? 'bg-primary/10 text-primary border-primary/30'
                              : entry.type === 'BUY'
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                              : entry.type === 'SELL'
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/30',
                          )}
                        >
                          {entry.type}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs font-medium text-foreground max-w-xs truncate">
                        {entry.description}
                      </TableCell>

                      <TableCell className="text-right font-mono text-xs font-semibold tabular-nums">
                        <span className={isCredit ? 'text-success' : 'text-danger'}>
                          {isCredit ? '+' : '-'}
                          {formatCurrency(entry.amount, currency)}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                        {formatCurrency(entry.balanceBefore, currency)}
                      </TableCell>

                      <TableCell className="text-right font-mono text-xs font-medium text-foreground tabular-nums">
                        {formatCurrency(entry.balanceAfter, currency)}
                      </TableCell>

                      <TableCell className="text-right font-mono text-xs text-muted-foreground">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[10px]">
                          {entry.status || 'COMPLETED'}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}