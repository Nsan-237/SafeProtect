"use client";

import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCog, ShieldCheck } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Platform Users & Role RBAC</h1>
          <p className="text-gray-500 text-sm">Manage user accounts, roles, access permissions, and authentication state.</p>
        </div>
        <Button className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
          + Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs text-gray-500">{user.id}</TableCell>
                  <TableCell className="font-medium text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#5B3FD3]" /> {user.name}
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{user.phone || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500 text-white">{user.status || 'Active'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      Edit Permissions
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
