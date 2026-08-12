"use client";

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AppointmentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/appointments');
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const formatDate = (iso: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Appointments Schedule</h1>
          <p className="text-gray-500 text-sm">Medical examinations, legal consultations, and psychosocial support sessions.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment ID</TableHead>
                <TableHead>Victim / Reference</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-mono text-xs font-semibold text-[#5B3FD3]">{apt.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium text-gray-900">{apt.victim?.user?.name || 'N/A'}</TableCell>
                  <TableCell className="text-gray-700">{apt.organization?.name || 'N/A'}</TableCell>
                  <TableCell>{apt.title || apt.type}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(apt.date)} {apt.time && `at ${apt.time}`}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      apt.status === 'SCHEDULED' ? 'bg-amber-500 text-white' : 
                      apt.status === 'COMPLETED' ? 'bg-emerald-500 text-white' :
                      'bg-gray-500 text-white'
                    }>
                      {apt.status === 'SCHEDULED' ? 'Scheduled' : 
                       apt.status === 'COMPLETED' ? 'Completed' : 
                       apt.status === 'CANCELLED' ? 'Cancelled' : apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      Reschedule
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
