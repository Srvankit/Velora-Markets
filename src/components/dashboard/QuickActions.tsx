import { motion } from 'framer-motion';
import { ShoppingCart, Tag, ArrowDownToLine, ArrowUpFromLine, Briefcase, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { label: 'Buy Stock', icon: ShoppingCart, href: '/market' },
  { label: 'Sell Stock', icon: Tag, href: '/portfolio' },
  { label: 'Deposit Funds', icon: ArrowDownToLine, href: '/wallet' },
  { label: 'Withdraw Funds', icon: ArrowUpFromLine, href: '/wallet' },
  { label: 'View Portfolio', icon: Briefcase, href: '/portfolio' },
  { label: 'Explore Market', icon: Compass, href: '/market' },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.05, ease: 'easeOut' }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            className="h-auto w-full justify-start gap-3 rounded-xl border-border bg-card/60 px-4 py-3.5 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-accent"
            asChild
          >
            <a href={action.href}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <action.icon className="h-4 w-4" />
              </span>
              {action.label}
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
