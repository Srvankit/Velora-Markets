import { motion } from 'framer-motion';
import { CheckCircle2, LineChart, Lock, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { fadeUp } from '@/lib/animations';

const reasons = [
  {
    icon: Sparkles,
    title: 'A premium experience, end to end',
    description: 'Every screen is crafted for clarity and speed, so investing feels effortless — not intimidating.',
  },
  {
    icon: LineChart,
    title: 'Insights that actually matter',
    description: 'We surface the data that drives decisions: real-time quotes, P&L, allocation, and trends.',
  },
  {
    icon: Lock,
    title: 'Security you can trust',
    description: 'Encryption, two-factor auth, and continuous monitoring keep your account and funds safe.',
  },
  {
    icon: CheckCircle2,
    title: 'No hidden fees, ever',
    description: 'Commission-free stock trading with transparent pricing on every plan. What you see is what you pay.',
  },
];

export function WhyChoose() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Why Velora"
              title="Built for investors who refuse to settle"
              description="Velora Markets combines a beautiful interface with the depth serious investors expect."
            />
            <div className="mt-10 space-y-6">
              {reasons.map((reason, i) => (
                <motion.div
                  key={reason.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <reason.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold">{reason.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-success/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Return</p>
                  <p className="font-display text-3xl font-bold text-success">+14.86%</p>
                </div>
                <div className="rounded-lg bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  All time
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { name: 'Technology', pct: 82, color: 'bg-primary' },
                  { name: 'Healthcare', pct: 64, color: 'bg-success' },
                  { name: 'Financials', pct: 41, color: 'bg-warning' },
                  { name: 'Consumer', pct: 28, color: 'bg-chart-5' },
                ].map((row) => (
                  <div key={row.name}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-muted-foreground">{row.name}</span>
                      <span className="font-medium">{row.pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={`h-full rounded-full ${row.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
