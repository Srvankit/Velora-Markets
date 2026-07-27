import { motion } from 'framer-motion';
import {
  CandlestickChart,
  Wallet,
  Bell,
  Newspaper,
  PieChart,
  ShieldCheck,
} from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { staggerContainer, staggerItem } from '@/lib/animations';

const features = [
  {
    icon: CandlestickChart,
    title: 'Live Market Trading',
    description: 'Buy and sell stocks in milliseconds with real-time prices across NYSE and NASDAQ.',
  },
  {
    icon: PieChart,
    title: 'Portfolio Analytics',
    description: 'Track performance, allocation, and returns with institutional-grade analytics.',
  },
  {
    icon: Wallet,
    title: 'Smart Wallet',
    description: 'Deposit and withdraw instantly with full transaction history and zero hidden fees.',
  },
  {
    icon: Bell,
    title: 'Price Alerts',
    description: 'Get notified the moment a stock hits your target so you never miss an opportunity.',
  },
  {
    icon: Newspaper,
    title: 'Market News',
    description: 'Stay ahead with curated, real-time news and sentiment analysis for every holding.',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security',
    description: 'Your data and funds are protected with encryption, 2FA, and continuous monitoring.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="container">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to invest with confidence"
          description="A complete toolkit for modern investors — from your first trade to a sophisticated portfolio."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
