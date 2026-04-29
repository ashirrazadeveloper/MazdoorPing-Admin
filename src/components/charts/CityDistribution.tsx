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
  { city: 'Lahore', workers: 1245 },
  { city: 'Karachi', workers: 678 },
  { city: 'Islamabad', workers: 423 },
  { city: 'Rawalpindi', workers: 198 },
  { city: 'Faisalabad', workers: 112 },
  { city: 'Multan', workers: 87 },
  { city: 'Peshawar', workers: 64 },
  { city: 'Quetta', workers: 40 },
]

interface CityDistributionProps {
  data?: typeof sampleData
}

export default function CityDistribution({ data = sampleData }: CityDistributionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Workers by City
        </CardTitle>
        <p className="text-xs text-slate-500">Geographic distribution of workers</p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="city"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
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
                dataKey="workers"
                fill="#F97316"
                radius={[6, 6, 0, 0]}
                barSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
