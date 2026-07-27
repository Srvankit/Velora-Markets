import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeUp } from '@/lib/animations';

export function CTA() {
  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="container">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-soft-lg sm:px-12 sm:py-20"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-transparent to-success/10" />
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-success/15 blur-3xl" />

          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Start investing with confidence today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Join over a million investors building their portfolios on Velora Markets. It only takes a few minutes to get started.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild className="w-full px-6 shadow-glow sm:w-auto">
              <Link to="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full px-6 sm:w-auto">
              <Link to="/login">Login to your account</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
