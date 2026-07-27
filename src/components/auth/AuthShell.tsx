import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, BarChart3, Zap } from 'lucide-react';
import { APP } from '@/constants';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

/**
 * Two-column auth shell: branded illustration panel on the left,
 * form content on the right. Collapses to a single column on mobile.
 */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* Illustration panel */}
      <div className="relative hidden overflow-hidden border-r border-border bg-card/40 lg:flex lg:flex-col">
        <AuthIllustration />
      </div>

      {/* Form panel */}
      <div className="relative flex min-h-screen flex-col">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
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

        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <motion.div variants={staggerItem} className="space-y-1.5">
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
            </motion.div>
            <motion.div variants={staggerItem} className="mt-8">
              {children}
            </motion.div>
          </motion.div>
        </div>

        <div className="px-6 py-5 text-center text-xs text-muted-foreground sm:px-10">
          © {new Date().getFullYear()} {APP.name}. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function AuthIllustration() {
  const highlights = [
    { icon: BarChart3, title: 'Real-time analytics', description: 'Track every position with precision.' },
    { icon: ShieldCheck, title: 'Bank-grade security', description: 'Your funds and data are protected.' },
    { icon: Zap, title: 'Instant execution', description: 'Trade in milliseconds, not minutes.' },
  ];

  return (
    <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-success/15 blur-[130px]" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-chart-5/10 blur-[120px]" />
      </div>

      <Link to="/" className="relative flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-glow-sm">
          <TrendingUp className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">
          {APP.shortName} <span className="text-muted-foreground">Markets</span>
        </span>
      </Link>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative space-y-8"
      >
        <motion.div variants={staggerItem} className="space-y-4">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Invest with confidence
          </span>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
            The modern way to <span className="text-gradient">grow your wealth</span>
          </h2>
          <p className="max-w-md text-base text-muted-foreground">
            Join over a million investors using Velora Markets to trade smarter, track portfolios,
            and reach their financial goals.
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-3">
          {highlights.map((h) => (
            <div key={h.title} className="flex items-center gap-3.5 rounded-xl border border-border/60 bg-card/40 p-3.5 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <h.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{h.title}</p>
                <p className="text-xs text-muted-foreground">{h.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-md"
      >
        <div className="flex -space-x-2">
          <InvestorAvatar seed="A" />
          <InvestorAvatar seed="M" />
          <InvestorAvatar seed="P" />
        </div>
        <div>
          <p className="text-sm font-semibold">Trusted by 1M+ investors</p>
          <p className="text-xs text-muted-foreground">Across 40+ countries worldwide</p>
        </div>
      </motion.div>
    </div>
  );
}

const avatarColors = [
  ['#2563EB', '#10B981'],
  ['#F59E0B', '#EF4444'],
  ['#10B981', '#2563EB'],
];

function InvestorAvatar({ seed }: { seed: string }) {
  const idx = seed.charCodeAt(0) % avatarColors.length;
  const [c1, c2] = avatarColors[idx];
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 rounded-full border-2 border-card" aria-label="Investor">
      <defs>
        <linearGradient id={`av-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="16" fill={`url(#av-${seed})`} />
      <circle cx="16" cy="13" r="5" fill="white" fillOpacity="0.9" />
      <path d="M6 28c0-5 4-8 10-8s10 3 10 8" fill="white" fillOpacity="0.9" />
    </svg>
  );
}
