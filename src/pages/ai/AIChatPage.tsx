import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AIChat } from '@/components/ai/AIChat';

export default function AIChatPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">AI Chat Assistant</h1>
          <p className="text-sm text-muted-foreground">Get instant answers about your portfolio and investments</p>
        </div>
      </div>
      <AIChat />
    </motion.div>
  );
}
