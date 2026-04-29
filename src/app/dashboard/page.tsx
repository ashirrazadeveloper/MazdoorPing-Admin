'use client'

import React, { useState, useEffect } from 'react'
import {
  Star,
  Briefcase,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import StatsCards from '@/components/layout/StatsCards'
import RevenueChart from '@/components/charts/RevenueChart'
import JobsChart from '@/components/charts/JobsChart'
import CityDistribution from '@/components/charts/CityDistribution'
import CategoryChart from '@/components/charts/CategoryChart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { cn, formatCurrency, formatRelativeTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Job, SOSAlert, Worker } from '@/types'

// ─── Sample data for top rated workers ───
const sampleTopWorkers: Worker[] = [
  {
    id: '1', name: 'Muhammad Ali', phone: '0300-1234567', category: 'Electrician',
    experience: 8, rate: 2500, rate_type: 'daily', rating: 5.0, total_jobs: 156,
    available: true, city: 'Lahore', language: 'Urdu', verified: true, premium: true,
    balance: 45000, total_earned: 890000, created_at: '2023-03-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2', name: 'Ahmed Khan', phone: '0312-9876543', category: 'Plumber',
    experience: 6, rate: 2200, rate_type: 'daily', rating: 4.9, total_jobs: 132,
    available: true, city: 'Karachi', language: 'Urdu', verified: true, premium: true,
    balance: 32000, total_earned: 670000, created_at: '2023-05-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '3', name: 'Bilal Hussain', phone: '0333-5556789', category: 'Painter',
    experience: 10, rate: 3000, rate_type: 'daily', rating: 4.9, total_jobs: 120,
    available: false, city: 'Islamabad', language: 'Urdu', verified: true, premium: false,
    balance: 28000, total_earned: 580000, created_at: '2023-01-10T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '4', name: 'Usman Tariq', phone: '0345-1112233', category: 'AC Technician',
    experience: 5, rate: 2800, rate_type: 'daily', rating: 4.8, total_jobs: 98,
    available: true, city: 'Lahore', language: 'Urdu', verified: true, premium: true,
    balance: 21000, total_earned: 420000, created_at: '2023-06-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '5', name: 'Hassan Raza', phone: '0321-4445566', category: 'Carpenter',
    experience: 12, rate: 3500, rate_type: 'daily', rating: 4.8, total_jobs: 89,
    available: true, city: 'Rawalpindi', language: 'Urdu', verified: true, premium: false,
    balance: 18000, total_earned: 390000, created_at: '2023-02-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
]

// ─── Sample recent jobs ───
const sampleRecentJobs: Job[] = [
  {
    id: '1', title: 'Full House Painting - DHA Phase 5', category: 'Painter', description: 'Need full house painting, 5 rooms',
    rate: 45000, rate_type: 'daily', status: 'in_progress', city: 'Lahore', area: 'DHA Phase 5',
    urgent: true, payment_method: 'cash', payment_status: 'pending',
    employer_id: 'e1', worker_id: 'w1', created_at: '2024-01-15T09:30:00Z', updated_at: '2024-01-15T12:00:00Z',
    employer: { id: 'e1', name: 'Syed Farrukh', phone: '0300-1111111' },
    worker: { id: 'w1', name: 'Muhammad Ali', phone: '0300-1234567' },
  },
  {
    id: '2', title: 'AC Installation - 3 Units', category: 'AC Technician', description: 'Install 3 split AC units in office',
    rate: 15000, rate_type: 'daily', status: 'pending', city: 'Karachi', area: 'Clifton',
    urgent: false, payment_method: 'jazzcash', payment_status: 'pending',
    employer_id: 'e2', created_at: '2024-01-15T08:15:00Z', updated_at: '2024-01-15T08:15:00Z',
    employer: { id: 'e2', name: 'Aamir Shah', phone: '0312-2222222' },
  },
  {
    id: '3', title: 'Bathroom Plumbing Repair', category: 'Plumber', description: 'Fix leaking pipes and replace tap',
    rate: 3500, rate_type: 'daily', status: 'completed', city: 'Islamabad', area: 'F-10',
    urgent: false, payment_method: 'easypaisa', payment_status: 'commission_deducted',
    employer_id: 'e3', worker_id: 'w2', completed_at: '2024-01-14T16:00:00Z',
    created_at: '2024-01-14T10:00:00Z', updated_at: '2024-01-14T16:00:00Z',
    employer: { id: 'e3', name: 'Tariq Mehmood', phone: '0333-3333333' },
    worker: { id: 'w2', name: 'Ahmed Khan', phone: '0312-9876543' },
  },
  {
    id: '4', title: 'Kitchen Tiles Replacement', category: 'Tile Fixer', description: 'Replace kitchen floor tiles, 200 sqft',
    rate: 18000, rate_type: 'daily', status: 'accepted', city: 'Lahore', area: 'Gulberg',
    urgent: false, payment_method: 'cash', payment_status: 'pending',
    employer_id: 'e4', worker_id: 'w3', created_at: '2024-01-14T14:30:00Z', updated_at: '2024-01-15T07:00:00Z',
    employer: { id: 'e4', name: 'Naveed Iqbal', phone: '0345-4444444' },
    worker: { id: 'w3', name: 'Bilal Hussain', phone: '0333-5556789' },
  },
  {
    id: '5', title: 'Electrical Wiring - New Construction', category: 'Electrician', description: 'Complete wiring for 2-story house',
    rate: 75000, rate_type: 'daily', status: 'in_progress', city: 'Rawalpindi', area: 'Saddar',
    urgent: true, payment_method: 'bank_transfer', payment_status: 'pending',
    employer_id: 'e5', worker_id: 'w4', created_at: '2024-01-13T09:00:00Z', updated_at: '2024-01-14T08:00:00Z',
    employer: { id: 'e5', name: 'Zafar Ahmed', phone: '0321-5555555' },
    worker: { id: 'w4', name: 'Usman Tariq', phone: '0345-1112233' },
  },
  {
    id: '6', title: 'Furniture Repair - 3 Items', category: 'Carpenter', description: 'Repair 3 wooden chairs and 1 table',
    rate: 5000, rate_type: 'daily', status: 'completed', city: 'Faisalabad', area: 'Madina Town',
    urgent: false, payment_method: 'cash', payment_status: 'commission_deducted',
    employer_id: 'e6', worker_id: 'w5', completed_at: '2024-01-13T15:00:00Z',
    created_at: '2024-01-13T08:00:00Z', updated_at: '2024-01-13T15:00:00Z',
    employer: { id: 'e6', name: 'Kamran Yousaf', phone: '0301-6666666' },
    worker: { id: 'w5', name: 'Hassan Raza', phone: '0321-4445566' },
  },
  {
    id: '7', title: 'Gardening & Lawn Maintenance', category: 'Gardener', description: 'Monthly lawn maintenance and plant care',
    rate: 8000, rate_type: 'monthly', status: 'pending', city: 'Lahore', area: 'Model Town',
    urgent: false, payment_method: 'cash', payment_status: 'pending',
    employer_id: 'e7', created_at: '2024-01-15T07:00:00Z', updated_at: '2024-01-15T07:00:00Z',
    employer: { id: 'e7', name: 'Aslam Baig', phone: '0302-7777777' },
  },
  {
    id: '8', title: 'POP Ceiling Work - 2 Rooms', category: 'POP Ceiling', description: 'Install POP ceiling in 2 bedrooms',
    rate: 25000, rate_type: 'daily', status: 'cancelled', city: 'Multan', area: 'Bosan Road',
    urgent: false, payment_method: 'easypaisa', payment_status: 'refunded',
    employer_id: 'e8', created_at: '2024-01-12T11:00:00Z', updated_at: '2024-01-13T09:00:00Z',
    employer: { id: 'e8', name: 'Imran Siddiqui', phone: '0303-8888888' },
  },
]

// ─── Sample SOS Alerts ───
const sampleSOSAlerts: SOSAlert[] = [
  {
    id: 'sos1', worker_id: 'w10', lat: 31.5204, lng: 74.3587,
    message: 'Worker is in an unsafe environment. Needs immediate assistance.',
    status: 'active', created_at: '2024-01-15T13:45:00Z',
    worker: { id: 'w10', name: 'Rashid Ali', phone: '0305-9998877', city: 'Lahore' },
  },
  {
    id: 'sos2', worker_id: 'w11', lat: 24.8607, lng: 67.0011,
    message: 'Employer refused to pay after work completion. Feeling threatened.',
    status: 'active', created_at: '2024-01-15T12:30:00Z',
    worker: { id: 'w11', name: 'Faisal Mehmood', phone: '0306-8887766', city: 'Karachi' },
  },
]

// ─── Main Component ───
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { count: totalWorkers } = await supabase
        .from('workers')
        .select('*', { count: 'exact', head: true })
      const { count: totalEmployers } = await supabase
        .from('employers')
        .select('*', { count: 'exact', head: true })
      const { count: activeJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress')

      if (totalWorkers) {
        setStats({
          totalWorkers: totalWorkers || 2847,
          totalEmployers: totalEmployers || 1253,
          activeJobs: activeJobs || 432,
          totalRevenue: 4567890,
          avgRating: 4.6,
        })
      }
    } catch (err) {
      // Use sample data if Supabase is not available
      console.log('Using sample data for dashboard')
    }
  }

  const jobStatusBadge = (status: string) => (
    <Badge className={cn('text-xs font-medium border', getStatusColor(status))}>
      {getStatusLabel(status)}
    </Badge>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Dashboard" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <JobsChart />
          <RevenueChart />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CityDistribution />
          <CategoryChart />
        </div>

        {/* SOS Alerts Section */}
        {sampleSOSAlerts.some((a) => a.status === 'active') && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900">Active SOS Alerts</h2>
              <Badge variant="destructive" className="animate-pulse">
                {sampleSOSAlerts.filter((a) => a.status === 'active').length} Active
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {sampleSOSAlerts
                .filter((alert) => alert.status === 'active')
                .map((alert) => (
                  <Card key={alert.id} className="border-red-200 bg-red-50 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-red-900">
                              {alert.worker?.name || 'Unknown Worker'}
                            </h3>
                            <p className="text-sm text-red-600">{alert.worker?.phone}</p>
                          </div>
                        </div>
                        <Badge variant="destructive" className="animate-pulse">
                          ACTIVE
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-red-700">{alert.message}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-red-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(alert.created_at)}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <ShieldCheck className="mr-1 h-4 w-4" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                          View on Map
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Two column: Top Rated Workers + Recent Jobs */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Top Rated Workers */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Top Rated Workers</CardTitle>
                  <CardDescription className="text-xs">Highest rated workers on the platform</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {sampleTopWorkers.slice(0, 5).map((worker, index) => (
                  <div key={worker.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">{worker.name}</p>
                        {worker.verified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                        )}
                        {worker.premium && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0">
                            PRO
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{worker.category} • {worker.city}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-slate-900">{worker.rating}</span>
                      </div>
                      <p className="text-xs text-slate-500">{worker.total_jobs} jobs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Jobs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Recent Jobs</CardTitle>
                  <CardDescription className="text-xs">Latest job postings and updates</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {sampleRecentJobs.slice(0, 6).map((job) => (
                  <div key={job.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">{job.title}</p>
                        {job.urgent && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0">
                            URGENT
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {job.employer?.name} • {job.category} • {formatRelativeTime(job.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {jobStatusBadge(job.status)}
                      <p className="text-xs font-medium text-slate-700">{formatCurrency(job.rate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">All Recent Jobs</CardTitle>
                <CardDescription className="text-xs">Complete overview of latest job activity</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Job Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleRecentJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{job.title}</p>
                          {job.urgent && (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {job.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{job.employer?.name || 'N/A'}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{job.worker?.name || (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{formatCurrency(job.rate)}</p>
                        <p className="text-xs text-slate-400">{job.rate_type}</p>
                      </TableCell>
                      <TableCell>{jobStatusBadge(job.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
