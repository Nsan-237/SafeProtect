"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart2, PieChart, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics & Official Reports</h1>
          <p className="text-gray-500 text-sm">Generate and export statistical reports for ministries, NGOs, and protection boards.</p>
        </div>
        <Button className="bg-[#5B3FD3] hover:bg-[#4c33b8] gap-2">
          <Download className="h-4 w-4" /> Export Full PDF Summary
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#5B3FD3]" /> Monthly Protection Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-gray-500">Comprehensive breakdown of reports, case resolution rates, and regional statistics for May 2024.</p>
            <Button variant="outline" className="w-full text-xs gap-2">
              <Download className="h-3.5 w-3.5" /> Download PDF (May 2024)
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-600" /> GBV Regional Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-gray-500">Incidents categorized across Littoral, Centre, North West, South West, and West regions.</p>
            <Button variant="outline" className="w-full text-xs gap-2">
              <Download className="h-3.5 w-3.5" /> Download CSV Dataset
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" /> Response Efficiency Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-gray-500">Average response time from initial report to social worker assignment: 14 minutes.</p>
            <Button variant="outline" className="w-full text-xs gap-2">
              <Download className="h-3.5 w-3.5" /> Export Audit Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
