import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, User, Bell, Shield, Palette, Globe, Download, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PreferencePanel } from '@/components/user/PreferencePanel';
import { ExportGrid } from '@/components/user/ExportCard';
import { userProfile } from '@/data/profile';
import { notificationPreferences } from '@/data/notifications';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { languages, dateFormats, currencyFormats } from '@/data/preferences';
import { cn } from '@/lib/utils';
import {
  backendApi,
  type BackendUserResponse,
} from '@/services/backend';

const settingsSections = [
  { id: 'account', label: 'Account', icon: User, description: 'Personal information, email, phone, username' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage notification preferences' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, devices, sessions' },
  { id: 'preferences', label: 'Preferences', icon: Palette, description: 'Theme, accent, layout, language' },
  { id: 'export', label: 'Export', icon: Download, description: 'Download data and reports' },
  { id: 'help', label: 'Help Center', icon: HelpCircle, description: 'FAQ, support, feedback' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');
  const [search, setSearch] = useState('');
  const [notifPrefs, setNotifPrefs] = useState(notificationPreferences);

  const filteredSections = settingsSections.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account, security, and preferences</p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search settings..." className="pl-9" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Settings Sidebar */}
        <Card className="h-fit p-3">
          <div className="space-y-1">
            {filteredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  if (section.id === 'security') { navigate('/security'); return; }
                  if (section.id === 'help') { navigate('/help-center'); return; }
                  if (section.id === 'notifications') { navigate('/notifications'); return; }
                  setActiveSection(section.id);
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors',
                  activeSection === section.id ? 'bg-accent' : 'hover:bg-accent/50',
                )}
              >
                <section.icon className={cn('h-4 w-4', activeSection === section.id ? 'text-primary' : 'text-muted-foreground')} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{section.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{section.description}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Card>

        {/* Settings Content */}
        <div className="space-y-4">
          {activeSection === 'account' && <AccountSettings />}
          {activeSection === 'preferences' && <PreferencePanel />}
          {activeSection === 'export' && <ExportGrid />}
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  
  const [form, setForm] = useState({
    fullName: userProfile.fullName,
    username: userProfile.username,
    email: userProfile.email,
    phone: userProfile.phone,
    language: 'English (US)',
    region: userProfile.country,
    currency: userProfile.currency,
    timezone: userProfile.timezone,
  });

  const loadProfile = useCallback(async () => {
    try {
      const user = await backendApi.me();

      setForm((prev) => ({
        ...prev,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone ?? '',
        region: user.country ?? '',
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  void loadProfile();
}, [loadProfile]);

  const handleSave = async () => {
    try {
      setSaving(true);

      await backendApi.updateProfile({
        fullName: form.fullName,
        username: form.username,
        phone: form.phone,
        country: form.region,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
};

if (loading) {
  return (
    <Card className="p-5">
      <p>Loading account...</p>
    </Card>
  );
}

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Account Settings</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Full Name</Label>
          <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Username</Label>
          <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Email</Label>
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Phone Number</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Language</Label>
          <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Region</Label>
          <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Currency</Label>
          <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{currencyFormats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Timezone</Label>
          <Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
}
