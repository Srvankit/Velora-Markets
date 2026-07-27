import { motion } from 'framer-motion';

/**
 * Decorative animated background — floating gradient orbs and a subtle grid.
 * Purely presentational; sits behind page content.
 */
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
      <div className="absolute inset-0 bg-radial-fade" />
      <motion.div
        className="absolute -left-32 top-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-10%] top-[20%] h-[24rem] w-[24rem] rounded-full bg-success/15 blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[30%] h-[22rem] w-[22rem] rounded-full bg-chart-5/10 blur-[120px]"
        animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
