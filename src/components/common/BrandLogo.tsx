import { cn } from '@/lib/utils';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  if (compact) {
    return (
      <img
        src="/branding/velora_app_icon.png"
        alt="Velora Markets"
        className={cn('h-9 w-9 object-contain', className)}
      />
    );
  }

  return (
    <picture className={cn('block', className)}>
      <img
        src="/branding/velora_light_horizontal_logo.png"
        alt="Velora Markets — Learn. Trade. Grow. Together."
        className="block h-full w-full object-contain dark:hidden"
      />
      <img
        src="/branding/velora_dark_horizontal_logo.png"
        alt="Velora Markets — Learn. Trade. Grow. Together."
        className="hidden h-full w-full object-contain dark:block"
      />
    </picture>
  );
}
