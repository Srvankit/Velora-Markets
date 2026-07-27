import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { PreferencePanel } from '@/components/user/PreferencePanel';

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Preferences</h1>
            <p className="text-sm text-muted-foreground">Customize your experience and accessibility settings</p>
          </div>
        </div>
      </motion.div>
      <PreferencePanel />
    </div>
  );
}
