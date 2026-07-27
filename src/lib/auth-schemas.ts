import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password is too long')
  .refine((val) => /[A-Z]/.test(val), 'Include at least one uppercase letter')
  .refine((val) => /[a-z]/.test(val), 'Include at least one lowercase letter')
  .refine((val) => /[0-9]/.test(val), 'Include at least one number');

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name is too long')
      .refine((val) => /^[a-zA-Z\s]+$/.test(val), 'Name can only contain letters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username is too long')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z
      .string()
      .min(7, 'Enter a valid phone number')
      .max(20, 'Phone number is too long')
      .refine((val) => /^[0-9+\-\s()]+$/.test(val), 'Enter a valid phone number'),
    country: z.string().min(1, 'Select your country'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
    acceptTerms: z
      .boolean()
      .refine((v) => v === true, 'You must accept the Terms & Conditions'),
    acceptPrivacy: z
      .boolean()
      .refine((v) => v === true, 'You must accept the Privacy Policy'),
    acceptMarketing: z.boolean().optional().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const profileSetupSchema = z.object({
  currency: z.string().min(1, 'Select your preferred currency'),
  country: z.string().min(1, 'Select your country'),
  timezone: z.string().min(1, 'Select your timezone'),
  investmentExperience: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  riskProfile: z.enum(['conservative', 'moderate', 'balanced', 'aggressive']),
  occupation: z.string().min(1, 'Select your occupation'),
  annualIncomeRange: z.string().min(1, 'Select your income range'),
  investmentGoals: z
    .array(z.string())
    .min(1, 'Select at least one investment goal'),
  preferredMarkets: z
    .array(z.string())
    .min(1, 'Select at least one market'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;

/**
 * Scores password strength on a 0–4 scale based on length and character variety.
 */
export function scorePassword(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}
