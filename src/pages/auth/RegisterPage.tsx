import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AtSign, Mail, Phone, Loader2, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@/lib/auth-schemas';
import { useAuth } from '@/contexts/auth-context';
import { AuthShell } from '@/components/auth/AuthShell';
import { FormField } from '@/components/auth/FormField';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES } from '@/constants';

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      phone: '',
      country: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      acceptPrivacy: false,
      acceptMarketing: false,
    },
  });

  const completedFields = [
    watch('fullName'),
    watch('username'),
    watch('email'),
    watch('phone'),
    watch('country'),
    watch('password'),
    watch('confirmPassword'),
  ].filter(Boolean).length;
  const progress = Math.round((completedFields / 7) * 100);

  const country = watch('country');

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      await registerUser({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phone: data.phone,
        country: data.country,
        password: data.password,
      });
      navigate('/account-created', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unable to create your account. Please try again.');
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Velora Markets and start investing in minutes."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence>
          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Full name"
            placeholder="Jane Doe"
            autoComplete="name"
            icon={<User className="h-4 w-4" />}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <FormField
            label="Username"
            placeholder="janedoe"
            autoComplete="username"
            icon={<AtSign className="h-4 w-4" />}
            error={errors.username?.message}
            {...register('username')}
          />
        </div>

        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Phone number"
            type="tel"
            placeholder="+1 555 000 0000"
            autoComplete="tel"
            icon={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">Country</label>
            <Select
              value={country}
              onValueChange={(v) => setValue('country', v, { shouldValidate: true })}
            >
              <SelectTrigger
                className="h-11 rounded-lg bg-card/60"
                aria-invalid={!!errors.country}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-xs font-medium text-danger">{errors.country.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
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
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Progress indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Profile completion</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  className="mt-0.5"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              )}
            />
            <span>
              I agree to the{' '}
              <a href="#terms" className="font-medium text-primary hover:underline">
                Terms & Conditions
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-xs font-medium text-danger">{errors.acceptTerms.message}</p>
          )}

          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
            <Controller
              name="acceptPrivacy"
              control={control}
              render={({ field }) => (
                <Checkbox
                  className="mt-0.5"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              )}
            />
            <span>
              I agree to the{' '}
              <a href="#privacy" className="font-medium text-primary hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptPrivacy && (
            <p className="text-xs font-medium text-danger">{errors.acceptPrivacy.message}</p>
          )}

          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
            <Controller
              name="acceptMarketing"
              control={control}
              render={({ field }) => (
                <Checkbox
                  className="mt-0.5"
                  checked={field.value ?? false}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
              )}
            />
            <span>
              Send me marketing emails about products, insights, and market updates (optional)
            </span>
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full shadow-glow-sm" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : (
            <>
              Create account <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
