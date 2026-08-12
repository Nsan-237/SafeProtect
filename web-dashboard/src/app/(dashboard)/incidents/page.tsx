"use client";

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Filter, Search, ShieldAlert, CheckCircle2, Clock, X, Loader2 } from 'lucide-react';

// ─── Detail Modal ────────────────────────────────────────────────
function IncidentDetailModal({ incident, onClose }: { incident: any; onClose: () => void }) {
  const formatType = (cat: string) =>
    (cat || 'Unknown').split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">Incident Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#5B3FD3] bg-purple-50 px-3 py-1 rounded-full">{incident.id?.slice(0, 8)}</span>
            <span className="text-sm font-semibold text-gray-700">{formatType(incident.category)}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Location', value: incident.location || 'N/A' },
              { label: 'Date Reported', value: incident.date ? new Date(incident.date).toLocaleDateString() : 'N/A' },
              { label: 'Risk Level', value: incident.riskLevel || 'N/A' },
              { label: 'Victim', value: incident.victim?.user?.name || 'Anonymous' },
              { label: 'Assigned Worker', value: incident.cases?.[0]?.assignedWorker?.user?.name || 'Unassigned' },
              { label: 'Case Status', value: incident.cases?.[0]?.status?.replace(/_/g, ' ') || 'No Case' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>
          {incident.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{incident.description}</p>
            </div>
          )}
          {incident.evidenceUrl && (
            <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2 text-sm text-blue-700">
              <ShieldAlert className="h-4 w-4" />
              <a href={incident.evidenceUrl} target="_blank" rel="noreferrer" className="underline">View Evidence File</a>
            </div>
          )}
          <Button className="w-full bg-[#5B3FD3] hover:bg-[#4c33b8]" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Report Incident Modal ───────────────────────────────────────
const CATEGORIES = ['DOMESTIC_VIOLENCE', 'SEXUAL_ABUSE', 'PHYSICAL_ABUSE', 'EMOTIONAL_ABUSE', 'NEGLECT', 'OTHER'];
const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function ReportIncidentModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [victims, setVictims] = useState<any[]>([]);
  const [form, setForm] = useState({
    victimId: '', category: 'DOMESTIC_VIOLENCE', location: '',
    description: '', riskLevel: 'HIGH', date: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/victims').then((r) => setVictims(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.victimId || !form.location || !form.description) {
      setError('Victim, location, and description are required.'); return;
    }
    try {
      setSaving(true); setError('');
      await api.post('/incidents', form);
      onSaved(); onClose();
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to create incident.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">Report Manual Incident</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Victim</label>
            <select value={form.victimId} onChange={(e) => setForm(p => ({ ...p, victimId: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]">
              <option value="">Select victim...</option>
              {victims.map((v) => <option key={v.id} value={v.id}>{v.user?.name || v.id.slice(0, 8)}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Risk Level</label>
              <select value={form.riskLevel} onChange={(e) => setForm(p => ({ ...p, riskLevel: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]">
                {RISK_LEVELS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Location</label>
            <input type="text" placeholder="e.g. Yaoundé, Centre Region" value={form.location}
              onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Incident Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Description</label>
            <textarea rows={4} placeholder="Describe the incident in detail..." value={form.description}
              onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3] resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-[#5B3FD3] hover:bg-[#4c33b8]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function IncidentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [showReport, setShowReport] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/incidents');
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load incidents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredIncidents = data.filter((inc) => {
    const typeStr = (inc.category || '').replace('_', ' ');
    const status = inc.cases?.[0]?.status || 'NEW';
    const matchesSearch =
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      typeStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'NEW': return <Badge variant="destructive">New</Badge>;
      case 'UNDER_INVESTIGATION': return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">In Progress</Badge>;
      case 'SUPPORT_PROVIDED': return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Support Provided</Badge>;
      case 'RESOLVED': return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Resolved</Badge>;
      default: return <Badge variant="secondary">{status || 'New'}</Badge>;
    }
  };

  const getRiskBadge = (risk?: string) => {
    const map: Record<string, string> = {
      CRITICAL: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-100 text-orange-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[risk?.toUpperCase() ?? ''] ?? 'bg-green-100 text-green-800'}`}>
        {risk ? risk.charAt(0) + risk.slice(1).toLowerCase() : 'Low'}
      </span>
    );
  };

  const formatType = (cat: string) =>
    (cat || 'Other').split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {selectedIncident && <IncidentDetailModal incident={selectedIncident} onClose={() => setSelectedIncident(null)} />}
      {showReport && <ReportIncidentModal onClose={() => setShowReport(false)} onSaved={loadData} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Incident Reports</h1>
          <p className="text-gray-500 text-sm">Monitor, filter, and assign incoming GBV and child protection reports.</p>
        </div>
        <Button id="report-incident-btn" onClick={() => setShowReport(true)} className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
          + Report Manual Incident
        </Button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'New Reports', icon: AlertTriangle, color: 'red', status: 'NEW' },
          { label: 'Under Investigation', icon: Clock, color: 'amber', status: 'UNDER_INVESTIGATION' },
          { label: 'Support Provided', icon: ShieldAlert, color: 'blue', status: 'SUPPORT_PROVIDED' },
          { label: 'Resolved Cases', icon: CheckCircle2, color: 'emerald', status: 'RESOLVED' },
        ].map(({ label, icon: Icon, color, status }) => (
          <Card key={status} className={`bg-white border-l-4 border-l-${color}-500`}>
            <CardHeader className="py-3">
              <CardTitle className="text-xs text-gray-500 flex justify-between items-center">
                {label} <Icon className={`h-4 w-4 text-${color}-500`} />
              </CardTitle>
              <div className="text-2xl font-bold text-gray-900">
                {data.filter(i => (i.cases?.[0]?.status?.toUpperCase() || 'NEW') === status).length}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text" placeholder="Search by ID, type, location..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]">
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="UNDER_INVESTIGATION">Under Investigation</option>
                <option value="SUPPORT_PROVIDED">Support Provided</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date Reported</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Worker</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                      No incidents found.
                    </TableCell>
                  </TableRow>
                ) : filteredIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-semibold text-[#5B3FD3]">{incident.id.slice(0, 8)}</TableCell>
                    <TableCell className="font-medium">{formatType(incident.category)}</TableCell>
                    <TableCell className="text-gray-600">{incident.location || 'N/A'}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {incident.date ? new Date(incident.date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{getRiskBadge(incident.riskLevel)}</TableCell>
                    <TableCell>{getStatusBadge(incident.cases?.[0]?.status)}</TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      {incident.cases?.[0]?.assignedWorker?.user?.name || 'Unassigned'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        id={`view-incident-${incident.id}`}
                        variant="outline" size="sm" className="text-xs"
                        onClick={() => setSelectedIncident(incident)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
