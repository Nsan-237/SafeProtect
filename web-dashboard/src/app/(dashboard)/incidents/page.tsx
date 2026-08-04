"use client";

import { useState } from 'react';
import { mockIncidents } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Filter, Search, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredIncidents = mockIncidents.filter((inc) => {
    const matchesSearch =
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <Badge variant="destructive">New</Badge>;
      case 'Under Investigation':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">In Progress</Badge>;
      case 'Support Provided':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Support Provided</Badge>;
      case 'Resolved':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk?: string) => {
    switch (risk) {
      case 'Critical':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Critical</span>;
      case 'High':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">High</span>;
      case 'Medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Incident Reports</h1>
          <p className="text-gray-500 text-sm">Monitor, filter, and assign incoming GBV and child protection reports.</p>
        </div>
        <Button className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
          + Report Manual Incident
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border-l-4 border-l-red-500">
          <CardHeader className="py-3">
            <CardTitle className="text-xs text-gray-500 flex justify-between items-center">
              New Reports <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardTitle>
            <div className="text-2xl font-bold text-gray-900">2</div>
          </CardHeader>
        </Card>
        <Card className="bg-white border-l-4 border-l-amber-500">
          <CardHeader className="py-3">
            <CardTitle className="text-xs text-gray-500 flex justify-between items-center">
              Under Investigation <Clock className="h-4 w-4 text-amber-500" />
            </CardTitle>
            <div className="text-2xl font-bold text-gray-900">2</div>
          </CardHeader>
        </Card>
        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardHeader className="py-3">
            <CardTitle className="text-xs text-gray-500 flex justify-between items-center">
              Support Provided <ShieldAlert className="h-4 w-4 text-blue-500" />
            </CardTitle>
            <div className="text-2xl font-bold text-gray-900">1</div>
          </CardHeader>
        </Card>
        <Card className="bg-white border-l-4 border-l-emerald-500">
          <CardHeader className="py-3">
            <CardTitle className="text-xs text-gray-500 flex justify-between items-center">
              Resolved Cases <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardTitle>
            <div className="text-2xl font-bold text-gray-900">1</div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, type, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]"
              >
                <option value="ALL">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Support Provided">Support Provided</option>
                <option value="Resolved">Resolved</option>
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
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-semibold text-[#5B3FD3]">{incident.id}</TableCell>
                    <TableCell className="font-medium">{incident.type}</TableCell>
                    <TableCell className="text-gray-600">{incident.location}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{incident.date}</TableCell>
                    <TableCell>{getRiskBadge(incident.riskLevel)}</TableCell>
                    <TableCell>{getStatusBadge(incident.status)}</TableCell>
                    <TableCell className="text-gray-700 font-medium">{incident.assignedTo}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="text-xs">
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
