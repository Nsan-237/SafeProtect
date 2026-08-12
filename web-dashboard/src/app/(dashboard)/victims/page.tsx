"use client";

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Lock } from 'lucide-react';

export default function VictimsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/victims');
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load victims.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Protected Victims Directory</h1>
        <p className="text-gray-500 text-sm">Encrypted records of victims receiving assistance and social protection.</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 bg-purple-50 text-[#5B3FD3] p-3 rounded-lg text-sm font-medium border border-purple-100">
            <Lock className="h-4 w-4" /> All victim identity records are strictly protected under government child protection regulations.
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Victim Identifier</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Emergency Contact</TableHead>
                <TableHead>Active Cases</TableHead>
                <TableHead>Registration Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-semibold text-[#5B3FD3] flex items-center gap-2">
                    <Shield className="h-4 w-4" /> {v.user?.name || 'Anonymous'}
                  </TableCell>
                  <TableCell>{v.age ? `${v.age} years old` : 'N/A'}</TableCell>
                  <TableCell>{v.gender || 'N/A'}</TableCell>
                  <TableCell>{v.location || 'N/A'}</TableCell>
                  <TableCell className="font-mono text-xs">{v.emergencyContact || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{v.incidents?.length || 0} active</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {v.user?.createdAt ? new Date(v.user.createdAt).toLocaleDateString() : 'N/A'}
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
