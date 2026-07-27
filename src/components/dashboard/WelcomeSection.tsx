import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getMarketStatus() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const time = hour + minutes / 60;
  // Weekday, 9:30–16:00 ET approximated as 14:30–21:00 UTC
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = isWeekday && utcHour >= 14.5 && utcHour < 21;
  return { isOpen, label: isOpen ? 'OPEN' : 'CLOSED' };
}

export function WelcomeSection() {
  const { user } = useAuth();
  const greeting = getGreeting();
  const market = getMarketStatus();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{greeting}</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {user?.name?.split(' ')[0] ?? 'Investor'}
        </h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card/60 px-4 py-2.5 backdrop-blur-md">
        <span className="relative flex h-2.5 w-2.5">
          {market.isOpen && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${market.isOpen ? 'bg-success' : 'bg-muted-foreground'}`}
          />
        </span>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">US Market</span>
          <span className={`text-sm font-semibold ${market.isOpen ? 'text-success' : 'text-muted-foreground'}`}>
            {market.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
