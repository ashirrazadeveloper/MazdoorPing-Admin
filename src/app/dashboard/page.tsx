"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/layout/StatsCards";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getDashboardStats,
  getRecentActivity,
  getRevenueByMonth,
  getWorkersByCategory,
  getWorkersByCity,
} from "@/lib/services";
import type { DashboardStats, RevenueData, CategoryData, CityData, ActivityItem } from "@/types";
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

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes, revRes, catRes, cityRes] = await Promise.all([
          getDashboardStats(),
          getRecentActivity(),
          getRevenueByMonth(),
          getWorkersByCategory(),
          getWorkersByCity(),
        ]);
        setStats(statsRes);
        setActivity(activityRes as ActivityItem[]);
        setRevenueData(revRes);
        setCategoryData(catRes);
        setCityData(cityRes);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Header title="Dashboard" onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} user={user} />

      <main className="p-4 sm:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : stats ? (
            <>
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
            </>
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Unable to load dashboard stats. Please check your database connection.
            </div>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {revenueData.length > 0 ? (
            <RevenueChart data={revenueData} />
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">Revenue Overview</CardTitle>
                <p className="text-sm text-gray-500">Monthly revenue and commission</p>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-sm text-gray-400">No revenue data yet</p>
              </CardContent>
            </Card>
          )}
          {categoryData.length > 0 ? (
            <CategoryChart data={categoryData} />
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-900">Jobs by Category</CardTitle>
                <p className="text-sm text-gray-500">Workers and jobs distribution</p>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-sm text-gray-400">No category data yet</p>
              </CardContent>
            </Card>
          )}
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
              {cityData.length > 0 ? (
                <div className="space-y-3">
                  {cityData.slice(0, 6).map((city) => {
                    const maxVal = cityData[0].value;
                    const pct = maxVal > 0 ? (city.value / maxVal) * 100 : 0;
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
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No city data yet</p>
              )}
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
              {activity.length > 0 ? (
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
                  {activity.map((act) => (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 shrink-0 mt-0.5">
                        {getActivityIcon(act.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {act.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(act.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
              )}
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
