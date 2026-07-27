import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { mockTestimonials } from '@/services/mock-data';

export function Testimonials() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container">
        <SectionHeader
          eyebrow="Testimonials"
          title="Loved by investors everywhere"
          description="Join over a million investors who trust Velora Markets with their portfolios."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {mockTestimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                "{t.content}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
