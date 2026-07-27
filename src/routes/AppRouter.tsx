import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { ComingSoon } from '@/pages/ComingSoon';
import { PageLoader } from '@/components/common/PageLoader';
import { Outlet } from 'react-router-dom';
import { ProtectedRoute, RequireGuest } from '@/components/auth/ProtectedRoute';
import { TradingProvider } from '@/contexts/trading-context';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const AccountCreatedPage = lazy(() => import('@/pages/auth/AccountCreatedPage'));
const ProfileSetupPage = lazy(() => import('@/pages/auth/ProfileSetupPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const MarketsPage = lazy(() => import('@/pages/MarketsPage'));
const StockDetailPage = lazy(() => import('@/pages/StockDetailPage'));
const TradePage = lazy(() => import('@/pages/TradePage'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const HoldingsPage = lazy(() => import('@/pages/HoldingsPage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const WalletPage = lazy(() => import('@/pages/WalletPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));
const PaymentMethodsPage = lazy(() => import('@/pages/PaymentMethodsPage'));
const AIDashboardPage = lazy(() => import('@/pages/ai/AIDashboardPage'));
const AIChatPage = lazy(() => import('@/pages/ai/AIChatPage'));
const AIInsightsPage = lazy(() => import('@/pages/ai/AIInsightsPage'));
const AIRiskAnalysisPage = lazy(() => import('@/pages/ai/AIRiskAnalysisPage'));
const AIRecommendationsPage = lazy(() => import('@/pages/ai/AIRecommendationsPage'));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/user/SettingsPage'));
const SecurityPage = lazy(() => import('@/pages/user/SecurityPage'));
const NotificationsPage = lazy(() => import('@/pages/user/NotificationsPage'));
const AccountPage = lazy(() => import('@/pages/user/AccountPage'));
const PreferencesPage = lazy(() => import('@/pages/user/PreferencesPage'));
const ActivityPage = lazy(() => import('@/pages/user/ActivityPage'));
const HelpCenterPage = lazy(() => import('@/pages/user/HelpCenterPage'));
const WatchlistPage = lazy(() => import('@/pages/WatchlistPage'));

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Auth routes (guest-only, full-screen shell) */}
        <Route element={<RequireGuest />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Post-registration flows (require a session) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/account-created" element={<AccountCreatedPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/complete-profile" element={<ProfileSetupPage />} />
        </Route>

        {/* App routes (authenticated) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<TradingWrapper />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/market" element={<MarketsPage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/holdings" element={<HoldingsPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/ai" element={<AIDashboardPage />} />
            <Route path="/ai/chat" element={<AIChatPage />} />
            <Route path="/ai/insights" element={<AIInsightsPage />} />
            <Route path="/ai/risk-analysis" element={<AIRiskAnalysisPage />} />
            <Route path="/ai/recommendations" element={<AIRecommendationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/admin" element={<ComingSoon title="Admin" description="Platform administration console." />} />
            <Route path="/stock/:symbol" element={<StockDetailPage />} />
            <Route path="/stocks/:symbol" element={<StockDetailPage />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<ComingSoon title="Page not found" description="The page you are looking for does not exist." />} />
      </Routes>
    </Suspense>
  );
}

function TradingWrapper() {
  return (
    <TradingProvider>
      <Outlet />
    </TradingProvider>
  );
}
