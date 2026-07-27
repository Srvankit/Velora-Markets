import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { mockStats } from '@/services/mock-data';

export function Stats() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="container">
        <SectionHeader
          eyebrow="By the numbers"
          title="Trusted by investors worldwide"
          description="The numbers behind a platform built for performance and reliability."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {mockStats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-card"
            >
              <p className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 2 : 0}
                />
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
