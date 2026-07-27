import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';

interface ComingSoonProps {
  title: string;
  description?: string;
}

/**
 * Placeholder for future modules (auth, dashboard, portfolio, trading, etc.).
 * These routes are scaffolded in the router so navigation works today;
 * the real screens will replace this component in later prompts.
 */
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-20 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Construction className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold">Coming soon</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            This module is part of the Velora Markets roadmap and will be built in an upcoming release.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
