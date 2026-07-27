import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { mockPricingPlans } from '@/services/mock-data';

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 sm:py-28">
      <div className="container">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="Start free and upgrade when you are ready. No hidden fees, no surprises."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3"
        >
          {mockPricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className={cn(
                'relative flex flex-col rounded-2xl border p-6 shadow-card',
                plan.highlighted
                  ? 'border-primary/50 bg-card shadow-glow'
                  : 'border-border bg-card',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow-sm">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold tracking-tight">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{plan.period === 'forever' ? 'forever' : 'mo'}
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                variant={plan.highlighted ? 'default' : 'outline'}
                asChild
              >
                <Link to="/register">
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
