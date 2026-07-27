export type ThemeMode = 'dark' | 'light' | 'system';
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'teal';

export interface UserPreferences {
  theme: ThemeMode;
  accentColor: AccentColor;
  compactMode: boolean;
  animations: boolean;
  language: string;
  dateFormat: string;
  currencyFormat: string;
  timeFormat: '12h' | '24h';
  dashboardLayout: 'grid' | 'list';
}

export const defaultPreferences: UserPreferences = {
  theme: 'dark',
  accentColor: 'blue',
  compactMode: false,
  animations: true,
  language: 'English (US)',
  dateFormat: 'MMM DD, YYYY',
  currencyFormat: 'USD ($)',
  timeFormat: '12h',
  dashboardLayout: 'grid',
};

export interface AccessibilitySettings {
  highContrast: boolean;
  fontScale: number;
  keyboardNavigation: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
}

export const defaultAccessibility: AccessibilitySettings = {
  highContrast: false,
  fontScale: 100,
  keyboardNavigation: true,
  reduceMotion: false,
  screenReader: false,
};

export const accentColors: { value: AccentColor; label: string; color: string }[] = [
  { value: 'blue', label: 'Blue', color: 'hsl(217, 91%, 60%)' },
  { value: 'green', label: 'Green', color: 'hsl(142, 71%, 45%)' },
  { value: 'purple', label: 'Purple', color: 'hsl(262, 83%, 58%)' },
  { value: 'orange', label: 'Orange', color: 'hsl(24, 95%, 53%)' },
  { value: 'teal', label: 'Teal', color: 'hsl(173, 80%, 40%)' },
];

export const languages = [
  'English (US)', 'English (UK)', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese (Simplified)', 'Portuguese', 'Arabic',
];

export const dateFormats = ['MMM DD, YYYY', 'DD MMM YYYY', 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

export const currencyFormats = ['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'JPY (¥)', 'CAD (C$)', 'AUD (A$)'];
