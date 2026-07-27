import { motion } from 'framer-motion';
import { Lock, ShieldCheck, Fingerprint, Smartphone, Monitor } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { securityInfo, recentDevices } from '@/data/wallet';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export function SecurityCard() {
  const securityItems = [
    { icon: Lock, label: 'Wallet PIN', description: 'Require PIN for transactions', enabled: securityInfo.walletPinEnabled },
    { icon: ShieldCheck, label: 'Two-Factor Authentication', description: 'Extra layer of security on login', enabled: securityInfo.twoFactorEnabled },
    { icon: Fingerprint, label: 'Biometric Login', description: 'Use fingerprint or face ID', enabled: securityInfo.biometricEnabled },
  ];

  return (
    <Card className="p-5">
      <h3 className="mb-4 font-display text-base font-semibold">Security</h3>

      <div className="space-y-3">
        {securityItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center justify-between gap-2 rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-2.5">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', item.enabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <Switch checked={item.enabled} />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Devices</p>
        <div className="space-y-2">
          {recentDevices.map((device, i) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-2.5 text-xs"
            >
              <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{device.device}</span>
                  {device.current && <Badge variant="outline" className="border-0 bg-success/10 text-[10px] text-success">Current</Badge>}
                </div>
                <p className="text-muted-foreground">{device.location} - {formatRelativeTime(device.lastActive)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}
