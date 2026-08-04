'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsOverviewChart } from "@/components/charts/ReportsOverviewChart";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { FileText, FolderOpen, CheckCircle, AlertTriangle, ChevronDown } from "lucide-react";
import api from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalReports: 0,
    activeCases: 0,
    closedCases: 0,
    urgentCases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic route guard checks on the client side
    const token = localStorage.getItem('@token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/dashboard');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Reports */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#5B3FD3]/10 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#5B3FD3]" />
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                ↑ 12%
              </span>
            </div>
            <div className="text-3xl font-bold text-[#1E1E2D]">
              {loading ? '...' : stats.totalReports}
            </div>
            <p className="text-xs text-[#75759E] mt-1 font-medium">Total Reports <span className="text-gray-400">• This Month</span></p>
          </CardContent>
        </Card>

        {/* Active Cases */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-blue-500" />
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                ↑ 8%
              </span>
            </div>
            <div className="text-3xl font-bold text-[#1E1E2D]">
              {loading ? '...' : stats.activeCases}
            </div>
            <p className="text-xs text-[#75759E] mt-1 font-medium">Active Cases <span className="text-gray-400">• This Month</span></p>
          </CardContent>
        </Card>

        {/* Closed Cases */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                ↑ 15%
              </span>
            </div>
            <div className="text-3xl font-bold text-[#1E1E2D]">
              {loading ? '...' : stats.closedCases}
            </div>
            <p className="text-xs text-[#75759E] mt-1 font-medium">Closed Cases <span className="text-gray-400">• This Month</span></p>
          </CardContent>
        </Card>

        {/* Urgent Cases */}
        <Card className="bg-white border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FF2E55]/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-[#FF2E55]" />
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                ↑ 3%
              </span>
            </div>
            <div className="text-3xl font-bold text-[#1E1E2D]">
              {loading ? '...' : stats.urgentCases}
            </div>
            <p className="text-xs text-[#75759E] mt-1 font-medium">Urgent Cases <span className="text-gray-400">• This Month</span></p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 rounded-2xl border border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-[#1E1E2D]">Reports Overview</CardTitle>
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1E1E2D] cursor-pointer hover:bg-gray-100">
              This Month <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <ReportsOverviewChart />
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-2xl border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1E1E2D]">Reports by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <CategoryPieChart />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-bold text-[#1E1E2D]">Recent Incidents</CardTitle>
          <a href="/incidents" className="text-sm font-bold text-[#5B3FD3] hover:underline">
            View All
          </a>
        </CardHeader>
        <CardContent>
          <RecentIncidents />
        </CardContent>
      </Card>
    </div>
  );
}
