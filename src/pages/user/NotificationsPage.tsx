import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { NotificationCard } from '@/components/user/NotificationCard';
import { notifications as initialNotifications, notificationTabs, notificationPreferences, type NotificationCategory, type AppNotification } from '@/data/notifications';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotificationCategory | 'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [prefs, setPrefs] = useState(notificationPreferences);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'unread') return !n.read;
      if (activeTab === 'all') return true;
      return n.category === activeTab;
    });
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const togglePref = (id: string, channel: 'email' | 'push' | 'sms') => {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, [channel]: !p[channel] } : p)));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-3.5 w-3.5" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/preferences')}>
            <Settings2 className="h-3.5 w-3.5" />
            Preferences
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {notificationTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              activeTab === tab.value ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:bg-accent',
            )}
          >
            {tab.label}
            {tab.value === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 rounded bg-primary/20 px-1 py-0.5 text-[10px]">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Bell className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((notif, i) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                  delay={i * 0.03}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>

      {/* Notification Preferences */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Notification Preferences</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-2 text-left font-medium">Notification Type</th>
                <th className="pb-2 text-center font-medium">Email</th>
                <th className="pb-2 text-center font-medium">Push</th>
                <th className="pb-2 text-center font-medium">SMS</th>
              </tr>
            </thead>
            <tbody>
              {prefs.map((pref, i) => (
                <motion.tr
                  key={pref.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="border-b border-border/50"
                >
                  <td className="py-3">
                    <p className="text-sm font-medium">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.description}</p>
                  </td>
                  <td className="py-3 text-center"><div className="flex justify-center"><Switch checked={pref.email} onCheckedChange={() => togglePref(pref.id, 'email')} /></div></td>
                  <td className="py-3 text-center"><div className="flex justify-center"><Switch checked={pref.push} onCheckedChange={() => togglePref(pref.id, 'push')} /></div></td>
                  <td className="py-3 text-center"><div className="flex justify-center"><Switch checked={pref.sms} onCheckedChange={() => togglePref(pref.id, 'sms')} /></div></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
