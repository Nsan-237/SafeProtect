"use client";

import { useState } from 'react';
import Link from 'next/link';
import { mockCases } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FolderOpen, Search, UserCheck, ChevronRight } from 'lucide-react';

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = mockCases.filter(
    (c) =>
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Case Management</h1>
          <p className="text-gray-500 text-sm">Assign social workers, track case progress, and update protection milestones.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search case #, title, or worker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title / Incident</TableHead>
                  <TableHead>Victim</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Social Worker</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono font-semibold text-[#5B3FD3]">{c.caseNumber}</TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{c.title}</div>
                      <div className="text-xs text-gray-500">{c.location}</div>
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">{c.victimName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        {c.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white">{c.status}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium flex items-center gap-2 py-4">
                      <UserCheck className="h-4 w-4 text-[#5B3FD3]" /> {c.assignedTo}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/cases/${c.id}`}>
                        <Button variant="outline" size="sm" className="gap-1 text-xs">
                          Manage <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
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
