export interface SecurityScore {
  score: number;
  label: string;
  recommendations: string[];
}

export const securityScore: SecurityScore = {
  score: 78,
  label: 'Good',
  recommendations: [
    'Enable biometric login for additional security',
    'Review and remove unused trusted devices',
    'Update your password regularly',
  ],
};

export interface LoginSession {
  id: string;
  browser: string;
  os: string;
  location: string;
  device: string;
  ipAddress: string;
  loginTime: string;
  status: 'active' | 'ended';
  current: boolean;
}

export const loginHistory: LoginSession[] = [
  { id: 'ls1', browser: 'Chrome 131', os: 'macOS 15', location: 'San Francisco, CA', device: 'MacBook Pro', ipAddress: '192.168.1.42', loginTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: 'active', current: true },
  { id: 'ls2', browser: 'Safari 18', os: 'iOS 18', location: 'San Francisco, CA', device: 'iPhone 15 Pro', ipAddress: '192.168.1.51', loginTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), status: 'active', current: false },
  { id: 'ls3', browser: 'Edge 131', os: 'Windows 11', location: 'San Jose, CA', device: 'Desktop PC', ipAddress: '10.0.0.142', loginTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: 'ended', current: false },
  { id: 'ls4', browser: 'Chrome 131', os: 'Android 15', location: 'Oakland, CA', device: 'Pixel 9', ipAddress: '192.168.0.88', loginTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), status: 'ended', current: false },
  { id: 'ls5', browser: 'Firefox 133', os: 'Ubuntu 24.04', location: 'San Francisco, CA', device: 'Linux Laptop', ipAddress: '192.168.1.90', loginTime: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), status: 'ended', current: false },
];

export interface TrustedDevice {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  trusted: boolean;
}

export const trustedDevices: TrustedDevice[] = [
  { id: 'td1', name: 'MacBook Pro - Chrome', type: 'Laptop', lastUsed: new Date(Date.now() - 1000 * 60 * 5).toISOString(), trusted: true },
  { id: 'td2', name: 'iPhone 15 Pro - Velora App', type: 'Mobile', lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), trusted: true },
  { id: 'td3', name: 'iPad Air - Safari', type: 'Tablet', lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), trusted: true },
];

export interface SecuritySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: string;
}

export const securitySettings: SecuritySetting[] = [
  { id: 'ss1', label: 'Two-Factor Authentication', description: 'Require a verification code at login', enabled: true, icon: 'ShieldCheck' },
  { id: 'ss2', label: 'Biometric Login', description: 'Use fingerprint or face ID on mobile', enabled: false, icon: 'Fingerprint' },
  { id: 'ss3', label: 'Login Alerts', description: 'Get notified on new device logins', enabled: true, icon: 'Bell' },
  { id: 'ss4', label: 'Transaction PIN', description: 'Require PIN for withdrawals and trades', enabled: true, icon: 'Lock' },
];

export interface BackupCode {
  id: string;
  code: string;
  used: boolean;
}

export const backupCodes: BackupCode[] = [
  { id: 'bc1', code: 'VK7M-4X2P', used: false },
  { id: 'bc2', code: 'Q9RT-3W8N', used: false },
  { id: 'bc3', code: 'J5LB-6Y1C', used: false },
  { id: 'bc4', code: 'F2DH-8Z4K', used: true },
  { id: 'bc5', code: 'N7PV-5M3X', used: false },
  { id: 'bc6', code: 'B4XC-9R2T', used: false },
];

export const passwordStrength = {
  score: 4,
  label: 'Strong',
  lastChanged: '2024-10-15T00:00:00Z',
  requirements: [
    { label: 'At least 12 characters', met: true },
    { label: 'Contains uppercase letters', met: true },
    { label: 'Contains lowercase letters', met: true },
    { label: 'Contains numbers', met: true },
    { label: 'Contains special characters', met: true },
  ],
};
