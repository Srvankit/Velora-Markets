import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { AuthShell } from '@/components/auth/AuthShell';
import { AuthSuccess } from '@/components/auth/AuthSuccess';
import { Button } from '@/components/ui/button';

type State = 'idle' | 'verifying' | 'success' | 'failed';

export default function VerifyEmailPage() {
  const { user, verifyEmail, isLoading } = useAuth();
  const [state, setState] = useState<State>('idle');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleVerify = async () => {
    setState('verifying');
    try {
      await verifyEmail();
      setState('success');
    } catch {
      setState('failed');
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
  };

  if (state === 'success') {
    return (
      <AuthShell title="Email verified" subtitle="Your email has been confirmed.">
        <AuthSuccess
          title="Email verified"
          description="Your email address has been verified. You now have full access to Velora Markets."
          action={
            <Button asChild className="w-full sm:w-auto">
              <Link to={user && !user.profileCompleted ? '/profile-setup' : '/dashboard'}>
                Continue
              </Link>
            </Button>
          }
        />
      </AuthShell>
    );
  }

  if (state === 'failed') {
    return (
      <AuthShell title="Verification failed" subtitle="We couldn't verify your email.">
        <AuthSuccess
          variant="failed"
          title="Verification failed"
          description="The verification link may have expired or is invalid. You can request a new verification email."
          action={
            <Button onClick={handleVerify} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Try again
            </Button>
          }
          secondaryAction={
            <Button
              variant="outline"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
            </Button>
          }
        />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify your email"
      subtitle="Confirm your email address to secure your account."
    >
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/20 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-9 w-9 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground sm:text-base">
              We sent a verification link to{' '}
              <span className="font-semibold text-foreground">
                {user?.email ?? 'your email'}
              </span>
              . Click the link in the email to verify your account.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or request a new one.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleVerify} disabled={isLoading} size="lg" className="w-full shadow-glow-sm">
            {state === 'verifying' || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying…
              </>
            ) : (
              'I have verified my email'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend verification email'}
          </Button>
        </div>

        <p className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
