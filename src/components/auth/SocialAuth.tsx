import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const providers = [
  {
    id: 'google' as const,
    label: 'Google',
    icon: GoogleIcon,
  },
  {
    id: 'github' as const,
    label: 'GitHub',
    icon: GithubIcon,
  },
];

export function SocialAuth({ onError }: { onError?: (message: string) => void }) {
  const { loginWithProvider, isLoading } = useAuth();

  const handle = async (provider: 'google' | 'github') => {
    try {
      await loginWithProvider(provider);
    } catch {
      onError?.('Unable to sign in with the selected provider. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map((p) => (
        <motion.button
          key={p.id}
          type="button"
          onClick={() => handle(p.id)}
          disabled={isLoading}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex h-11 items-center justify-center gap-2.5 rounded-lg border border-border bg-card/60 text-sm font-medium transition-colors hover:bg-accent',
            isLoading && 'pointer-events-none opacity-60',
          )}
        >
          <p.icon />
          <span>{p.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 10.99.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.21.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.3-5.47-5.79 0-1.28.47-2.33 1.23-3.15-.12-.3-.53-1.51.12-3.15 0 0 1-.32 3.3 1.2a11.6 11.6 0 0 1 6 0c2.3-1.52 3.3-1.2 3.3-1.2.65 1.64.24 2.85.12 3.15.77.82 1.23 1.87 1.23 3.15 0 4.5-2.81 5.48-5.49 5.78.43.36.81 1.08.81 2.18 0 1.58-.01 2.85-.01 3.24 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}
