"use client";

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function SocialWorkersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Social Workers & Responders</h1>
          <p className="text-gray-500 text-sm">Directory of active social workers, caseworkers, and trauma counselors.</p>
        </div>
        <Button className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
          + Register Social Worker
        </Button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="grid gap-6 md:grid-cols-3">
        {data.map((worker) => {
          const name = worker.user?.name || 'Unknown';
          const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
          
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
                  <Badge
                    className={
                      worker.availability === 'AVAILABLE' || worker.availability === 'Available'
                        ? 'bg-emerald-500 text-white'
                        : worker.availability === 'BUSY' || worker.availability === 'Busy'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-400 text-white'
                    }
                  >
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
                    <div className="text-gray-500">Resolved Cases</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
