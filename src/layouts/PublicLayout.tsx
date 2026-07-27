import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function PublicLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  );
}
