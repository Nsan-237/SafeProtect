"use client";

import { mockOrganizations } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Partner Organizations</h1>
          <p className="text-gray-500 text-sm">Hospitals, police stations, shelters, NGOs, and legal aid clinics.</p>
        </div>
        <Button className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
          + Add Partner Organization
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockOrganizations.map((org) => (
          <Card key={org.id} className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#5B3FD3]/10 text-[#5B3FD3] flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
                      {org.name}
                      {org.isVerified && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs mt-0.5">{org.type}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" /> {org.location}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-400" /> {org.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gray-400" /> {org.email}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs border-t pt-3">
                <span className="text-gray-500 font-medium">{org.servicesCount} Active Services</span>
                <span className="font-semibold text-[#5B3FD3]">{org.activeAppointments} Appointments Scheduled</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
