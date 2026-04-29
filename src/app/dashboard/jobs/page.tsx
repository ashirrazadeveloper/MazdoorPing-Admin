'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Search, Eye, AlertTriangle, MapPin, Clock, User, Building2,
  Briefcase, DollarSign, Filter, Calendar, ChevronDown, ChevronUp,
  X,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { cn, formatCurrency, formatDate, formatRelativeTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Job } from '@/types'

const categories = [
  'Painter', 'Electrician', 'Plumber', 'Mason', 'Carpenter', 'Welder',
  'Tile Fixer', 'POP Ceiling', 'Gardener', 'Cleaner', 'Mover',
  'AC Technician', 'Glass Worker', 'General Helper',
]

const statuses: Job['status'][] = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed']
const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']

const sampleJobs: Job[] = [
  {
    id: 'j1', title: 'Full House Painting - DHA Phase 5', category: 'Painter', description: 'Need full house painting for 5 rooms including ceilings and walls. Premium quality paint required.',
    rate: 45000, rate_type: 'daily', status: 'in_progress', city: 'Lahore', area: 'DHA Phase 5', address: '123 Block C, DHA Phase 5',
    urgent: true, payment_method: 'cash', payment_status: 'pending', employer_id: 'e1', worker_id: 'w1',
    created_at: '2024-01-15T09:30:00Z', updated_at: '2024-01-15T12:00:00Z',
    employer: { id: 'e1', name: 'Syed Farrukh', phone: '0300-1111111' },
    worker: { id: 'w1', name: 'Muhammad Ali', phone: '0300-1234567' },
  },
  {
    id: 'j2', title: 'AC Installation - 3 Split Units', category: 'AC Technician', description: 'Install 3 split AC units in office. Brackets and copper piping already arranged.',
    rate: 15000, rate_type: 'daily', status: 'pending', city: 'Karachi', area: 'Clifton', address: 'Block 9, Clifton',
    urgent: false, payment_method: 'jazzcash', payment_status: 'pending', employer_id: 'e2',
    created_at: '2024-01-15T08:15:00Z', updated_at: '2024-01-15T08:15:00Z',
    employer: { id: 'e2', name: 'Aamir Shah', phone: '0312-2222222' },
  },
  {
    id: 'j3', title: 'Bathroom Plumbing Repair', category: 'Plumber', description: 'Fix leaking pipes and replace 2 taps in both bathrooms.',
    rate: 3500, rate_type: 'daily', status: 'completed', city: 'Islamabad', area: 'F-10', address: 'House 45, Street 12, F-10/3',
    urgent: false, payment_method: 'easypaisa', payment_status: 'commission_deducted',
    employer_id: 'e3', worker_id: 'w2', completed_at: '2024-01-14T16:00:00Z',
    created_at: '2024-01-14T10:00:00Z', updated_at: '2024-01-14T16:00:00Z',
    employer: { id: 'e3', name: 'Tariq Mehmood', phone: '0333-3333333' },
    worker: { id: 'w2', name: 'Ahmed Khan', phone: '0312-9876543' },
  },
  {
    id: 'j4', title: 'Kitchen Tiles Replacement', category: 'Tile Fixer', description: 'Replace kitchen floor tiles, approximately 200 sqft area.',
    rate: 18000, rate_type: 'daily', status: 'accepted', city: 'Lahore', area: 'Gulberg', address: '23-G Gulberg III',
    urgent: false, payment_method: 'cash', payment_status: 'pending', employer_id: 'e4', worker_id: 'w3',
    created_at: '2024-01-14T14:30:00Z', updated_at: '2024-01-15T07:00:00Z',
    employer: { id: 'e4', name: 'Naveed Iqbal', phone: '0345-4444444' },
    worker: { id: 'w3', name: 'Bilal Hussain', phone: '0333-5556789' },
  },
  {
    id: 'j5', title: 'Complete Electrical Wiring - 2 Story', category: 'Electrician', description: 'Complete electrical wiring for a 2-story under-construction house. All materials provided.',
    rate: 75000, rate_type: 'daily', status: 'in_progress', city: 'Rawalpindi', area: 'Saddar', address: 'Plaza Market, Saddar',
    urgent: true, payment_method: 'bank_transfer', payment_status: 'pending', employer_id: 'e5', worker_id: 'w4',
    created_at: '2024-01-13T09:00:00Z', updated_at: '2024-01-14T08:00:00Z',
    employer: { id: 'e5', name: 'Zafar Ahmed', phone: '0321-5555555' },
    worker: { id: 'w4', name: 'Usman Tariq', phone: '0345-1112233' },
  },
  {
    id: 'j6', title: 'Furniture Repair - 3 Chairs + Table', category: 'Carpenter', description: 'Repair 3 wooden chairs and 1 dining table. Joints need fixing.',
    rate: 5000, rate_type: 'daily', status: 'completed', city: 'Faisalabad', area: 'Madina Town', address: '45-B, Madina Town',
    urgent: false, payment_method: 'cash', payment_status: 'commission_deducted',
    employer_id: 'e6', worker_id: 'w5', completed_at: '2024-01-13T15:00:00Z',
    created_at: '2024-01-13T08:00:00Z', updated_at: '2024-01-13T15:00:00Z',
    employer: { id: 'e6', name: 'Kamran Yousaf', phone: '0301-6666666' },
    worker: { id: 'w5', name: 'Hassan Raza', phone: '0321-4445566' },
  },
  {
    id: 'j7', title: 'Gardening & Lawn Maintenance', category: 'Gardener', description: 'Monthly lawn maintenance including mowing, trimming, and plant care.',
    rate: 8000, rate_type: 'monthly', status: 'pending', city: 'Lahore', area: 'Model Town', address: '12-A, Model Town Extension',
    urgent: false, payment_method: 'cash', payment_status: 'pending', employer_id: 'e7',
    created_at: '2024-01-15T07:00:00Z', updated_at: '2024-01-15T07:00:00Z',
    employer: { id: 'e7', name: 'Aslam Baig', phone: '0302-7777777' },
  },
  {
    id: 'j8', title: 'POP Ceiling Installation - 2 Rooms', category: 'POP Ceiling', description: 'Install POP false ceiling in 2 bedrooms with LED lights.',
    rate: 25000, rate_type: 'daily', status: 'cancelled', city: 'Multan', area: 'Bosan Road',
    urgent: false, payment_method: 'easypaisa', payment_status: 'refunded', employer_id: 'e8',
    created_at: '2024-01-12T11:00:00Z', updated_at: '2024-01-13T09:00:00Z',
    employer: { id: 'e8', name: 'Imran Siddiqui', phone: '0303-8888888' },
  },
  {
    id: 'j9', title: 'Welding - Steel Gate Fabrication', category: 'Welder', description: 'Fabricate and install a main steel gate, 10 feet wide.',
    rate: 35000, rate_type: 'daily', status: 'in_progress', city: 'Lahore', area: 'Johar Town', address: 'House 78, Block H, Johar Town',
    urgent: false, payment_method: 'cash', payment_status: 'pending', employer_id: 'e1', worker_id: 'w8',
    created_at: '2024-01-12T08:00:00Z', updated_at: '2024-01-14T10:00:00Z',
    employer: { id: 'e1', name: 'Syed Farrukh', phone: '0300-1111111' },
    worker: { id: 'w8', name: 'Zubair Ahmed', phone: '0308-7776655' },
  },
  {
    id: 'j10', title: 'House Deep Cleaning - 5 Rooms', category: 'Cleaner', description: 'Deep cleaning of entire house before shifting. 5 bedrooms + kitchen + bathrooms.',
    rate: 12000, rate_type: 'daily', status: 'completed', city: 'Karachi', area: 'Defence', address: 'DHA Phase 6',
    urgent: false, payment_method: 'jazzcash', payment_status: 'commission_deducted',
    employer_id: 'e9', worker_id: 'w10', completed_at: '2024-01-14T18:00:00Z',
    created_at: '2024-01-14T06:00:00Z', updated_at: '2024-01-14T18:00:00Z',
    employer: { id: 'e9', name: 'Bilal Haider', phone: '0304-9990000' },
    worker: { id: 'w10', name: 'Farhan Mehmood', phone: '0310-3332211' },
  },
  {
    id: 'j11', title: 'Brick Wall Construction', category: 'Mason', description: 'Construct boundary wall, approximately 60 feet long and 8 feet tall.',
    rate: 48000, rate_type: 'daily', status: 'disputed', city: 'Islamabad', area: 'D-12',
    urgent: false, payment_method: 'bank_transfer', payment_status: 'pending', employer_id: 'e10', worker_id: 'w6',
    created_at: '2024-01-11T10:00:00Z', updated_at: '2024-01-15T09:00:00Z',
    employer: { id: 'e10', name: 'Rizwan Ahmed', phone: '0306-1110000' },
    worker: { id: 'w6', name: 'Imran Ali', phone: '0301-6667788' },
  },
  {
    id: 'j12', title: 'Moving Services - House Relocation', category: 'Mover', description: 'Move household items from DHA to Bahria Town. 3-bedroom house.',
    rate: 25000, rate_type: 'daily', status: 'pending', city: 'Lahore', area: 'DHA',
    urgent: true, payment_method: 'cash', payment_status: 'pending', employer_id: 'e1',
    created_at: '2024-01-15T14:00:00Z', updated_at: '2024-01-15T14:00:00Z',
    employer: { id: 'e1', name: 'Syed Farrukh', phone: '0300-1111111' },
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs)
  const [filtered, setFiltered] = useState<Job[]>(sampleJobs)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    filterJobs()
  }, [search, statusFilter, categoryFilter, cityFilter])

  const filterJobs = () => {
    let result = [...jobs]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.employer?.name.toLowerCase().includes(q) ||
          j.worker?.name.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') result = result.filter((j) => j.status === statusFilter)
    if (categoryFilter !== 'all') result = result.filter((j) => j.category === categoryFilter)
    if (cityFilter !== 'all') result = result.filter((j) => j.city === cityFilter)
    setFiltered(result)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const statusBadge = (status: string) => (
    <Badge className={cn('text-xs font-medium border', getStatusColor(status))}>
      {getStatusLabel(status)}
    </Badge>
  )

  const paymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      paid: 'bg-green-100 text-green-700 border-green-200',
      commission_deducted: 'bg-blue-100 text-blue-700 border-blue-200',
      refunded: 'bg-slate-100 text-slate-600 border-slate-200',
    }
    return <Badge className={cn('text-[10px]', colors[status] || '')}>{getStatusLabel(status)}</Badge>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Jobs Management" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {statuses.map((status) => {
            const count = jobs.filter((j) => j.status === status).length
            return (
              <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}>
                <CardContent className={cn('p-4 border-l-4', status === 'pending' ? 'border-l-yellow-500' : status === 'in_progress' ? 'border-l-indigo-500' : status === 'completed' ? 'border-l-green-500' : status === 'cancelled' ? 'border-l-red-500' : status === 'disputed' ? 'border-l-orange-500' : 'border-l-blue-500')}>
                  <p className="text-xs text-slate-500">{getStatusLabel(status)}</p>
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search jobs, employer, worker..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map((s) => <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-slate-500">No jobs found.</TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((job) => (
                      <React.Fragment key={job.id}>
                        <TableRow className="cursor-pointer" onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}>
                          <TableCell className="pl-4">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              {expandedId === job.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm">{job.title}</p>
                                {job.urgent && <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-[10px]">{job.category}</Badge>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {job.city}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{job.employer?.name || 'N/A'}</p>
                            <p className="text-xs text-slate-400">{job.employer?.phone}</p>
                          </TableCell>
                          <TableCell>
                            {job.worker ? (
                              <div>
                                <p className="text-sm">{job.worker.name}</p>
                                <p className="text-xs text-slate-400">{job.worker.phone}</p>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">{formatCurrency(job.rate)}</p>
                            <p className="text-xs text-slate-400">/{job.rate_type}</p>
                          </TableCell>
                          <TableCell>{statusBadge(job.status)}</TableCell>
                          <TableCell>{paymentBadge(job.payment_status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                              e.stopPropagation()
                              setSelectedJob(job)
                              setDetailOpen(true)
                            }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>

                        {expandedId === job.id && (
                          <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableCell colSpan={8}>
                              <div className="p-6 space-y-4">
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-700 mb-1">Description</h4>
                                  <p className="text-sm text-slate-600 bg-white rounded-lg p-3 border border-slate-200">
                                    {job.description || 'No description provided.'}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-sm">
                                  <div>
                                    <p className="text-xs text-slate-500">Address</p>
                                    <p className="font-medium">{job.address || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500">Payment Method</p>
                                    <p className="font-medium">{getStatusLabel(job.payment_method)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500">Created</p>
                                    <p className="font-medium">{formatDate(job.created_at)}</p>
                                  </div>
                                  {job.completed_at && (
                                    <div>
                                      <p className="text-xs text-slate-500">Completed</p>
                                      <p className="font-medium">{formatDate(job.completed_at)}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => { setSelectedJob(job); setDetailOpen(true); }}>
                                    <Eye className="mr-1 h-4 w-4" /> Full Details
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-4">
                <p className="text-sm text-slate-500">
                  Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button key={i + 1} variant={currentPage === i + 1 ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(i + 1)} className="w-9">{i + 1}</Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedJob?.title}
              {selectedJob?.urgent && <AlertTriangle className="h-5 w-5 text-red-500" />}
            </DialogTitle>
            <DialogDescription>Complete job details</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6 mt-4">
              <div className="flex flex-wrap gap-2">
                {statusBadge(selectedJob.status)}
                {paymentBadge(selectedJob.payment_status)}
                <Badge variant="secondary">{selectedJob.category}</Badge>
                {selectedJob.urgent && <Badge className="bg-red-100 text-red-700 border-red-200">Urgent</Badge>}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1">Description</h4>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                  {selectedJob.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-semibold text-slate-700">Employer</p>
                    </div>
                    <p className="text-sm font-medium">{selectedJob.employer?.name || 'N/A'}</p>
                    <p className="text-xs text-slate-500">{selectedJob.employer?.phone}</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-semibold text-slate-700">Worker</p>
                    </div>
                    <p className="text-sm font-medium">{selectedJob.worker?.name || 'Unassigned'}</p>
                    <p className="text-xs text-slate-500">{selectedJob.worker?.phone || '-'}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Rate</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedJob.rate)} <span className="text-sm font-normal text-slate-500">/{selectedJob.rate_type}</span></p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Payment Method</p>
                  <p className="text-sm font-medium">{getStatusLabel(selectedJob.payment_method)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-sm font-medium">{selectedJob.city}{selectedJob.area ? `, ${selectedJob.area}` : ''}</p>
                  {selectedJob.address && <p className="text-xs text-slate-400">{selectedJob.address}</p>}
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm font-medium">{formatDate(selectedJob.created_at)}</p>
                  {selectedJob.completed_at && (
                    <p className="text-xs text-green-600 mt-1">Completed: {formatDate(selectedJob.completed_at)}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
