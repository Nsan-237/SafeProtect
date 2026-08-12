"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Bell, Lock, Server, Save, CheckCircle } from 'lucide-react';

const SETTINGS_KEY = '@safeprotect_settings';

const defaultSettings = {
  emergencySos: true,
  anonymousReporting: true,
  smsGateway: true,
  pushNotifications: true,
  auditLogging: true,
  twoFactorEnforced: false,
};

type Settings = typeof defaultSettings;

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, []);

  const toggle = (key: keyof Settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      const userStr = localStorage.getItem('@user');
      if (userStr) {
        const userId = JSON.parse(userStr).id;
        if (userId) {
          await api.put(`/users/${userId}`, settings);
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  };

  if (!loaded) return null;

  const Toggle = ({ id, checked, onChange }: { id: string; checked: boolean; onChange: () => void }) => (
    <button
      id={id}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B3FD3] focus:ring-offset-2 ${
        checked ? 'bg-[#5B3FD3]' : 'bg-gray-200'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const Row = ({
    id,
    title,
    description,
    settingKey,
  }: {
    id: string;
    title: string;
    description: string;
    settingKey: keyof Settings;
  }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <Toggle id={id} checked={settings[settingKey]} onChange={() => toggle(settingKey)} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 text-sm">System configuration, security rules, notification webhooks, and privacy settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#5B3FD3]" /> System &amp; Emergency Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row
              id="setting-sos"
              title="Emergency SOS Dispatch"
              description="Automatically alert nearest police and social worker on critical SOS"
              settingKey="emergencySos"
            />
            <Row
              id="setting-anon"
              title="Anonymous Reporting Mode"
              description="Allow victims to submit incidents without phone number verification"
              settingKey="anonymousReporting"
            />
            <Row
              id="setting-audit"
              title="Audit Logging"
              description="Record all admin and social worker actions for compliance"
              settingKey="auditLogging"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#5B3FD3]" /> Notification Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row
              id="setting-sms"
              title="SMS Helpline Gateway"
              description="Send emergency SMS dispatch to local social workers"
              settingKey="smsGateway"
            />
            <Row
              id="setting-push"
              title="Push Notifications (FCM)"
              description="Firebase Cloud Messaging alerts for case updates"
              settingKey="pushNotifications"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#5B3FD3]" /> Security &amp; Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row
              id="setting-2fa"
              title="Enforce Two-Factor Authentication"
              description="Require 2FA for all admin and organization accounts"
              settingKey="twoFactorEnforced"
            />
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">JWT Token Expiry</div>
                <div className="text-xs text-gray-500">Access tokens expire after 15 minutes; refresh tokens after 7 days</div>
              </div>
              <span className="text-xs font-bold text-[#5B3FD3] bg-purple-50 px-2 py-1 rounded-full">15m / 7d</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Server className="h-5 w-5 text-[#5B3FD3]" /> Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">API Base URL</div>
                <div className="text-xs text-gray-500 font-mono">{process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api'}</div>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Database</div>
                <div className="text-xs text-gray-500">PostgreSQL via Prisma ORM</div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Connected</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-4">
        {saved && (
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
            <CheckCircle className="h-4 w-4" /> Settings saved successfully!
          </div>
        )}
        <Button onClick={handleSave} id="save-settings-btn" className="bg-[#5B3FD3] hover:bg-[#4c33b8] gap-2">
          <Save className="h-4 w-4" /> Save Configuration
        </Button>
      </div>
    </div>
  );
}
