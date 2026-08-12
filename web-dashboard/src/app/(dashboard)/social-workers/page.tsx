"use client";

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Phone, Mail, MapPin, X, Loader2 } from 'lucide-react';

function RegisterWorkerModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', department: '', specialization: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.'); return;
    }
    try {
      setSaving(true); setError('');
      // Register the user account with SOCIAL_WORKER role first
      const regRes = await api.post('/auth/register', {
        name: form.name, email: form.email, password: form.password,
        phone: form.phone, role: 'SOCIAL_WORKER',
      });
      const newUserId = regRes.data.user?.id;
      // Then update the auto-created social worker profile with department/specialization
      if (newUserId && (form.department || form.specialization)) {
        await api.put(`/social-workers/${newUserId}`, {
          department: form.department, specialization: form.specialization,
        }).catch(() => {}); // non-blocking
      }
      onSaved(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to register social worker.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">Register Social Worker</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Aline Ndey' },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'aline@example.com' },
            { key: 'password', label: 'Temporary Password', type: 'password', placeholder: '••••••••' },
            { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+237 6XX XXX XXX' },
            { key: 'department', label: 'Department (optional)', type: 'text', placeholder: 'Trauma & Counseling' },
            { key: 'specialization', label: 'Specialization (optional)', type: 'text', placeholder: 'Domestic Violence' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</label>
              <input type={type} placeholder={placeholder}
                value={(form as any)[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]" />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-[#5B3FD3] hover:bg-[#4c33b8]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register Worker'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SocialWorkersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/social-workers');
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load social workers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {showRegister && <RegisterWorkerModal onClose={() => setShowRegister(false)} onSaved={loadData} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Social Workers &amp; Responders</h1>
          <p className="text-gray-500 text-sm">Directory of active social workers, caseworkers, and trauma counselors.</p>
        </div>
        <Button id="register-worker-btn" onClick={() => setShowRegister(true)} className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
          + Register Social Worker
        </Button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="grid gap-6 md:grid-cols-3">
        {data.map((worker) => {
          const name = worker.user?.name || 'Unknown';
          const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
          const activeCases = worker.cases?.filter((c: any) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length || 0;
          const resolvedCases = worker.cases?.filter((c: any) => c.status === 'RESOLVED' || c.status === 'CLOSED').length || 0;

          return (
            <Card key={worker.id} className="bg-white">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#5B3FD3]/10 text-[#5B3FD3] flex items-center justify-center font-bold">
                      {initials}
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-gray-900">{name}</CardTitle>
                      <div className="text-xs text-gray-500">{worker.department || 'General'}</div>
                    </div>
                  </div>
                  <Badge className={
                    worker.availability === 'AVAILABLE' ? 'bg-emerald-500 text-white' :
                    worker.availability === 'BUSY' ? 'bg-amber-500 text-white' :
                    'bg-gray-400 text-white'
                  }>
                    {worker.availability || 'Unknown'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" /> {worker.specialization || 'General Practice'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-gray-400" /> {worker.user?.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-gray-400" /> {worker.user?.email || 'N/A'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <div className="font-bold text-[#5B3FD3] text-lg">{activeCases}</div>
                    <div className="text-gray-500">Active Cases</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="font-bold text-emerald-600 text-lg">{resolvedCases}</div>
                    <div className="text-gray-500">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {data.length === 0 && (
          <div className="col-span-3 py-16 text-center text-gray-500">
            <UserCheck className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            No social workers registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
