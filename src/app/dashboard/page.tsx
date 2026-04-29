"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/layout/StatsCards";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { CityChart } from "@/components/charts/CityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  mockDashboardStats,
  mockRevenueData,
  mockCategoryData,
  mockCityData,
  mockActivity,
} from "@/lib/mock-data";
import {
  Users,
  Building2,
  Briefcase,
  DollarSign,
  AlertTriangle,
  UserPlus,
  FileText,
  CheckCircle2,
  CreditCard,
  AlertOctagon,
  Star,
} from "lucide-react";

function getActivityIcon(type: string) {
  switch (type) {
    case "worker_registered":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "job_posted":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "job_completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "payment_received":
      return <CreditCard className="h-4 w-4 text-orange-500" />;
    case "sos_alert":
      return <AlertOctagon className="h-4 w-4 text-red-500" />;
    case "review_posted":
      return <Star className="h-4 w-4 text-yellow-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
}

function DashboardContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const stats = mockDashboardStats;

  return (
    <>
      <Header title="Dashboard" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Workers"
            value={stats.totalWorkers.toLocaleString()}
            change={stats.workersGrowth}
            changeLabel="vs last month"
            icon={<Users className="h-6 w-6" />}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatCard
            title="Total Employers"
            value={stats.totalEmployers.toLocaleString()}
            change={stats.employersGrowth}
            changeLabel="vs last month"
            icon={<Building2 className="h-6 w-6" />}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Active Jobs"
            value={stats.activeJobs.toLocaleString()}
            icon={<Briefcase className="h-6 w-6" />}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            change={stats.revenueGrowth}
            changeLabel="vs last month"
            icon={<DollarSign className="h-6 w-6" />}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Pending SOS"
            value={stats.pendingSOS}
            icon={<AlertTriangle className="h-6 w-6" />}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={mockRevenueData} />
          <CategoryChart data={mockCategoryData} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* City Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">
                City Distribution
              </CardTitle>
              <p className="text-sm text-gray-500">Workers by city</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockCityData.slice(0, 6).map((city) => {
                  const maxVal = mockCityData[0].value;
                  const pct = (city.value / maxVal) * 100;
                  return (
                    <div key={city.name} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{city.name}</span>
                        <span className="text-gray-500">{city.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">
                Recent Activity
              </CardTitle>
              <p className="text-sm text-gray-500">Latest platform activities</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
