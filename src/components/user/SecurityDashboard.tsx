import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { securityScore, securitySettings, passwordStrength, type SecuritySetting } from '@/data/security';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Shield, Lock, Fingerprint, Bell, KeyRound, AlertCircle, Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { backendApi, getApiErrorMessage } from '@/services/backend';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, typeof Shield> = {
  ShieldCheck: Shield,
  Fingerprint,
  Bell,
  Lock,
};

export function SecurityDashboard() {
  const [settings, setSettings] = useState(securitySettings);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const toggleSetting = (id: string) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const handleChangePassword = async () => {
  setMessage('');
  setError('');

  if (!currentPassword || !newPassword || !confirmPassword) {
    setError('Please fill in all password fields.');
    return;
  }

  if (newPassword !== confirmPassword) {
    setError('New passwords do not match.');
    return;
  }

  try {
    setSaving(true);

    await backendApi.changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    setMessage('Password changed successfully.');

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (err) {
    setError(
      getApiErrorMessage(err, 'Failed to change password.')
    );
  } finally {
    setSaving(false);
  }
};

  const scoreColor = securityScore.score >= 80 ? 'text-success' : securityScore.score >= 60 ? 'text-warning' : 'text-danger';
  const scoreBg = securityScore.score >= 80 ? 'bg-success' : securityScore.score >= 60 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="space-y-4">
      {/* Security Score */}
      <Card className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative h-[120px] w-[120px] shrink-0">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <motion.circle
                cx="60" cy="60" r="50" fill="none" stroke={scoreBg === 'bg-success' ? 'hsl(var(--success))' : scoreBg === 'bg-warning' ? 'hsl(var(--warning))' : 'hsl(var(--danger))'} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 50}
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 50 - (securityScore.score / 100) * 2 * Math.PI * 50 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('font-display text-2xl font-bold', scoreColor)}>{securityScore.score}</span>
              <span className="text-xs text-muted-foreground">{securityScore.label}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-semibold">Security Score</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your account security is {securityScore.label.toLowerCase()}. Here are some recommendations to improve:</p>
            <ul className="mt-2 space-y-1">
              {securityScore.recommendations.map((rec, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <AlertCircle className="h-3 w-3 text-warning" />
                  {rec}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
      

      {/* Security Settings */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Security Settings</h3>
        <div className="space-y-3">
          {settings.map((setting: SecuritySetting, i: number) => {
            const Icon = iconMap[setting.icon] ?? Lock;
            return (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-between gap-2 rounded-lg border border-border p-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', setting.enabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{setting.label}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <Switch checked={setting.enabled} onCheckedChange={() => toggleSetting(setting.id)} />
              </motion.div>
              
            );
          })}
        </div>
      </Card>

      {/* Password Strength */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
          <KeyRound className="h-4 w-4 text-primary" />
          Password Management
        </h3>
        <Card className="p-5">
            <h3 className="mb-4 font-display text-base font-semibold">
              Change Password
            </h3>

            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {error && (
                <p className="text-sm text-destructive">
                  {error}
                </p>
              )}

              {message && (
                <p className="text-sm text-green-600">
                  {message}
                </p>
              )}

              <Button
                onClick={handleChangePassword}
                disabled={saving}
                className="w-full"
              >
                {saving ? 'Changing Password...' : 'Change Password'}
              </Button>
            </div>
          </Card>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Password Strength</span>
          <span className="text-sm font-semibold text-success">{passwordStrength.label}</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={cn('h-2 flex-1 rounded-full', n <= passwordStrength.score ? 'bg-success' : 'bg-muted')} />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Last changed: {formatDate(passwordStrength.lastChanged)}</p>
        <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {passwordStrength.requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <span className={cn('flex h-4 w-4 items-center justify-center rounded-full', req.met ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                {req.met ? '\u2713' : '\u00d7'}
              </span>
              <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>{req.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Backup Codes */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Backup Codes</h3>
          <button className="flex items-center gap-1 text-xs text-primary hover:opacity-80">
            <Download className="h-3 w-3" />
            Download
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {securitySettings.length > 0 && (
            <>
              {[
                { id: 'bc1', code: 'VK7M-4X2P', used: false },
                { id: 'bc2', code: 'Q9RT-3W8N', used: false },
                { id: 'bc3', code: 'J5LB-6Y1C', used: false },
                { id: 'bc4', code: 'F2DH-8Z4K', used: true },
                { id: 'bc5', code: 'N7PV-5M3X', used: false },
                { id: 'bc6', code: 'B4XC-9R2T', used: false },
              ].map((code) => (
                <div
                  key={code.id}
                  className={cn(
                    'flex items-center justify-between rounded-lg border border-border px-3 py-2 font-mono text-xs',
                    code.used ? 'opacity-40 line-through' : '',
                  )}
                >
                  {code.code}
                  {!code.used && (
                    <button className="text-muted-foreground hover:text-foreground">
                      <Copy className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
