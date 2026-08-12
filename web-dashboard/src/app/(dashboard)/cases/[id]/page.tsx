"use client";

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Clock, MapPin, FileText } from 'lucide-react';

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const [caseItem, setCaseItem] = useState<any>(null);
  const [socialWorkers, setSocialWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [status, setStatus] = useState('');
  const [assignedWorker, setAssignedWorker] = useState('');
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setError('');
      const [caseRes, workersRes] = await Promise.all([
        api.get(`/cases/${params.id}`),
        api.get('/social-workers')
      ]);
      const fetchedCase = caseRes.data;
      setCaseItem(fetchedCase);
      setSocialWorkers(workersRes.data);
      setStatus(fetchedCase.status || '');
      setAssignedWorker(fetchedCase.assignedWorker?.id || '');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load case details.');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      const payload: Record<string, any> = { status };
      if (assignedWorker) payload.workerId = assignedWorker;
      if (notes.trim()) payload.notes = notes.trim();

      await api.patch(`/cases/${params.id}`, payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      setNotes('');
      await loadData(); // Refresh to show latest data
    } catch (err: any) {
      setSaveError(err.response?.data?.error || 'Failed to save case updates.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error || !caseItem) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error || 'Case not found.'}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cases">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Cases
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{caseItem.caseNumber}</h1>
            <Badge className="bg-amber-500 text-white">{status}</Badge>
          </div>
          <p className="text-gray-500 text-sm">{caseItem.incident?.category?.replace('_', ' ') || 'Incident Case'}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#5B3FD3]" /> Incident Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="text-gray-500 block text-xs">Incident Type</span>
                  <span className="font-semibold text-gray-900">{caseItem.incident?.category?.replace('_', ' ') || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Reported On</span>
                  <span className="font-medium text-gray-900">
                    {caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Location</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" /> {caseItem.incident?.location || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Victim Information</span>
                  <span className="font-semibold text-gray-900">{caseItem.incident?.victim?.user?.name || 'Anonymous'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Assessment & Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-white border p-3 rounded-lg">
                  {caseItem.incident?.description || 'No description provided.'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#5B3FD3]" /> Case Timeline & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 border-l-2 border-[#5B3FD3] pl-4 ml-2">
                {caseItem.notes ? (
                  <div className="relative pb-2">
                    <div className="text-xs font-semibold text-[#5B3FD3] mb-0.5">Notes</div>
                    <div className="text-sm text-gray-700">{caseItem.notes}</div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No notes available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Update Case Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Case Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-[#5B3FD3]"
                >
                  <option value="NEW">New</option>
                  <option value="UNDER_INVESTIGATION">Under Investigation</option>
                  <option value="SUPPORT_PROVIDED">Support Provided</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Assign Social Worker</label>
                <select
                  value={assignedWorker}
                  onChange={(e) => setAssignedWorker(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-[#5B3FD3]"
                >
                  <option value="">-- Select Worker --</option>
                  {socialWorkers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.user?.name} ({worker.department || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Add Case Note</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter case progress notes..."
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#5B3FD3]"
                ></textarea>
              </div>

              <Button onClick={handleSave} disabled={isSaving} className="w-full bg-[#5B3FD3] hover:bg-[#4c33b8] gap-2">
                <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Case Updates'}
              </Button>

              {savedSuccess && (
                <div className="p-2 bg-green-50 text-green-700 text-xs font-medium rounded text-center border border-green-200">
                  ✓ Case updated successfully!
                </div>
              )}
              {saveError && (
                <div className="p-2 bg-red-50 text-red-700 text-xs font-medium rounded text-center border border-red-200">
                  {saveError}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
