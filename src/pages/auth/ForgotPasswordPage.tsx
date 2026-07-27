import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/auth-schemas';
import { useAuth } from '@/contexts/auth-context';
import { AuthShell } from '@/components/auth/AuthShell';
import { FormField } from '@/components/auth/FormField';
import { AuthSuccess } from '@/components/auth/AuthSuccess';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setEmail(data.email);
    await sendPasswordReset(data.email);
    setSent(true);
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      {sent ? (
        <AuthSuccess
          title="Check your inbox"
          description={
            <>
              We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
              The link will expire in 30 minutes.
            </>
          }
          action={
            <Button asChild className="w-full sm:w-auto">
              <Link to="/reset-password">Open reset page</Link>
            </Button>
          }
          secondaryAction={
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/login">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
              </Link>
            </Button>
          }
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" size="lg" className="w-full shadow-glow-sm">
            Send reset link <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}

      {!sent && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
            Sign in
          </Link>
        </p>
      )}
    </AuthShell>
  );
}
