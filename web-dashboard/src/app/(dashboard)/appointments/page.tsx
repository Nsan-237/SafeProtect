"use client";

import { mockAppointments } from '@/lib/mock-data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Building2 } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Appointments Schedule</h1>
          <p className="text-gray-500 text-sm">Medical examinations, legal consultations, and psychosocial support sessions.</p>
        </div>
      </div>

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
              {mockAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-mono text-xs font-semibold text-[#5B3FD3]">{apt.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{apt.victimName}</TableCell>
                  <TableCell className="text-gray-700">{apt.organizationName}</TableCell>
                  <TableCell>{apt.serviceName}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {apt.date} at {apt.time}
                  </TableCell>
                  <TableCell>
                    <Badge className={apt.status === 'Confirmed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}>
                      {apt.status}
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
