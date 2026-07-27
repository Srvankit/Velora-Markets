import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/theme-context';
import { defaultPreferences, defaultAccessibility, accentColors, languages, dateFormats, currencyFormats, type UserPreferences, type AccessibilitySettings } from '@/data/preferences';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Palette, Type, Accessibility as AccessibilityIcon, Monitor, Moon, Sun, Languages } from 'lucide-react';

interface PreferenceSectionProps {
  title: string;
  icon: typeof Palette;
  children: React.ReactNode;
}

function PreferenceSection({ title, icon: Icon, children }: PreferenceSectionProps) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      {children}
    </Card>
  );
}

export function PreferencePanel() {
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [a11y, setA11y] = useState<AccessibilitySettings>(defaultAccessibility);

  return (
    <div className="space-y-4">
      {/* Appearance */}
      <PreferenceSection title="Appearance" icon={Palette}>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'system', label: 'System', icon: Monitor },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setPrefs({ ...prefs, theme: opt.value }); if (opt.value !== 'system') setTheme(opt.value); }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-colors',
                    prefs.theme === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent',
                  )}
                >
                  <opt.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Accent Color</p>
            <div className="flex flex-wrap gap-2">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setPrefs({ ...prefs, accentColor: color.value })}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors',
                    prefs.accentColor === color.value ? 'border-primary' : 'border-border hover:bg-accent',
                  )}
                >
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: color.color }} />
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            label="Compact Mode"
            description="Reduce padding and spacing for denser layout"
            checked={prefs.compactMode}
            onChange={(v) => setPrefs({ ...prefs, compactMode: v })}
          />
          <ToggleRow
            label="Animations"
            description="Enable smooth transitions and animations"
            checked={prefs.animations}
            onChange={(v) => setPrefs({ ...prefs, animations: v })}
          />
          <ToggleRow
            label="Dashboard Layout"
            description="Switch between grid and list layout"
            checked={prefs.dashboardLayout === 'grid'}
            onChange={(v) => setPrefs({ ...prefs, dashboardLayout: v ? 'grid' : 'list' })}
          />
        </div>
      </PreferenceSection>

      {/* Localization */}
      <PreferenceSection title="Language & Region" icon={Languages}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-sm font-medium">Language</p>
            <Select value={prefs.language} onValueChange={(v) => setPrefs({ ...prefs, language: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {languages.map((lang) => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Date Format</p>
            <Select value={prefs.dateFormat} onValueChange={(v) => setPrefs({ ...prefs, dateFormat: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {dateFormats.map((fmt) => <SelectItem key={fmt} value={fmt}>{fmt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Currency Format</p>
            <Select value={prefs.currencyFormat} onValueChange={(v) => setPrefs({ ...prefs, currencyFormat: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currencyFormats.map((fmt) => <SelectItem key={fmt} value={fmt}>{fmt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Time Format</p>
            <Select value={prefs.timeFormat} onValueChange={(v) => setPrefs({ ...prefs, timeFormat: v as '12h' | '24h' })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PreferenceSection>

      {/* Accessibility */}
      <PreferenceSection title="Accessibility" icon={AccessibilityIcon}>
        <div className="space-y-4">
          <ToggleRow
            label="High Contrast Mode"
            description="Increase contrast for better readability"
            checked={a11y.highContrast}
            onChange={(v) => setA11y({ ...a11y, highContrast: v })}
          />
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Font Scaling</p>
                <p className="text-xs text-muted-foreground">Adjust text size ({a11y.fontScale}%)</p>
              </div>
              <span className="text-sm font-bold tabular-nums">{a11y.fontScale}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="150"
              step="10"
              value={a11y.fontScale}
              onChange={(e) => setA11y({ ...a11y, fontScale: parseInt(e.target.value) })}
              className="mt-2 w-full accent-primary"
            />
          </div>
          <ToggleRow
            label="Keyboard Navigation"
            description="Enhanced keyboard shortcuts and navigation"
            checked={a11y.keyboardNavigation}
            onChange={(v) => setA11y({ ...a11y, keyboardNavigation: v })}
          />
          <ToggleRow
            label="Reduce Motion"
            description="Minimize animations and transitions"
            checked={a11y.reduceMotion}
            onChange={(v) => setA11y({ ...a11y, reduceMotion: v })}
          />
          <ToggleRow
            label="Screen Reader Support"
            description="Optimized for assistive technologies"
            checked={a11y.screenReader}
            onChange={(v) => setA11y({ ...a11y, screenReader: v })}
          />
        </div>
      </PreferenceSection>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-2 rounded-lg border border-border p-3"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </motion.div>
  );
}
