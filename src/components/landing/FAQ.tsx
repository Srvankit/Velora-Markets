import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { cn } from '@/lib/utils';
import { mockFaqs } from '@/services/mock-data';

export function FAQ() {
  const [open, setOpen] = useState<string | null>(mockFaqs[0]?.id ?? null);

  return (
    <section className="relative py-20 sm:py-28">
      <div className="container">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about Velora Markets. Can't find an answer? Reach out to our team."
        />

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {mockFaqs.map((faq, i) => {
            const isOpen = open === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={cn(
                  'overflow-hidden rounded-xl border bg-card transition-colors',
                  isOpen ? 'border-primary/40' : 'border-border',
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors', isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.answer}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
