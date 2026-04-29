'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const sampleData = [
  { month: 'Jan', revenue: 185000, commission: 22200 },
  { month: 'Feb', revenue: 210000, commission: 25200 },
  { month: 'Mar', revenue: 245000, commission: 29400 },
  { month: 'Apr', revenue: 198000, commission: 23760 },
  { month: 'May', revenue: 320000, commission: 38400 },
  { month: 'Jun', revenue: 390000, commission: 46800 },
  { month: 'Jul', revenue: 415000, commission: 49800 },
  { month: 'Aug', revenue: 380000, commission: 45600 },
  { month: 'Sep', revenue: 445000, commission: 53400 },
  { month: 'Oct', revenue: 490000, commission: 58800 },
  { month: 'Nov', revenue: 510000, commission: 61200 },
  { month: 'Dec', revenue: 580000, commission: 69600 },
]

interface RevenueChartProps {
  data?: typeof sampleData
}

export default function RevenueChart({ data = sampleData }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Revenue Trend
        </CardTitle>
        <p className="text-xs text-slate-500">Monthly revenue and commission (PKR)</p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                }}
                formatter={(value: number) => [
                  `PKR ${value.toLocaleString()}`,
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#F97316"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="commission"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCommission)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-xs text-slate-500">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Commission (12%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
