'use client'

import React from 'react'
import { Users, Building2, Briefcase, DollarSign, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; positive: boolean }
  className?: string
  iconBg?: string
}

function StatCard({ title, value, icon, trend, className = '', iconBg = 'bg-orange-100 text-orange-600' }: StatCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <span className={cn('text-xs font-medium', trend.positive ? 'text-green-600' : 'text-red-600')}>
                  {trend.positive ? '↑' : '↓'} {trend.value}%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconBg)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  stats?: {
    totalWorkers: number
    totalEmployers: number
    activeJobs: number
    totalRevenue: number
    avgRating: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const data = stats || {
    totalWorkers: 2847,
    totalEmployers: 1253,
    activeJobs: 432,
    totalRevenue: 4567890,
    avgRating: 4.6,
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total Workers"
        value={data.totalWorkers.toLocaleString()}
        icon={<Users className="h-6 w-6" />}
        trend={{ value: 12, positive: true }}
      />
      <StatCard
        title="Total Employers"
        value={data.totalEmployers.toLocaleString()}
        icon={<Building2 className="h-6 w-6" />}
        trend={{ value: 8, positive: true }}
        iconBg="bg-blue-100 text-blue-600"
      />
      <StatCard
        title="Active Jobs"
        value={data.activeJobs.toLocaleString()}
        icon={<Briefcase className="h-6 w-6" />}
        trend={{ value: 5, positive: true }}
        iconBg="bg-green-100 text-green-600"
      />
      <StatCard
        title="Total Revenue"
        value={formatCurrency(data.totalRevenue)}
        icon={<DollarSign className="h-6 w-6" />}
        trend={{ value: 18, positive: true }}
        iconBg="bg-purple-100 text-purple-600"
      />
      <StatCard
        title="Avg Rating"
        value={data.avgRating.toFixed(1)}
        icon={<Star className="h-6 w-6" />}
        trend={{ value: 2, positive: true }}
        iconBg="bg-amber-100 text-amber-600"
      />
    </div>
  )
}
