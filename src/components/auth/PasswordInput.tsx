import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormField, type FormFieldProps } from '@/components/auth/FormField';

type PasswordInputProps = Omit<FormFieldProps, 'type' | 'icon' | 'trailing'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <FormField
        ref={ref}
        type={visible ? 'text' : 'password'}
        icon={<Lock className="h-4 w-4" />}
        trailing={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...props}
      />
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
