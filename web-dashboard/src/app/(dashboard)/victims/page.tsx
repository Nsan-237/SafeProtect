"use client";

import { mockVictims } from '@/lib/mock-data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Lock } from 'lucide-react';

export default function VictimsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Protected Victims Directory</h1>
        <p className="text-gray-500 text-sm">Encrypted records of victims receiving assistance and social protection.</p>
      </div>

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
              {mockVictims.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-semibold text-[#5B3FD3] flex items-center gap-2">
                    <Shield className="h-4 w-4" /> {v.name}
                  </TableCell>
                  <TableCell>{v.age} years old</TableCell>
                  <TableCell>{v.gender}</TableCell>
                  <TableCell>{v.location}</TableCell>
                  <TableCell className="font-mono text-xs">{v.emergencyContact}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{v.casesCount} active</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{v.registeredDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
