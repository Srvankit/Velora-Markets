import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Facebook } from 'lucide-react';
import { APP } from '@/constants';
import { BrandLogo } from '@/components/common/BrandLogo';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#about' },
      { label: 'Careers', href: '/#' },
      { label: 'Press', href: '/#' },
      { label: 'Blog', href: '/#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '/#' },
      { label: 'Documentation', href: '/#' },
      { label: 'API Reference', href: '/#' },
      { label: 'Community', href: '/#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/#' },
      { label: 'Privacy', href: '/#' },
      { label: 'Cookies', href: '/#' },
      { label: 'Disclosures', href: '/#' },
    ],
  },
];

const socials = [
  { icon: Twitter, href: '/#', label: 'Twitter' },
  { icon: Linkedin, href: '/#', label: 'LinkedIn' },
  { icon: Github, href: '/#', label: 'GitHub' },
  { icon: Facebook, href: '/#', label: 'Facebook' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <BrandLogo className="h-14 w-[220px]" />
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground">{APP.description}</p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Investing involves risk. Past performance is not indicative of future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
