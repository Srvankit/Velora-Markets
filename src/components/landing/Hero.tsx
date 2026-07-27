import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedBackground } from '@/components/landing/AnimatedBackground';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

const tickerItems = [
  { symbol: 'AAPL', price: '232.41', change: '+1.39%', up: true },
  { symbol: 'NVDA', price: '138.60', change: '-1.01%', up: false },
  { symbol: 'MSFT', price: '421.27', change: '+0.70%', up: true },
  { symbol: 'TSLA', price: '251.44', change: '-1.43%', up: false },
  { symbol: 'GOOGL', price: '179.18', change: '+0.63%', up: true },
  { symbol: 'AMZN', price: '201.88', change: '-0.41%', up: false },
  { symbol: 'META', price: '595.94', change: '+0.71%', up: true },
  { symbol: 'JPM', price: '241.82', change: '+0.38%', up: true },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AnimatedBackground />
      <div className="container relative pb-20 pt-20 sm:pt-28 lg:pb-28 lg:pt-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={staggerItem}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Markets are open · Real-time data
          </motion.span>

          <motion.h1
            variants={staggerItem}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            Trade Smarter.
            <br />
            <span className="text-gradient">Invest Confidently.</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Velora Markets is the modern investment platform to buy and sell stocks, track your
            portfolio, and navigate the markets with precision and confidence.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" asChild className="w-full px-6 shadow-glow sm:w-auto">
              <Link to="/register">
                Start Investing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full px-6 sm:w-auto">
              <Link to="/market">Explore Markets</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> Bank-level security
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-warning" /> Lightning-fast execution
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-primary" /> Real-time analytics
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <HeroDashboardPreview />
        </motion.div>
      </div>

      <Ticker />
    </section>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-border bg-card/60 p-2 shadow-soft-lg backdrop-blur-xl">
      <div className="rounded-xl border border-border/60 bg-background/60 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Portfolio Value</p>
            <p className="font-display text-2xl font-bold sm:text-3xl">$19,402.32</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-success">
              <TrendingUp className="h-4 w-4" /> +$2,510.72 (+14.86%)
            </p>
          </div>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '1Y'].map((tf, i) => (
              <span
                key={tf}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${i === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {tf}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 h-40 sm:h-48">
          <SparklineChart />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'AAPL', value: '$5,577', change: '+17.08%', up: true },
            { label: 'NVDA', value: '$5,544', change: '+23.42%', up: true },
            { label: 'MSFT', value: '$5,055', change: '+8.52%', up: true },
            { label: 'GOOGL', value: '$3,225', change: '+8.33%', up: true },
          ].map((h) => (
            <div key={h.label} className="rounded-lg border border-border bg-card/60 p-3">
              <p className="text-xs font-medium text-muted-foreground">{h.label}</p>
              <p className="mt-1 text-sm font-semibold">{h.value}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-success">
                <TrendingUp className="h-3 w-3" /> {h.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SparklineChart() {
  const points = [20, 35, 28, 45, 38, 52, 48, 65, 60, 78, 72, 88, 82, 95];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 100;
  const h = 100;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / (max - min)) * h;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#hero-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: 'easeOut' }}
      />
    </svg>
  );
}

function Ticker() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="relative border-y border-border bg-card/40 py-3">
      <div className="flex overflow-hidden no-scrollbar">
        <motion.div
          className="flex shrink-0 items-center gap-8 pr-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{item.symbol}</span>
              <span className="text-muted-foreground">{item.price}</span>
              <span className={item.up ? 'text-success' : 'text-danger'}>
                {item.up ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />} {item.change}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
