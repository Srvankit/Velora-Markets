import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import { profileSetupSchema, type ProfileSetupInput } from '@/lib/auth-schemas';
import { useAuth } from '@/contexts/auth-context';
import { AuthShell } from '@/components/auth/AuthShell';
import { Stepper } from '@/components/auth/Stepper';
import { AvatarPicker } from '@/components/auth/AvatarPicker';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CURRENCIES,
  COUNTRIES,
  TIMEZONES,
  INVESTMENT_EXPERIENCES,
  RISK_PROFILES,
  OCCUPATIONS,
  INCOME_RANGES,
  INVESTMENT_GOALS,
  PREFERRED_MARKETS,
} from '@/constants';
import { cn } from '@/lib/utils';

const STEPS = ['Profile', 'Preferences', 'Goals'];

export default function ProfileSetupPage() {
  const { user, completeProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ProfileSetupInput>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      currency: user?.currency ?? '',
      country: user?.country ?? '',
      timezone: user?.timezone ?? '',
      investmentExperience: 'beginner',
      riskProfile: 'moderate',
      occupation: user?.occupation ?? '',
      annualIncomeRange: user?.annualIncomeRange ?? '',
      investmentGoals: user?.investmentGoals ?? [],
      preferredMarkets: user?.preferredMarkets ?? [],
    },
  });

  const values = watch();

  const next = async () => {
    const fieldsPerStep: (keyof ProfileSetupInput)[][] = [
      ['currency', 'country', 'timezone'],
      ['investmentExperience', 'riskProfile', 'occupation', 'annualIncomeRange'],
      ['investmentGoals', 'preferredMarkets'],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: ProfileSetupInput) => {
    await completeProfile({ ...data, avatar });
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthShell
      title="Complete your profile"
      subtitle="A few details to personalize your Velora Markets experience."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Stepper steps={STEPS} current={step} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <AvatarPicker value={avatar} name={user?.name} onChange={setAvatar} />

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Preferred currency"
                  value={values.currency}
                  onChange={(v) => setValue('currency', v, { shouldValidate: true })}
                  error={errors.currency?.message}
                  placeholder="Select currency"
                  items={CURRENCIES.map((c) => ({ value: c.code, label: `${c.symbol} ${c.code} — ${c.label}` }))}
                />
                <SelectField
                  label="Country"
                  value={values.country}
                  onChange={(v) => setValue('country', v, { shouldValidate: true })}
                  error={errors.country?.message}
                  placeholder="Select country"
                  items={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
                />
              </div>

              <SelectField
                label="Timezone"
                value={values.timezone}
                onChange={(v) => setValue('timezone', v, { shouldValidate: true })}
                error={errors.timezone?.message}
                placeholder="Select your timezone"
                items={TIMEZONES.map((t) => ({ value: t.value, label: t.label }))}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Investment experience</label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {INVESTMENT_EXPERIENCES.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={values.investmentExperience === opt.value}
                      onClick={() => setValue('investmentExperience', opt.value, { shouldValidate: true })}
                      title={opt.label}
                      description={opt.description}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Risk profile</label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {RISK_PROFILES.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={values.riskProfile === opt.value}
                      onClick={() => setValue('riskProfile', opt.value, { shouldValidate: true })}
                      title={opt.label}
                      description={opt.description}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Occupation"
                  value={values.occupation}
                  onChange={(v) => setValue('occupation', v, { shouldValidate: true })}
                  error={errors.occupation?.message}
                  placeholder="Select occupation"
                  items={OCCUPATIONS.map((o) => ({ value: o.value, label: o.label }))}
                />
                <SelectField
                  label="Annual income range"
                  value={values.annualIncomeRange}
                  onChange={(v) => setValue('annualIncomeRange', v, { shouldValidate: true })}
                  error={errors.annualIncomeRange?.message}
                  placeholder="Select range"
                  items={INCOME_RANGES.map((r) => ({ value: r.value, label: r.label }))}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Investment goals</label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {INVESTMENT_GOALS.map((opt) => (
                    <MultiOptionCard
                      key={opt.value}
                      selected={values.investmentGoals.includes(opt.value)}
                      onClick={() => {
                        const current = values.investmentGoals;
                        const next = current.includes(opt.value)
                          ? current.filter((v) => v !== opt.value)
                          : [...current, opt.value];
                        setValue('investmentGoals', next, { shouldValidate: true });
                      }}
                      title={opt.label}
                      description={opt.description}
                    />
                  ))}
                </div>
                {errors.investmentGoals && (
                  <p className="text-xs font-medium text-danger">{errors.investmentGoals.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Preferred markets</label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {PREFERRED_MARKETS.map((opt) => (
                    <MultiOptionCard
                      key={opt.value}
                      selected={values.preferredMarkets.includes(opt.value)}
                      onClick={() => {
                        const current = values.preferredMarkets;
                        const next = current.includes(opt.value)
                          ? current.filter((v) => v !== opt.value)
                          : [...current, opt.value];
                        setValue('preferredMarkets', next, { shouldValidate: true });
                      }}
                      title={opt.label}
                    />
                  ))}
                </div>
                {errors.preferredMarkets && (
                  <p className="text-xs font-medium text-danger">{errors.preferredMarkets.message}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          {step > 0 && (
            <Button type="button" variant="outline" size="lg" onClick={back} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button type="button" size="lg" onClick={next} className="flex-1 shadow-glow-sm">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="lg" className="flex-1 shadow-glow-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  Save & continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </AuthShell>
  );
}

function SelectField({
  label,
  value,
  onChange,
  error,
  placeholder,
  items,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder: string;
  items: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium leading-none">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-lg bg-card/60" aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors',
        selected ? 'border-primary bg-primary/10 shadow-glow-sm' : 'border-border bg-card/60 hover:bg-accent',
      )}
    >
      {selected && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </span>
      )}
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </motion.button>
  );
}

function MultiOptionCard({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-colors',
        selected ? 'border-primary bg-primary/10 shadow-glow-sm' : 'border-border bg-card/60 hover:bg-accent',
      )}
    >
      {selected && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </span>
      )}
      <span className="text-sm font-semibold">{title}</span>
      {description && <span className="text-xs text-muted-foreground">{description}</span>}
    </motion.button>
  );
}
