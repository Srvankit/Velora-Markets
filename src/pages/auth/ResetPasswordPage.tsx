import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/auth-schemas';
import { useAuth } from '@/contexts/auth-context';
import { AuthShell } from '@/components/auth/AuthShell';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { Button } from '@/components/ui/button';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [done, setDone] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    await resetPassword(data.password);
    setDone(true);
  };

  if (done) {
    return (
      <AuthShell title="Password reset" subtitle="Your password has been updated successfully.">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={2} />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold tracking-tight">All set</h1>
            <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
              Your password has been reset. You can now sign in with your new password.
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/login">Continue to login</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset password" subtitle="Choose a new password for your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <PasswordInput
            label="New password"
            placeholder="Enter new password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              onChange: (e) => setPasswordValue(e.target.value),
            })}
          />
          {passwordValue && <PasswordStrength password={passwordValue} />}
        </div>

        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" className="w-full shadow-glow-sm">
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          to="/login"
          className="inline-flex items-center font-semibold text-primary transition-colors hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
