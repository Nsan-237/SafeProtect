'use client';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import api from '@/lib/api';

interface Incident {
  id: string;
  type: string;
  location: string;
  date: string;
  status: string;
  assignedTo: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  PHYSICAL_ABUSE: 'Physical Abuse',
  SEXUAL_ABUSE: 'Sexual Abuse',
  EMOTIONAL_ABUSE: 'Emotional Abuse',
  NEGLECT: 'Neglect',
  DOMESTIC_VIOLENCE: 'Domestic Violence',
  OTHER: 'Other',
};

export function RecentIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/incidents')
      .then((res) => {
        const raw = res.data.slice(0, 10);
        const mapped: Incident[] = raw.map((inc: any) => ({
          id: `INC-${inc.id.slice(-6).toUpperCase()}`,
          type: CATEGORY_LABELS[inc.category] ?? inc.category,
          location: inc.location ?? '—',
          date: new Date(inc.date ?? inc.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          }),
          status: inc.status === 'REPORTED' ? 'New' : inc.status === 'RESOLVED' ? 'Resolved' : 'In Progress',
          assignedTo: inc.case?.assignedWorker?.user?.name ?? '—',
        }));
        setIncidents(mapped);
      })
      .catch((err) => {
        console.error('Failed to load recent incidents', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'New') {
      return <Badge className="bg-[#FFE5E9] text-[#FF2E55] hover:bg-[#FFE5E9] border-0 font-bold px-3 py-1 rounded-full">New</Badge>;
    }
    if (status === 'Resolved') {
      return <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#E8F5E9] border-0 font-bold px-3 py-1 rounded-full">Resolved</Badge>;
    }
    return <Badge className="bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFF3E0] border-0 font-bold px-3 py-1 rounded-full">In Progress</Badge>;
  };

  if (loading) {
    return <div className="py-8 text-center text-[#75759E] text-sm">Loading incidents...</div>;
  }

  if (incidents.length === 0) {
    return <div className="py-8 text-center text-[#75759E] text-sm">No incidents recorded yet.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-100 hover:bg-transparent">
          <TableHead className="font-bold text-[#75759E]">ID</TableHead>
          <TableHead className="font-bold text-[#75759E]">Type</TableHead>
          <TableHead className="font-bold text-[#75759E]">Location</TableHead>
          <TableHead className="font-bold text-[#75759E]">Date</TableHead>
          <TableHead className="font-bold text-[#75759E]">Status</TableHead>
          <TableHead className="font-bold text-[#75759E]">Assigned To</TableHead>
          <TableHead className="font-bold text-[#75759E] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow key={incident.id} className="border-gray-100 hover:bg-gray-50/50">
            <TableCell className="font-bold text-[#1E1E2D]">{incident.id}</TableCell>
            <TableCell className="text-[#1E1E2D] font-medium">{incident.type}</TableCell>
            <TableCell className="text-[#75759E]">{incident.location}</TableCell>
            <TableCell className="text-[#75759E]">{incident.date}</TableCell>
            <TableCell>{getStatusBadge(incident.status)}</TableCell>
            <TableCell className="text-[#1E1E2D] font-medium">{incident.assignedTo}</TableCell>
            <TableCell className="text-right">
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
