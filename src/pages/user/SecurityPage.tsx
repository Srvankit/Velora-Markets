import { motion } from 'framer-motion';
import { Shield, Download, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityDashboard } from '@/components/user/SecurityDashboard';
import { loginHistory, trustedDevices } from '@/data/security';
import { formatRelativeTime, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function SecurityPage() {
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
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Security</h1>
            <p className="text-sm text-muted-foreground">Manage your account security and devices</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </motion.div>

      <SecurityDashboard />

      {/* Login History */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Login History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="pb-2 text-left font-medium">Browser</th>
                <th className="pb-2 text-left font-medium">OS</th>
                <th className="pb-2 text-left font-medium">Location</th>
                <th className="pb-2 text-left font-medium">Device</th>
                <th className="pb-2 text-left font-medium">IP Address</th>
                <th className="pb-2 text-left font-medium">Login Time</th>
                <th className="pb-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loginHistory.map((session, i) => (
                <motion.tr
                  key={session.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="border-b border-border/50"
                >
                  <td className="py-2.5 text-xs">{session.browser}</td>
                  <td className="py-2.5 text-xs">{session.os}</td>
                  <td className="py-2.5 text-xs">{session.location}</td>
                  <td className="py-2.5 text-xs">{session.device}</td>
                  <td className="py-2.5 font-mono text-xs text-muted-foreground">{session.ipAddress}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">{formatRelativeTime(session.loginTime)}</td>
                  <td className="py-2.5">
                    {session.current ? (
                      <Badge variant="outline" className="border-0 bg-success/10 text-xs text-success">Current</Badge>
                    ) : session.status === 'active' ? (
                      <Badge variant="outline" className="border-0 bg-primary/10 text-xs text-primary">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="border-0 bg-muted text-xs text-muted-foreground">Ended</Badge>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Trusted Devices */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Trusted Devices</h3>
        <div className="space-y-2">
          {trustedDevices.map((device, i) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center justify-between gap-2 rounded-lg border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium">{device.name}</p>
                <p className="text-xs text-muted-foreground">{device.type} - Last used {formatRelativeTime(device.lastUsed)}</p>
              </div>
              <div className="flex items-center gap-2">
                {device.trusted && <Badge variant="outline" className="border-0 bg-success/10 text-xs text-success">Trusted</Badge>}
                <Button variant="ghost" size="sm" className="h-7 text-xs text-danger hover:text-danger">Remove</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Account Recovery */}
      <Card className="p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Account Recovery</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <p className="text-sm font-medium">Recovery Email</p>
            <p className="text-xs text-muted-foreground">alex.morgan.backup@gmail.com</p>
            <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">Update</Button>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-sm font-medium">Recovery Phone</p>
            <p className="text-xs text-muted-foreground">+1 (415) 555-0199</p>
            <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">Update</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
