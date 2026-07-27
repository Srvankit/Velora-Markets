import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { Sidebar, MobileTabBar } from '@/components/layout/Sidebar';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search markets, symbols…"
              className="h-9 rounded-lg border-border bg-card pl-9 text-sm"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
            </Button>
            <ThemeToggle />
            <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              V
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:pb-6">
          {children ?? <Outlet />}
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
