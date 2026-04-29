'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const sampleData = [
  { name: 'Painter', jobs: 345, fill: '#F97316' },
  { name: 'Electrician', jobs: 298, fill: '#EA580C' },
  { name: 'Plumber', jobs: 256, fill: '#F59E0B' },
  { name: 'AC Tech', jobs: 234, fill: '#10B981' },
  { name: 'Mason', jobs: 198, fill: '#6366F1' },
  { name: 'Carpenter', jobs: 187, fill: '#3B82F6' },
  { name: 'Tile Fixer', jobs: 145, fill: '#EC4899' },
  { name: 'Helper', jobs: 132, fill: '#8B5CF6' },
  { name: 'Welder', jobs: 98, fill: '#14B8A6' },
  { name: 'POP', jobs: 87, fill: '#F43F5E' },
  { name: 'Gardener', jobs: 67, fill: '#84CC16' },
  { name: 'Cleaner', jobs: 56, fill: '#06B6D4' },
  { name: 'Mover', jobs: 45, fill: '#A855F7' },
  { name: 'Glass', jobs: 34, fill: '#64748B' },
]

interface CategoryChartProps {
  data?: typeof sampleData
}

export default function CategoryChart({ data = sampleData }: CategoryChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Jobs by Category
        </CardTitle>
        <p className="text-xs text-slate-500">Number of jobs per labor category</p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                }}
                cursor={{ fill: '#FFF7ED', opacity: 0.5 }}
              />
              <Bar
                dataKey="jobs"
                radius={[0, 6, 6, 0]}
                barSize={20}
              >
                {data.map((entry, index) => (
                  <React.Fragment key={index}>
                    <rect fill={entry.fill} />
                  </React.Fragment>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
