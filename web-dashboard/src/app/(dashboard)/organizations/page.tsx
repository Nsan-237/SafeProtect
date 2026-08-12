"use client";

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Phone, Mail, MapPin, CheckCircle, X, Loader2 } from 'lucide-react';

const ORG_TYPES = ['HOSPITAL', 'POLICE_STATION', 'SHELTER', 'NGO', 'LEGAL_AID', 'COUNSELING_CENTER', 'OTHER'];

function AddOrgModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: '', type: 'NGO', location: '', phone: '', email: '', description: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location) {
      setError('Name and location are required.'); return;
    }
    try {
      setSaving(true); setError('');
      await api.post('/organizations', form);
      onSaved(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to add organization.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">Add Partner Organization</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Organization Name</label>
            <input type="text" placeholder="e.g. Yaoundé Central Hospital"
              value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Organization Type</label>
            <select value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]">
              {ORG_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          {[
            { key: 'location', label: 'Location', placeholder: 'Yaoundé, Centre Region', type: 'text' },
            { key: 'phone', label: 'Phone Number', placeholder: '+237 222 000 000', type: 'tel' },
            { key: 'email', label: 'Email Address', placeholder: 'contact@org.cm', type: 'email' },
          ].map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</label>
              <input type={type} placeholder={placeholder} value={(form as any)[key]}
                onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]" />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Description (optional)</label>
            <textarea rows={3} placeholder="Brief description of services offered..."
              value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3] resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-[#5B3FD3] hover:bg-[#4c33b8]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Organization'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrganizationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/organizations');
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load organizations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {showAdd && <AddOrgModal onClose={() => setShowAdd(false)} onSaved={loadData} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Partner Organizations</h1>
          <p className="text-gray-500 text-sm">Hospitals, police stations, shelters, NGOs, and legal aid clinics.</p>
        </div>
        <Button id="add-org-btn" onClick={() => setShowAdd(true)} className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
          + Add Partner Organization
        </Button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        {data.map((org) => (
          <Card key={org.id} className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#5B3FD3]/10 text-[#5B3FD3] flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
                      {org.name}
                      {org.isVerified && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs mt-0.5">
                      {org.type ? org.type.replace(/_/g, ' ') : 'General'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gray-400" /> {org.location || 'N/A'}</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400" /> {org.phone || 'N/A'}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gray-400" /> {org.email || 'N/A'}</div>
              </div>
              {org.description && (
                <p className="text-xs text-gray-500 leading-relaxed">{org.description}</p>
              )}
              <div className="flex items-center justify-between text-xs border-t pt-3">
                <span className="text-gray-500 font-medium">
                  {(org.services || []).filter((s: any) => s.isActive).length} Active Services
                </span>
                <span className="font-semibold text-[#5B3FD3]">
                  {(org.appointments || []).length} Appointments
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {data.length === 0 && (
          <div className="col-span-2 py-16 text-center text-gray-500">
            <Building2 className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            No partner organizations added yet.
          </div>
        )}
      </div>
    </div>
  );
}
