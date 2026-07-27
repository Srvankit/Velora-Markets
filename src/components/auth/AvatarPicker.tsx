import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/format';

interface AvatarPickerProps {
  value?: string;
  name?: string;
  onChange: (avatar: string | undefined) => void;
  className?: string;
}

/**
 * Circular avatar upload control with preview, hover overlay,
 * and a remove button. Stores a data-URL in state.
 */
export function AvatarPicker({ value, name, onChange, className }: AvatarPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-card/60 transition-colors hover:border-primary/50"
        >
          {value ? (
            <img src={value} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-3xl font-bold text-muted-foreground">
              {getInitials(name ?? 'V')}
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-6 w-6 text-foreground" />
          </span>
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label="Remove avatar"
            className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-danger text-danger-foreground transition-transform hover:scale-110"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">Click to upload a profile picture</p>
        {error && <p className="mt-1 text-xs font-medium text-danger">{error}</p>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
