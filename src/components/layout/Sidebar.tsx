import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CandlestickChart,
  Briefcase,
  Wallet,
  Star,
  Receipt,
  Bell,
  Settings,
  User,
  ChevronLeft,
  TrendingUp,
  LogOut,
  GraduationCap,
  Crown,
} from 'lucide-react';
import { SIDEBAR_LINKS, APP } from '@/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

const iconMap: Record<string, typeof LayoutDashboard> = {
  LayoutDashboard,
  CandlestickChart,
  Briefcase,
  Wallet,
  Star,
  Receipt,
  Bell,
  TrendingUp,
  GraduationCap,
  Crown,
};

const bottomLinks = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-xl transition-[width] duration-300 lg:flex',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b border-border px-4">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-glow-sm">
            <TrendingUp className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="font-display text-sm font-bold tracking-tight">
              {APP.shortName} <span className="text-muted-foreground">Markets</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label="Toggle sidebar"
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
            collapsed && 'rotate-180',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = iconMap[link.icon] ?? LayoutDashboard;
          const active = location.pathname === link.href || location.pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        {bottomLinks.map((link) => {
          const active = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
        <Button
          variant="ghost"
          className={cn('w-full justify-start gap-3 text-muted-foreground hover:text-danger', collapsed && 'px-0')}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const location = useLocation();
  const items = SIDEBAR_LINKS.slice(0, 5);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass-strong lg:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {items.map((link) => {
          const Icon = iconMap[link.icon] ?? LayoutDashboard;
          const active = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { AnimatePresence };
