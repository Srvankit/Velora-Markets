import { motion } from 'framer-motion';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Stats } from '@/components/landing/Stats';
import { WhyChoose } from '@/components/landing/WhyChoose';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { pageTransition } from '@/lib/animations';

export default function LandingPage() {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Hero />
      <Features />
      <Stats />
      <WhyChoose />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </motion.div>
  );
}
