"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BarChart2, PieChart, TrendingUp, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function ReportsPage() {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isCsv1Loading, setIsCsv1Loading] = useState(false);
  const [isCsv2Loading, setIsCsv2Loading] = useState(false);

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/analytics/dashboard');
        setDashboardStats(res.data || res);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setIsLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      const [dashboardRes, categoryRes, statusRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/reports-by-category'),
        api.get('/analytics/cases-by-status')
      ]);
      const dashboardData = dashboardRes.data || dashboardRes;
      const categoryData = categoryRes.data || categoryRes;
      const statusData = statusRes.data || statusRes;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      const html = `
        <html>
          <head>
            <title>Monthly Protection Summary</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #1f2937; line-height: 1.5; }
              h1 { color: #5B3FD3; margin-bottom: 5px; }
              .date { color: #6b7280; margin-bottom: 30px; font-size: 0.9em; }
              h2 { color: #374151; margin-top: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
              th { background-color: #f9fafb; font-weight: 600; color: #4b5563; }
              td { color: #374151; }
              .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 15px; }
              .summary-card { padding: 20px; background: #f3f4f6; border-radius: 8px; border: 1px solid #e5e7eb; }
              .summary-card span { display: block; font-size: 0.875rem; color: #6b7280; }
              .summary-card strong { display: block; font-size: 1.5rem; color: #111827; margin-top: 5px; }
            </style>
          </head>
          <body>
            <h1>Monthly Protection Summary</h1>
            <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
            
            <h2>Summary Statistics</h2>
            <div class="summary-grid">
              <div class="summary-card"><span>Total Reports</span><strong>${dashboardData.totalReports || 0}</strong></div>
              <div class="summary-card"><span>Active Cases</span><strong>${dashboardData.activeCases || 0}</strong></div>
              <div class="summary-card"><span>Closed Cases</span><strong>${dashboardData.closedCases || 0}</strong></div>
              <div class="summary-card"><span>Urgent Cases</span><strong>${dashboardData.urgentCases || 0}</strong></div>
            </div>

            <h2>Reports by Category</h2>
            <table>
              <tr><th>Category</th><th>Count</th></tr>
              ${(Array.isArray(categoryData) ? categoryData : []).map((c: any) => \`<tr><td>\${c.category}</td><td>\${c._count}</td></tr>\`).join('')}
            </table>

            <h2>Cases by Status</h2>
            <table>
              <tr><th>Status</th><th>Count</th></tr>
              ${(Array.isArray(statusData) ? statusData : []).map((s: any) => \`<tr><td>\${s.status}</td><td>\${s._count}</td></tr>\`).join('')}
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadCsv1 = async () => {
    setIsCsv1Loading(true);
    try {
      const res = await api.get('/incidents');
      const incidents = res.data || res;
      
      const headers = ['Incident ID', 'Category', 'Location', 'Date', 'Risk Level', 'Status', 'Victim Name', 'Assigned Worker'];
      const rows = (Array.isArray(incidents) ? incidents : []).map((inc: any) => [
        inc.id || '',
        inc.category || '',
        inc.location || '',
        inc.createdAt ? new Date(inc.createdAt).toLocaleDateString() : '',
        inc.riskLevel || '',
        inc.status || '',
        inc.victimName || '',
        inc.assignedWorker || ''
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => \`"\${String(cell).replace(/"/g, '""')}"\`).join(','))].join('\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`gbv_regional_breakdown_\${new Date().toISOString().split('T')[0]}.csv\`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating CSV', error);
    } finally {
      setIsCsv1Loading(false);
    }
  };

  const handleDownloadCsv2 = async () => {
    setIsCsv2Loading(true);
    try {
      const res = await api.get('/cases');
      const cases = res.data || res;
      
      const headers = ['Case Number', 'Status', 'Priority', 'Incident Category', 'Location', 'Assigned Worker', 'Created At', 'Updated At'];
      const rows = (Array.isArray(cases) ? cases : []).map((c: any) => [
        c.caseNumber || c.id || '',
        c.status || '',
        c.priority || '',
        c.incidentCategory || c.incident?.category || '',
        c.location || c.incident?.location || '',
        c.assignedWorker || '',
        c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '',
        c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : ''
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => \`"\${String(cell).replace(/"/g, '""')}"\`).join(','))].join('\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`response_efficiency_\${new Date().toISOString().split('T')[0]}.csv\`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating CSV', error);
    } finally {
      setIsCsv2Loading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics & Official Reports</h1>
          <p className="text-gray-500 text-sm">Generate and export statistical reports for ministries, NGOs, and protection boards.</p>
        </div>
        <Button onClick={handleDownloadPdf} disabled={isPdfLoading} className="bg-[#5B3FD3] hover:bg-[#4c33b8] gap-2">
          {isPdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} 
          Export Full PDF Summary
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
            <p className="text-xs text-gray-500">Comprehensive breakdown of reports, case resolution rates, and regional statistics for {currentMonthYear}.</p>
            {dashboardStats && (
              <div className="text-xs font-medium text-gray-700 bg-gray-50 p-2 rounded-md">
                Total incidents recorded: {dashboardStats.totalReports || 0}
              </div>
            )}
            <Button variant="outline" onClick={handleDownloadPdf} disabled={isPdfLoading} className="w-full text-xs gap-2">
              {isPdfLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              Download PDF ({currentMonthYear})
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
            {dashboardStats && (
              <div className="text-xs font-medium text-gray-700 bg-gray-50 p-2 rounded-md">
                Active cases tracking: {dashboardStats.activeCases || 0}
              </div>
            )}
            <Button variant="outline" onClick={handleDownloadCsv1} disabled={isCsv1Loading} className="w-full text-xs gap-2">
              {isCsv1Loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              Download CSV Dataset
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
            {dashboardStats && (
              <div className="text-xs font-medium text-gray-700 bg-gray-50 p-2 rounded-md">
                Urgent cases flagged: {dashboardStats.urgentCases || 0}
              </div>
            )}
            <Button variant="outline" onClick={handleDownloadCsv2} disabled={isCsv2Loading} className="w-full text-xs gap-2">
              {isCsv2Loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
              Export Audit Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
