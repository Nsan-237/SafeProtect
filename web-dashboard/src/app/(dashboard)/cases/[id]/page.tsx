"use client";

import { useState } from 'react';
import Link from 'next/link';
import { mockCases, mockSocialWorkers } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, UserPlus, Clock, Shield, MapPin, FileText } from 'lucide-react';

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const caseItem = mockCases.find((c) => c.id === params.id) || mockCases[0];
  const [status, setStatus] = useState(caseItem.status);
  const [assignedWorker, setAssignedWorker] = useState(caseItem.assignedTo);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

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
          <p className="text-gray-500 text-sm">{caseItem.title}</p>
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
                  <span className="font-semibold text-gray-900">{caseItem.incidentType}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Reported On</span>
                  <span className="font-medium text-gray-900">{caseItem.createdAt}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Location</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" /> {caseItem.location}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Victim Information</span>
                  <span className="font-semibold text-gray-900">{caseItem.victimName}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Assessment & Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-white border p-3 rounded-lg">
                  {caseItem.description}
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
                {caseItem.notes?.map((note, index) => (
                  <div key={index} className="relative pb-2">
                    <div className="text-xs font-semibold text-[#5B3FD3] mb-0.5">{note.split(':')[0]}</div>
                    <div className="text-sm text-gray-700">{note.split(':')[1]}</div>
                  </div>
                ))}
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
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-[#5B3FD3]"
                >
                  <option value="New">New</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Support Provided">Support Provided</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Assign Social Worker</label>
                <select
                  value={assignedWorker}
                  onChange={(e) => setAssignedWorker(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-[#5B3FD3]"
                >
                  {mockSocialWorkers.map((worker) => (
                    <option key={worker.id} value={worker.name}>
                      {worker.name} ({worker.department})
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

              <Button onClick={handleSave} className="w-full bg-[#5B3FD3] hover:bg-[#4c33b8] gap-2">
                <Save className="h-4 w-4" /> Save Case Updates
              </Button>

              {savedSuccess && (
                <div className="p-2 bg-green-50 text-green-700 text-xs font-medium rounded text-center border border-green-200">
                  Case updated successfully!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
