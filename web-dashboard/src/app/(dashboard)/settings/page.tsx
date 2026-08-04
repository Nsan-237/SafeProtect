"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Bell, Lock, Server, Save } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
              <Shield className="h-5 w-5 text-[#5B3FD3]" /> System & Emergency Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Emergency SOS Dispatch</div>
                <div className="text-xs text-gray-500">Automatically alert nearest police and social worker on critical SOS</div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-[#5B3FD3] rounded" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Anonymous Reporting Mode</div>
                <div className="text-xs text-gray-500">Allow victims to submit incidents without phone number verification</div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-[#5B3FD3] rounded" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#5B3FD3]" /> Notification Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">SMS Helpline Gateway</div>
                <div className="text-xs text-gray-500">Send emergency SMS dispatch to local social workers</div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-[#5B3FD3] rounded" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">Push Notifications (FCM)</div>
                <div className="text-xs text-gray-500">Firebase Cloud Messaging alerts for case updates</div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-[#5B3FD3] rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-[#5B3FD3] hover:bg-[#4c33b8] gap-2">
          <Save className="h-4 w-4" /> Save Configuration
        </Button>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg text-center border border-green-200">
          Settings saved successfully!
        </div>
      )}
    </div>
  );
}
