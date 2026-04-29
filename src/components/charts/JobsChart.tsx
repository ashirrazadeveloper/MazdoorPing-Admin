'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const sampleData = [
  { name: 'Completed', value: 1850, color: '#10B981' },
  { name: 'In Progress', value: 432, color: '#6366F1' },
  { name: 'Pending', value: 267, color: '#F59E0B' },
  { name: 'Accepted', value: 145, color: '#3B82F6' },
  { name: 'Cancelled', value: 98, color: '#EF4444' },
  { name: 'Disputed', value: 23, color: '#F97316' },
]

interface JobsChartProps {
  data?: typeof sampleData
}

export default function JobsChart({ data = sampleData }: JobsChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Jobs by Status
        </CardTitle>
        <p className="text-xs text-slate-500">Current distribution of all jobs</p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                }}
                formatter={(value: number) => [value.toLocaleString(), 'Jobs']}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-slate-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
