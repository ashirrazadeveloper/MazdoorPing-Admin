'use client'

import React, { useState, useEffect } from 'react'
import {
  Search, Eye, ShieldCheck, Ban, Building2, Phone, MapPin,
  Briefcase, CheckCircle2, ChevronDown, ChevronUp, UserCheck,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
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
import { cn, formatDate, formatRelativeTime } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Employer } from '@/types'

const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']

const sampleEmployers: Employer[] = [
  { id: 'e1', name: 'Syed Farrukh', phone: '0300-1111111', email: 'farrukh@email.com', type: 'individual', city: 'Lahore', area: 'DHA Phase 5', verified: true, created_at: '2023-02-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e2', name: 'Aamir Shah', phone: '0312-2222222', type: 'contractor', city: 'Karachi', area: 'Clifton', verified: true, created_at: '2023-03-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e3', name: 'Tariq Mehmood', phone: '0333-3333333', type: 'individual', city: 'Islamabad', area: 'F-10', verified: true, created_at: '2023-01-10T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e4', name: 'Naveed Iqbal', phone: '0345-4444444', type: 'company', city: 'Lahore', area: 'Gulberg', verified: true, created_at: '2023-04-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e5', name: 'Zafar Ahmed', phone: '0321-5555555', type: 'contractor', city: 'Rawalpindi', area: 'Saddar', verified: false, created_at: '2023-05-10T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e6', name: 'Kamran Yousaf', phone: '0301-6666666', type: 'individual', city: 'Faisalabad', area: 'Madina Town', verified: true, created_at: '2023-06-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e7', name: 'Aslam Baig', phone: '0302-7777777', type: 'individual', city: 'Lahore', area: 'Model Town', verified: false, created_at: '2023-07-01T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e8', name: 'Imran Siddiqui', phone: '0303-8888888', type: 'contractor', city: 'Multan', area: 'Bosan Road', verified: true, created_at: '2023-08-05T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e9', name: 'Bilal Haider', phone: '0304-9990000', type: 'company', city: 'Karachi', area: 'Defence', verified: true, created_at: '2023-09-10T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e10', name: 'Rizwan Ahmed', phone: '0306-1110000', type: 'individual', city: 'Islamabad', area: 'G-11', verified: false, created_at: '2023-10-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e11', name: 'Construco Builders', phone: '0307-2220000', type: 'company', city: 'Lahore', area: 'Cantt', verified: true, created_at: '2023-03-01T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
  { id: 'e12', name: 'Waqar Malik', phone: '0308-3330000', type: 'contractor', city: 'Peshawar', area: 'University Town', verified: true, created_at: '2023-04-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z' },
]

// Sample jobs count per employer
const jobsPosted: Record<string, number> = {
  e1: 24, e2: 18, e3: 15, e4: 32, e5: 8, e6: 12, e7: 5, e8: 20, e9: 28, e10: 3, e11: 45, e12: 16,
}

export default function EmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>(sampleEmployers)
  const [filteredEmployers, setFilteredEmployers] = useState<Employer[]>(sampleEmployers)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    filterEmployers()
  }, [search, typeFilter, cityFilter, verifiedFilter])

  const filterEmployers = () => {
    let result = [...employers]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.phone.includes(q) || e.city.toLowerCase().includes(q)
      )
    }
    if (typeFilter !== 'all') result = result.filter((e) => e.type === typeFilter)
    if (cityFilter !== 'all') result = result.filter((e) => e.city === cityFilter)
    if (verifiedFilter === 'yes') result = result.filter((e) => e.verified)
    if (verifiedFilter === 'no') result = result.filter((e) => !e.verified)
    setFilteredEmployers(result)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredEmployers.length / pageSize)
  const paginated = filteredEmployers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleVerify = async (id: string, verified: boolean) => {
    setEmployers((prev) => prev.map((e) => (e.id === id ? { ...e, verified } : e)))
    try {
      await supabase.from('employers').update({ verified }).eq('id', id)
    } catch (err) {}
  }

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      individual: 'bg-slate-100 text-slate-700 border-slate-200',
      contractor: 'bg-blue-100 text-blue-700 border-blue-200',
      company: 'bg-purple-100 text-purple-700 border-purple-200',
    }
    return <Badge className={cn('text-xs', colors[type])}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Employers Management" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Total Employers</p>
              <p className="text-2xl font-bold text-slate-900">{employers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Verified</p>
              <p className="text-2xl font-bold text-green-600">{employers.filter((e) => e.verified).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Contractors</p>
              <p className="text-2xl font-bold text-blue-600">{employers.filter((e) => e.type === 'contractor').length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Companies</p>
              <p className="text-2xl font-bold text-purple-600">{employers.filter((e) => e.type === 'company').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by name, phone, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
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
                <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Verified" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Verified</SelectItem>
                    <SelectItem value="no">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Jobs Posted</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                      No employers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((emp) => (
                    <React.Fragment key={emp.id}>
                      <TableRow
                        className="cursor-pointer"
                        onClick={() => setExpandedId(expandedId === emp.id ? null : emp.id)}
                      >
                        <TableCell className="pl-4">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            {expandedId === emp.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold',
                              emp.type === 'company' ? 'bg-purple-100 text-purple-600' :
                              emp.type === 'contractor' ? 'bg-blue-100 text-blue-600' :
                              'bg-slate-100 text-slate-600'
                            )}>
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{emp.name}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {emp.phone}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{typeBadge(emp.type)}</TableCell>
                        <TableCell>
                          <p className="text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" /> {emp.city}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{jobsPosted[emp.id] || 0}</p>
                        </TableCell>
                        <TableCell>
                          {emp.verified ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Verified</Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px]">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs text-slate-500">{formatDate(emp.created_at)}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                              e.stopPropagation()
                              setSelectedEmployer(emp)
                              setDetailOpen(true)
                            }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!emp.verified && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={(e) => {
                                e.stopPropagation()
                                handleVerify(emp.id, true)
                              }}>
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={(e) => {
                              e.stopPropagation()
                              handleVerify(emp.id, !emp.verified)
                            }}>
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedId === emp.id && (
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                          <TableCell colSpan={8}>
                            <div className="p-6 space-y-4">
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2 text-sm">
                                  <p className="text-slate-500">Email</p>
                                  <p className="font-medium">{emp.email || 'N/A'}</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <p className="text-slate-500">Area</p>
                                  <p className="font-medium">{emp.area || 'N/A'}</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <p className="text-slate-500">Jobs Posted</p>
                                  <p className="font-medium">{jobsPosted[emp.id] || 0} jobs</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => { setSelectedEmployer(emp); setDetailOpen(true); }}>
                                  <Eye className="mr-1 h-4 w-4" /> View Details
                                </Button>
                                {!emp.verified && (
                                  <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => handleVerify(emp.id, true)}>
                                    <ShieldCheck className="mr-1 h-4 w-4" /> Verify
                                  </Button>
                                )}
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-4">
                <p className="text-sm text-slate-500">
                  Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredEmployers.length)} of {filteredEmployers.length}
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

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedEmployer?.name}</DialogTitle>
            <DialogDescription>Employer profile details</DialogDescription>
          </DialogHeader>
          {selectedEmployer && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium">{selectedEmployer.phone}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium">{selectedEmployer.email || 'N/A'}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Type</p>
                  <div className="mt-1">{typeBadge(selectedEmployer.type)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">City / Area</p>
                  <p className="text-sm font-medium">{selectedEmployer.city}{selectedEmployer.area ? `, ${selectedEmployer.area}` : ''}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Jobs Posted</p>
                  <p className="text-sm font-bold">{jobsPosted[selectedEmployer.id] || 0}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="text-sm font-medium">{formatDate(selectedEmployer.created_at)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!selectedEmployer.verified && (
                  <Button onClick={() => { handleVerify(selectedEmployer.id, true); setSelectedEmployer({ ...selectedEmployer, verified: true }) }}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Verify
                  </Button>
                )}
                {selectedEmployer.verified && (
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => { handleVerify(selectedEmployer.id, false); setSelectedEmployer({ ...selectedEmployer, verified: false }) }}>
                    <Ban className="mr-2 h-4 w-4" /> Revoke
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
