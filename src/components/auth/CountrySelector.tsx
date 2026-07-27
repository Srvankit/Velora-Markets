import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES } from '@/constants';
import { cn } from '@/lib/utils';

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  placeholder?: string;
}

export function CountrySelector({
  value,
  onChange,
  error,
  className,
  placeholder = 'Select country',
}: CountrySelectorProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-sm font-medium leading-none">Country</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-lg bg-card/60" aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
