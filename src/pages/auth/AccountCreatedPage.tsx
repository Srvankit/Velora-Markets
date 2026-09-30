import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Mail } from 'lucide-react';
import { APP } from '@/constants';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { AuthSuccess } from '@/components/auth/AuthSuccess';
import { useAuth } from '@/contexts/auth-context';

export default function AccountCreatedPage() {
  const { user } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-success/15 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-primary/15 blur-[130px]" />
      </div>

      <div className="relative flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-glow-sm">
            <TrendingUp className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            {APP.shortName} <span className="text-muted-foreground">Markets</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg rounded-2xl border border-border bg-card/60 p-8 shadow-soft-lg backdrop-blur-xl sm:p-10"
        >
          <AuthSuccess
            title="Account created successfully!"
            description={
              <>
                Welcome to Velora Markets{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Your
                virtual trading account is ready with{' '}
                <strong className="text-primary">
                  {user?.currency === 'USD' ? '$100,000' : '₹100,000'} Starting Virtual Capital
                </strong>{' '}
                allocated to your wallet.
              </>
            }
            action={
              <Button asChild className="w-full sm:w-auto" size="lg">
                <Link to="/dashboard">
                  Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            }
            secondaryAction={
              <Button asChild variant="outline" className="w-full sm:w-auto" size="lg">
                <Link to="/study">Explore Academy</Link>
              </Button>
            }
          />

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              We sent a verification link to{' '}
              <span className="font-medium text-foreground">{user?.email ?? 'your email'}</span>.
              Check your inbox and click the link to activate your account.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="relative px-6 py-5 text-center text-xs text-muted-foreground sm:px-10">
        © {new Date().getFullYear()} {APP.name}. All rights reserved.
      </div>
    </div>
  );
}
