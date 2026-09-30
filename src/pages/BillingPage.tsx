import { useState, useEffect } from 'react';
import {
  CreditCard,
  Check,
  Crown,
  Info,
  Wallet,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  backendApi,
  type BackendBillingPlan,
  type BackendSubscription,
  getApiErrorMessage,
} from '@/services/backend';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BillingPage() {
  const [plans, setPlans] = useState<BackendBillingPlan[]>([]);
  const [subscription, setSubscription] = useState<BackendSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);

  async function loadBillingData() {
    setLoading(true);
    try {
      const [plansRes, subRes] = await Promise.all([
        backendApi.billingPlans(),
        backendApi.billingSubscription(),
      ]);
      setPlans(plansRes);
      setSubscription(subRes);
    } catch (e) {
      console.error('Failed to load billing details:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBillingData();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (subscription?.planId === planId) {
      toast.info('You are already on this plan.');
      return;
    }

    setSubscribingPlan(planId);
    try {
      const updated = await backendApi.billingSubscribe(planId);
      setSubscription(updated);
      toast.success(`Successfully upgraded to ${updated.planName}! Virtual capital grant added to your wallet.`);
      await loadBillingData();
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Subscription upgrade failed.'));
    } finally {
      setSubscribingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Crown className="h-3.5 w-3.5" />
            <span>Virtual Simulation & Platform Plans</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Upgrade Your Virtual Trading Power
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Expand your virtual capital, unlock institutional indicators, and simulate large-scale portfolio management.
          </p>
        </div>

        {/* VIRTUAL PLATFORM DISCLAIMER BANNER */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>Virtual Platform Notice:</strong> Subscription purchases provide virtual platform simulation capital and advanced educational tools only. All trading money is 100% virtual; no real securities are bought or sold.
          </span>
        </div>
      </div>

      {/* CURRENT SUBSCRIPTION SUMMARY */}
      {subscription && (
        <Card className="border border-border/80 bg-card/60 p-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-foreground">
                    {subscription.planName}
                  </h3>
                  <Badge variant="outline" className="border-success/40 bg-success/10 text-success text-[10px]">
                    {subscription.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {subscription.message}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              {subscription.price > 0 && (
                <div>
                  <span className="block text-[10px] uppercase font-semibold">Pricing</span>
                  <span className="font-mono font-bold text-foreground">
                    {formatCurrency(subscription.price, subscription.currency)}/{subscription.billingInterval}
                  </span>
                </div>
              )}
              <div>
                <span className="block text-[10px] uppercase font-semibold">Next Renewal / Cycle</span>
                <span className="font-mono font-bold text-foreground">
                  {subscription.renewalDate ? new Date(subscription.renewalDate).toLocaleDateString() : 'Lifetime'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* PLANS COMPARISON GRID */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent =
            subscription?.planId === plan.id ||
            (!subscription && (plan.id === 'STANDARD' || plan.id === 'FREE'));
          const isPopular = plan.popular;

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative flex flex-col justify-between p-6 transition-all duration-200',
                isCurrent
                  ? 'border-primary shadow-glow-sm bg-primary/5'
                  : isPopular
                  ? 'border-border/90 shadow-card hover:border-primary/50'
                  : 'border-border/60 bg-card/60 hover:bg-card',
              )}
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
                  Most Popular
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 right-6 rounded-full bg-success px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                  Current Plan
                </div>
              )}

              <div>
                <div className="space-y-1 mb-4">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold tracking-tight text-foreground">
                    {plan.price === 0 ? 'Free' : formatCurrency(plan.price, plan.currency)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs text-muted-foreground">/{plan.billingInterval}</span>
                  )}
                </div>

                {/* Virtual Capital Callout */}
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 p-2.5 text-xs font-semibold text-primary">
                  <Wallet className="h-4 w-4 shrink-0" />
                  <span>
                    {formatCurrency(plan.virtualCapitalBonus, plan.currency)} Virtual Capital
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 border-t border-border/50 pt-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Included Features
                  </span>
                  <ul className="space-y-2 text-xs text-foreground/85">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Button
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                  disabled={isCurrent || subscribingPlan === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {subscribingPlan === plan.id ? (
                    'Processing...'
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    <>
                      <span>Upgrade to {plan.name}</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
