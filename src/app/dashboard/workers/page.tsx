'use client'

import React, { useState, useEffect } from 'react'
import {
  Search, Filter, Eye, ShieldCheck, Ban, Star, MapPin, Phone,
  Briefcase, DollarSign, ChevronDown, ChevronUp, CheckCircle2,
  Award, X, Loader2, UserCheck, UserX, Download,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { cn, formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Worker } from '@/types'

const categories = [
  'Painter', 'Electrician', 'Plumber', 'Mason', 'Carpenter', 'Welder',
  'Tile Fixer', 'POP Ceiling', 'Gardener', 'Cleaner', 'Mover',
  'AC Technician', 'Glass Worker', 'General Helper',
]

const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta']

// Sample workers data
const sampleWorkers: Worker[] = [
  {
    id: 'w1', name: 'Muhammad Ali', phone: '0300-1234567', email: 'ali@email.com',
    cnic: '35201-1234567-1', category: 'Electrician', experience: 8, rate: 2500,
    rate_type: 'daily', rating: 5.0, total_jobs: 156, available: true, city: 'Lahore',
    area: 'DHA', language: 'Urdu', verified: true, premium: true, balance: 45000,
    total_earned: 890000, lat: 31.5204, lng: 74.3587, bio: 'Experienced electrician with 8 years of expertise',
    created_at: '2023-03-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w2', name: 'Ahmed Khan', phone: '0312-9876543', category: 'Plumber',
    experience: 6, rate: 2200, rate_type: 'daily', rating: 4.9, total_jobs: 132,
    available: true, city: 'Karachi', language: 'Urdu', verified: true, premium: true,
    balance: 32000, total_earned: 670000, created_at: '2023-05-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w3', name: 'Bilal Hussain', phone: '0333-5556789', category: 'Painter',
    experience: 10, rate: 3000, rate_type: 'daily', rating: 4.9, total_jobs: 120,
    available: false, city: 'Islamabad', language: 'Urdu', verified: true, premium: false,
    balance: 28000, total_earned: 580000, created_at: '2023-01-10T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w4', name: 'Usman Tariq', phone: '0345-1112233', category: 'AC Technician',
    experience: 5, rate: 2800, rate_type: 'daily', rating: 4.8, total_jobs: 98,
    available: true, city: 'Lahore', area: 'Gulberg', language: 'Urdu', verified: true, premium: true,
    balance: 21000, total_earned: 420000, created_at: '2023-06-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w5', name: 'Hassan Raza', phone: '0321-4445566', category: 'Carpenter',
    experience: 12, rate: 3500, rate_type: 'daily', rating: 4.8, total_jobs: 89,
    available: true, city: 'Rawalpindi', language: 'Urdu', verified: true, premium: false,
    balance: 18000, total_earned: 390000, created_at: '2023-02-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w6', name: 'Imran Ali', phone: '0301-6667788', category: 'Mason',
    experience: 15, rate: 2800, rate_type: 'daily', rating: 4.7, total_jobs: 200,
    available: true, city: 'Lahore', area: 'Johar Town', language: 'Punjabi', verified: true, premium: false,
    balance: 52000, total_earned: 1200000, created_at: '2022-11-01T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w7', name: 'Rashid Ali', phone: '0305-9998877', category: 'Electrician',
    experience: 3, rate: 1800, rate_type: 'daily', rating: 4.5, total_jobs: 45,
    available: true, city: 'Lahore', language: 'Urdu', verified: false, premium: false,
    balance: 5000, total_earned: 85000, created_at: '2023-09-10T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w8', name: 'Zubair Ahmed', phone: '0308-7776655', category: 'Welder',
    experience: 7, rate: 2200, rate_type: 'daily', rating: 4.6, total_jobs: 78,
    available: false, city: 'Faisalabad', language: 'Punjabi', verified: true, premium: false,
    balance: 15000, total_earned: 210000, created_at: '2023-04-01T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w9', name: 'Kashif Iqbal', phone: '0309-5554433', category: 'Tile Fixer',
    experience: 4, rate: 2000, rate_type: 'daily', rating: 4.4, total_jobs: 56,
    available: true, city: 'Islamabad', area: 'G-10', language: 'Urdu', verified: false, premium: false,
    balance: 8000, total_earned: 110000, created_at: '2023-07-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w10', name: 'Farhan Mehmood', phone: '0310-3332211', category: 'General Helper',
    experience: 2, rate: 1200, rate_type: 'daily', rating: 4.2, total_jobs: 34,
    available: true, city: 'Multan', language: 'Saraiki', verified: false, premium: false,
    balance: 3000, total_earned: 42000, created_at: '2023-10-05T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w11', name: 'Tahir Abbas', phone: '0315-8889900', category: 'Gardener',
    experience: 6, rate: 1500, rate_type: 'daily', rating: 4.7, total_jobs: 67,
    available: true, city: 'Lahore', area: 'Model Town', language: 'Urdu', verified: true, premium: false,
    balance: 12000, total_earned: 180000, created_at: '2023-03-01T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'w12', name: 'Waqar Hassan', phone: '0317-2221100', category: 'POP Ceiling',
    experience: 9, rate: 2800, rate_type: 'daily', rating: 4.8, total_jobs: 112,
    available: false, city: 'Karachi', area: 'Clifton', language: 'Urdu', verified: true, premium: true,
    balance: 38000, total_earned: 540000, created_at: '2023-01-20T10:00:00Z', updated_at: '2024-01-15T10:00:00Z',
  },
]

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>(sampleWorkers)
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>(sampleWorkers)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [cityFilter, setCityFilter] = useState<string>('all')
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')
  const [premiumFilter, setPremiumFilter] = useState<string>('all')
  const [expandedWorker, setExpandedWorker] = useState<string | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    filterWorkers()
  }, [search, categoryFilter, cityFilter, verifiedFilter, premiumFilter])

  const filterWorkers = () => {
    let result = [...workers]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.phone.includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.city.toLowerCase().includes(q)
      )
    }
    if (categoryFilter !== 'all') result = result.filter((w) => w.category === categoryFilter)
    if (cityFilter !== 'all') result = result.filter((w) => w.city === cityFilter)
    if (verifiedFilter === 'yes') result = result.filter((w) => w.verified)
    if (verifiedFilter === 'no') result = result.filter((w) => !w.verified)
    if (premiumFilter === 'yes') result = result.filter((w) => w.premium)
    if (premiumFilter === 'no') result = result.filter((w) => !w.premium)
    setFilteredWorkers(result)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredWorkers.length / pageSize)
  const paginatedWorkers = filteredWorkers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleVerify = async (workerId: string, verified: boolean) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, verified } : w))
    )
    try {
      await supabase.from('workers').update({ verified }).eq('id', workerId)
    } catch (err) {
      // Offline mode - already updated locally
    }
  }

  const handleViewDetails = (worker: Worker) => {
    setSelectedWorker(worker)
    setDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Workers Management" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Total Workers</p>
              <p className="text-2xl font-bold text-slate-900">{workers.length.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Verified</p>
              <p className="text-2xl font-bold text-green-600">{workers.filter((w) => w.verified).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Premium</p>
              <p className="text-2xl font-bold text-amber-600">{workers.filter((w) => w.premium).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Available Now</p>
              <p className="text-2xl font-bold text-blue-600">{workers.filter((w) => w.available).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by name, phone, category, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
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
                <Select value={premiumFilter} onValueChange={setPremiumFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Premium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="yes">Premium</SelectItem>
                    <SelectItem value="no">Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedWorkers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                        No workers found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedWorkers.map((worker) => (
                      <React.Fragment key={worker.id}>
                        <TableRow
                          className="cursor-pointer hover:bg-orange-50/30"
                          onClick={() =>
                            setExpandedWorker(expandedWorker === worker.id ? null : worker.id)
                          }
                        >
                          <TableCell className="pl-4">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              {expandedWorker === worker.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                                {worker.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-medium text-sm">{worker.name}</p>
                                  {worker.verified && (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                  )}
                                  {worker.premium && (
                                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] px-1 py-0">
                                      PRO
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> {worker.phone}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">{worker.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">{worker.rating}</span>
                            </div>
                            <p className="text-xs text-slate-400">{worker.total_jobs} jobs</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm font-medium">{formatCurrency(worker.rate)}</p>
                            <p className="text-xs text-slate-400">/{worker.rate_type}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" /> {worker.city}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full',
                              worker.available ? 'bg-green-100' : 'bg-slate-100'
                            )}>
                              <div className={cn(
                                'h-2.5 w-2.5 rounded-full',
                                worker.available ? 'bg-green-500' : 'bg-slate-300'
                              )} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {worker.verified ? (
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Verified</Badge>
                              ) : (
                                <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px]">Unverified</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewDetails(worker)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!worker.verified && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleVerify(worker.id, true)
                                  }}
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleVerify(worker.id, !worker.verified)
                                }}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Row */}
                        {expandedWorker === worker.id && (
                          <TableRow className="bg-orange-50/20 hover:bg-orange-50/20">
                            <TableCell colSpan={9}>
                              <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                  {/* Personal Info */}
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-700">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Full Name</span>
                                        <span className="font-medium">{worker.name}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Phone</span>
                                        <span className="font-medium">{worker.phone}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Email</span>
                                        <span className="font-medium">{worker.email || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">CNIC</span>
                                        <span className="font-medium">{worker.cnic || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Language</span>
                                        <span className="font-medium">{worker.language}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Professional Info */}
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-700">Professional Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Category</span>
                                        <span className="font-medium">{worker.category}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Experience</span>
                                        <span className="font-medium">{worker.experience} years</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Rate</span>
                                        <span className="font-medium">{formatCurrency(worker.rate)}/{worker.rate_type}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Total Jobs</span>
                                        <span className="font-medium">{worker.total_jobs}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Rating</span>
                                        <span className="font-medium flex items-center gap-1">
                                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                          {worker.rating}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Earnings Info */}
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-700">Earnings</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Total Earned</span>
                                        <span className="font-bold text-green-600">{formatCurrency(worker.total_earned)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Current Balance</span>
                                        <span className="font-bold text-blue-600">{formatCurrency(worker.balance)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Joined</span>
                                        <span className="font-medium">{formatDate(worker.created_at)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Location</span>
                                        <span className="font-medium">{worker.city}{worker.area ? `, ${worker.area}` : ''}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {worker.bio && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-1">Bio</h4>
                                    <p className="text-sm text-slate-600 bg-white rounded-lg p-3 border border-slate-200">
                                      {worker.bio}
                                    </p>
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleViewDetails(worker)}>
                                    <Eye className="mr-1 h-4 w-4" /> View Full Profile
                                  </Button>
                                  {!worker.verified && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-300 text-green-700 hover:bg-green-50"
                                      onClick={() => handleVerify(worker.id, true)}
                                    >
                                      <ShieldCheck className="mr-1 h-4 w-4" /> Verify Worker
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t p-4">
                <p className="text-sm text-slate-500">
                  Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredWorkers.length)} of {filteredWorkers.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className="w-9"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Worker Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                  {selectedWorker?.name.charAt(0)}
                </div>
                <div>
                  {selectedWorker?.name}
                  <div className="flex gap-2 mt-1">
                    {selectedWorker?.verified && (
                      <Badge className="bg-green-100 text-green-700 border-green-200">Verified</Badge>
                    )}
                    {selectedWorker?.premium && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">Premium</Badge>
                    )}
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription>Complete worker profile and activity details</DialogDescription>
            </DialogHeader>

            {selectedWorker && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium">{selectedWorker.phone}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium">{selectedWorker.email || 'N/A'}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-slate-500">Category</p>
                    <p className="text-sm font-medium">{selectedWorker.category}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-slate-500">Experience</p>
                    <p className="text-sm font-medium">{selectedWorker.experience} years</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-slate-500">Rate</p>
                    <p className="text-sm font-bold text-green-600">{formatCurrency(selectedWorker.rate)}/{selectedWorker.rate_type}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-slate-500">Rating</p>
                    <p className="text-sm font-bold flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {selectedWorker.rating} ({selectedWorker.total_jobs} jobs)
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-slate-500">City / Area</p>
                    <p className="text-sm font-medium">{selectedWorker.city}{selectedWorker.area ? `, ${selectedWorker.area}` : ''}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-slate-500">Member Since</p>
                    <p className="text-sm font-medium">{formatDate(selectedWorker.created_at)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <p className="text-xs text-green-600">Total Earnings</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(selectedWorker.total_earned)}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-xs text-blue-600">Current Balance</p>
                    <p className="text-xl font-bold text-blue-700">{formatCurrency(selectedWorker.balance)}</p>
                  </div>
                </div>

                {selectedWorker.bio && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">Bio</h4>
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{selectedWorker.bio}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {!selectedWorker.verified && (
                    <Button onClick={() => {
                      handleVerify(selectedWorker.id, true)
                      setSelectedWorker({ ...selectedWorker, verified: true })
                    }}>
                      <ShieldCheck className="mr-2 h-4 w-4" /> Verify Worker
                    </Button>
                  )}
                  {selectedWorker.verified && (
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => {
                      handleVerify(selectedWorker.id, false)
                      setSelectedWorker({ ...selectedWorker, verified: false })
                    }}>
                      <Ban className="mr-2 h-4 w-4" /> Revoke Verification
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
