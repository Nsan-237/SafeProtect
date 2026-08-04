"use client";

import { mockSocialWorkers } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function SocialWorkersPage() {
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

      <div className="grid gap-6 md:grid-cols-3">
        {mockSocialWorkers.map((worker) => (
          <Card key={worker.id} className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#5B3FD3]/10 text-[#5B3FD3] flex items-center justify-center font-bold">
                    {worker.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">{worker.name}</CardTitle>
                    <div className="text-xs text-gray-500">{worker.department}</div>
                  </div>
                </div>
                <Badge
                  className={
                    worker.availability === 'Available'
                      ? 'bg-emerald-500 text-white'
                      : worker.availability === 'Busy'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-400 text-white'
                  }
                >
                  {worker.availability}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="text-xs text-gray-600 space-y-1.5 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" /> {worker.location}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-400" /> {worker.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-gray-400" /> {worker.email}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <div className="font-bold text-[#5B3FD3] text-lg">{worker.activeCases}</div>
                  <div className="text-gray-500">Active Cases</div>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="font-bold text-emerald-600 text-lg">{worker.resolvedCases}</div>
                  <div className="text-gray-500">Resolved Cases</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
