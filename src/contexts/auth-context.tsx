import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthSession, AuthUser, ProfileSetupData } from '@/types';
import { AUTH_STORAGE_KEY } from '@/constants';
import { backendApi, getApiErrorMessage, type BackendAuthResponse, type BackendUserResponse } from '@/services/backend';
import { sleep } from '@/lib/format';
import { getCurrencyForCountry } from '@/lib/currency';

interface AuthContextValue {
  user: AuthUser | null; token: string | null; isAuthenticated: boolean; isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: { fullName: string; username: string; email: string; phone?: string; country?: string; password: string }) => Promise<AuthUser>;
  loginWithProvider: (provider: 'google' | 'github') => Promise<AuthUser>;
  logout: () => void; verifyEmail: () => Promise<void>; sendPasswordReset: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>; completeProfile: (data: ProfileSetupData) => Promise<AuthUser>;
  updateProfile: (patch: Partial<AuthUser>) => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readSession(): AuthSession | null { try { const raw = localStorage.getItem(AUTH_STORAGE_KEY); return raw ? JSON.parse(raw) as AuthSession : null; } catch { return null; } }
function persistSession(session: AuthSession | null) { if (session) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session)); else localStorage.removeItem(AUTH_STORAGE_KEY); }
function toUser(data: BackendUserResponse | BackendAuthResponse, previous?: AuthUser | null): AuthUser {
  const isMe = 'id' in data;
  const country = (data.country && data.country.trim()) || previous?.country || undefined;
  const currency = (data.currency && data.currency.trim()) || previous?.currency || getCurrencyForCountry(country);
  const subscriptionTier = (data.subscriptionTier && data.subscriptionTier.trim()) || previous?.subscriptionTier || 'STANDARD';
  const subscriptionStatus = ('subscriptionStatus' in data && data.subscriptionStatus ? data.subscriptionStatus : previous?.subscriptionStatus || 'ACTIVE');
  return {
    id: String(isMe ? data.id : data.userId),
    name: data.fullName,
    email: data.email,
    username: data.username,
    phone: isMe ? (data.phone ?? undefined) : (previous?.phone),
    country,
    currency,
    subscriptionTier,
    subscriptionStatus,
    avatar: previous?.avatar,
    timezone: previous?.timezone,
    investmentExperience: previous?.investmentExperience,
    riskProfile: previous?.riskProfile,
    occupation: previous?.occupation,
    annualIncomeRange: previous?.annualIncomeRange,
    investmentGoals: previous?.investmentGoals,
    preferredMarkets: previous?.preferredMarkets,
    kycStatus: previous?.kycStatus ?? 'unverified',
    emailVerified: isMe ? data.emailVerified : previous?.emailVerified ?? false,
    profileCompleted: previous?.profileCompleted ?? true,
    createdAt: previous?.createdAt ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(readSession);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => { persistSession(session); }, [session]);
  useEffect(() => {
    if (!session?.token) return;
    backendApi.me().then((me) => setSession((prev) => prev ? { ...prev, user: toUser(me, prev.user) } : prev)).catch(() => setSession(null));
  }, []); // restore/validate once on startup

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await backendApi.login(email, password);
      if (!response.token) throw new Error('The backend did not return an authentication token.');
      // Set token first so /users/me is authenticated.
      const provisional = toUser(response);
      const nextSession = { token: response.token, user: provisional };
      persistSession(nextSession);
      const me = await backendApi.me();
      const user = toUser(me, provisional);
      setSession({ token: response.token, user });
      return user;
    } catch (e) { throw new Error(getApiErrorMessage(e, 'Unable to sign in.')); }
    finally { setIsLoading(false); }
  }, []);

  const register = useCallback(async (input: { fullName: string; username: string; email: string; phone?: string; country?: string; password: string }) => {
    setIsLoading(true);
    try {
      await backendApi.register(input);
      const response = await backendApi.login(input.email, input.password);
      if (!response.token) throw new Error('Account created, but automatic sign-in failed.');
      const user = toUser(response);
      setSession({ token: response.token, user });
      return user;
    } catch (e) { throw new Error(getApiErrorMessage(e, 'Unable to create your account.')); }
    finally { setIsLoading(false); }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    persistSession(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem('velora_token');
      localStorage.removeItem('velora_user');
      localStorage.removeItem('velora_auth_session');
      sessionStorage.clear();
    } catch (e) {
      console.error('Logout error clearing storage:', e);
    }
  }, []);
  const loginWithProvider = useCallback(async (_provider: 'google' | 'github') => { throw new Error('Social sign-in is not connected to the backend yet.'); }, []);
  const verifyEmail = useCallback(async () => { await sleep(300); setSession((p) => p ? { ...p, user: { ...p.user, emailVerified: true } } : p); }, []);
  const sendPasswordReset = useCallback(async (_email: string) => { throw new Error('Password reset API is not implemented yet.'); }, []);
  const resetPassword = useCallback(async (_password: string) => { throw new Error('Password reset API is not implemented yet.'); }, []);
  const completeProfile = useCallback(async (data: ProfileSetupData) => { let next: AuthUser | null = null; setSession((p) => { if (!p) return p; next = { ...p.user, ...data, profileCompleted: true }; return { ...p, user: next }; }); return next!; }, []);
  const updateProfile = useCallback((patch: Partial<AuthUser>) => setSession((p) => p ? { ...p, user: { ...p.user, ...patch } } : p), []);
  const value = useMemo(() => ({ user: session?.user ?? null, token: session?.token ?? null, isAuthenticated: Boolean(session?.token), isLoading, login, register, loginWithProvider, logout, verifyEmail, sendPasswordReset, resetPassword, completeProfile, updateProfile }), [session, isLoading, login, register, loginWithProvider, logout, verifyEmail, sendPasswordReset, resetPassword, completeProfile, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
