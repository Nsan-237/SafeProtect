'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';
import { Search, UserCheck } from 'lucide-react';

type ApiCase = {
  id: string;
  caseNumber: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'UNDER_INVESTIGATION' | 'SUPPORT_PROVIDED' | 'RESOLVED' | 'CLOSED';
  assignedWorkerId: string | null;
  assignedWorker: { user: { name: string } } | null;
  incident: {
    category: string;
    location: string | null;
    victim: { user: { name: string } };
  };
};

type SocialWorker = {
  id: string;
  user: { name: string };
};

const label = (value: string) => value.replaceAll('_', ' ');

export default function CasesPage() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [workers, setWorkers] = useState<SocialWorker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingCaseId, setSavingCaseId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadCases = useCallback(async () => {
    try {
      setError('');
      const [caseResponse, workerResponse] = await Promise.all([
        api.get<ApiCase[]>('/cases'),
        api.get<SocialWorker[]>('/social-workers'),
      ]);
      setCases(caseResponse.data);
      setWorkers(workerResponse.data);
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Unable to load case data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const updateAssignment = async (caseId: string, workerId: string) => {
    if (!workerId) return;

    try {
      setSavingCaseId(caseId);
      setError('');
      await api.put(`/cases/${caseId}/assign`, { workerId });
      await loadCases();
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Unable to assign the case.');
    } finally {
      setSavingCaseId(null);
    }
  };

  const updateStatus = async (caseId: string, status: ApiCase['status']) => {
    try {
      setSavingCaseId(caseId);
      setError('');
      await api.patch(`/cases/${caseId}`, { status });
      await loadCases();
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Unable to update the case status.');
    } finally {
      setSavingCaseId(null);
    }
  };

  const filteredCases = useMemo(
    () =>
      cases.filter((caseItem) => {
        const query = searchTerm.toLowerCase();
        return (
          caseItem.caseNumber.toLowerCase().includes(query) ||
          label(caseItem.incident.category).toLowerCase().includes(query) ||
          caseItem.incident.victim.user.name.toLowerCase().includes(query) ||
          (caseItem.assignedWorker?.user.name.toLowerCase().includes(query) ?? false)
        );
      }),
    [cases, searchTerm],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Case Management</h1>
        <p className="text-gray-500 text-sm">Assign social workers and update active protection cases.</p>
      </div>

      {error ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <Card>
        <CardHeader className="pb-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search case, report, victim, or worker..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Incident</TableHead>
                  <TableHead>Victim</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Social Worker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Loading casesâ€¦</TableCell></TableRow>
                ) : filteredCases.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">No cases found.</TableCell></TableRow>
                ) : (
                  filteredCases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="font-mono font-semibold text-[#5B3FD3]">{caseItem.caseNumber}</TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{label(caseItem.incident.category)}</div>
                        <div className="text-xs text-gray-500">{caseItem.incident.location || 'Location not provided'}</div>
                      </TableCell>
                      <TableCell className="text-gray-700">{caseItem.incident.victim.user.name}</TableCell>
                      <TableCell><Badge className="bg-red-100 text-red-800 hover:bg-red-100">{label(caseItem.priority)}</Badge></TableCell>
                      <TableCell>
                        <select
                          value={caseItem.status}
                          disabled={savingCaseId === caseItem.id}
                          onChange={(event) => updateStatus(caseItem.id, event.target.value as ApiCase['status'])}
                          className="rounded-md border bg-white px-2 py-1 text-xs font-medium"
                        >
                          <option value="NEW">New</option>
                          <option value="UNDER_INVESTIGATION">Under Investigation</option>
                          <option value="SUPPORT_PROVIDED">Support Provided</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <div className="flex min-w-52 items-center gap-2">
                          <UserCheck className="h-4 w-4 shrink-0 text-[#5B3FD3]" />
                          <select
                            value={caseItem.assignedWorkerId || ''}
                            disabled={savingCaseId === caseItem.id}
                            onChange={(event) => updateAssignment(caseItem.id, event.target.value)}
                            className="w-full rounded-md border bg-white px-2 py-1 text-xs"
                          >
                            <option value="">Unassigned</option>
                            {workers.map((worker) => <option key={worker.id} value={worker.id}>{worker.user.name}</option>)}
                          </select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
