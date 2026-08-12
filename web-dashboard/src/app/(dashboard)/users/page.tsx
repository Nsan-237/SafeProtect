"use client";

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, X, Loader2 } from 'lucide-react';

type User = { id: string; name: string; email: string; role: string; phone?: string; isActive: boolean };

const ROLES = ['VICTIM', 'SOCIAL_WORKER', 'ORGANIZATION', 'ADMIN'];

function AddUserModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'SOCIAL_WORKER', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await api.post('/auth/register', form);
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Add New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com' },
            { key: 'password', label: 'Temporary Password', type: 'password', placeholder: '••••••••' },
            { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+237 6XX XXX XXX' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={(form as any)[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-[#5B3FD3] hover:bg-[#4c33b8]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/users');
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !currentStatus });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${userId}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const roleColor: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-800',
    SOCIAL_WORKER: 'bg-blue-100 text-blue-800',
    VICTIM: 'bg-purple-100 text-purple-800',
    ORGANIZATION: 'bg-amber-100 text-amber-800',
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onSaved={loadData} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Platform Users &amp; Role RBAC</h1>
          <p className="text-gray-500 text-sm">Manage user accounts, roles, access permissions, and authentication state.</p>
        </div>
        <Button id="add-user-btn" onClick={() => setShowAdd(true)} className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
          + Add New User
        </Button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs text-gray-500">{user.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#5B3FD3]" /> {user.name}
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleColor[user.role] ?? 'bg-gray-100 text-gray-700'}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={user.isActive ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-xs mr-2" onClick={() => toggleStatus(user.id, user.isActive)}>
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="destructive" size="sm" className="text-xs" onClick={() => deleteUser(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
