import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { HelpCenter } from '@/components/user/HelpCenter';

export default function HelpCenterPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Help Center</h1>
            <p className="text-sm text-muted-foreground">Get help, find answers, and share feedback</p>
          </div>
        </div>
      </motion.div>
      <HelpCenter />
    </div>
  );
}
