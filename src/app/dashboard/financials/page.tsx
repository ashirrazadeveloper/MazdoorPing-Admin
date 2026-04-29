'use client'

import React, { useState, useEffect } from 'react'
import {
  DollarSign, TrendingUp, CreditCard, Wallet, ArrowUpRight,
  ArrowDownRight, Calendar, Filter, Download, Clock,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Transaction } from '@/types'

const revenueByMonth = [
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

const commissionByCategory = [
  { name: 'Painter', value: 85000, color: '#F97316' },
  { name: 'Electrician', value: 72000, color: '#EA580C' },
  { name: 'Plumber', value: 65000, color: '#F59E0B' },
  { name: 'AC Tech', value: 58000, color: '#10B981' },
  { name: 'Carpenter', value: 48000, color: '#6366F1' },
  { name: 'Mason', value: 42000, color: '#3B82F6' },
  { name: 'Others', value: 35000, color: '#94A3B8' },
]

const sampleTransactions: Transaction[] = [
  { id: 't1', type: 'commission', amount: 5400, status: 'completed', payment_method: 'cash', job_id: 'j1', worker_id: 'w1', employer_id: 'e1', commission: 5400, description: 'Commission for: Full House Painting', created_at: '2024-01-15T16:00:00Z' },
  { id: 't2', type: 'earning', amount: 3080, status: 'completed', payment_method: 'easypaisa', job_id: 'j3', worker_id: 'w2', employer_id: 'e3', commission: 420, description: 'Payment for: Bathroom Plumbing Repair', created_at: '2024-01-14T16:00:00Z' },
  { id: 't3', type: 'earning', amount: 4400, status: 'completed', payment_method: 'cash', job_id: 'j6', worker_id: 'w5', employer_id: 'e6', commission: 600, description: 'Payment for: Furniture Repair', created_at: '2024-01-13T15:00:00Z' },
  { id: 't4', type: 'commission', amount: 9000, status: 'completed', payment_method: 'bank_transfer', job_id: 'j5', worker_id: 'w4', employer_id: 'e5', commission: 9000, description: 'Commission for: Electrical Wiring', created_at: '2024-01-13T12:00:00Z' },
  { id: 't5', type: 'withdrawal', amount: 25000, status: 'completed', payment_method: 'easypaisa', worker_id: 'w1', commission: 0, description: 'Wallet withdrawal', created_at: '2024-01-13T10:00:00Z' },
  { id: 't6', type: 'earning', amount: 10560, status: 'completed', payment_method: 'jazzcash', job_id: 'j10', worker_id: 'w10', employer_id: 'e9', commission: 1440, description: 'Payment for: House Deep Cleaning', created_at: '2024-01-14T18:00:00Z' },
  { id: 't7', type: 'refund', amount: 25000, status: 'completed', payment_method: 'easypaisa', job_id: 'j8', employer_id: 'e8', commission: 0, description: 'Refund for: POP Ceiling Installation (cancelled)', created_at: '2024-01-13T09:00:00Z' },
  { id: 't8', type: 'commission', amount: 4200, status: 'completed', payment_method: 'cash', job_id: 'j4', worker_id: 'w3', employer_id: 'e4', commission: 4200, description: 'Commission for: Kitchen Tiles', created_at: '2024-01-15T08:00:00Z' },
  { id: 't9', type: 'earning', amount: 22000, status: 'pending', payment_method: 'cash', job_id: 'j9', worker_id: 'w8', employer_id: 'e1', commission: 3000, description: 'Payment for: Steel Gate Fabrication', created_at: '2024-01-14T10:00:00Z' },
  { id: 't10', type: 'bonus', amount: 5000, status: 'completed', payment_method: 'cash', worker_id: 'w1', commission: 0, description: 'Performance bonus - Top rated worker', created_at: '2024-01-12T12:00:00Z' },
  { id: 't11', type: 'withdrawal', amount: 15000, status: 'pending', payment_method: 'jazzcash', worker_id: 'w2', commission: 0, description: 'Wallet withdrawal request', created_at: '2024-01-15T11:00:00Z' },
  { id: 't12', type: 'commission', amount: 3600, status: 'completed', payment_method: 'cash', job_id: 'j2', worker_id: 'w4', employer_id: 'e2', commission: 3600, description: 'Commission for: AC Installation', created_at: '2024-01-15T14:00:00Z' },
]

export default function FinancialsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [filtered, setFiltered] = useState<Transaction[]>(sampleTransactions)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [methodFilter, setMethodFilter] = useState<string>('all')

  useEffect(() => {
    let result = [...transactions]
    if (typeFilter !== 'all') result = result.filter((t) => t.type === typeFilter)
    if (statusFilter !== 'all') result = result.filter((t) => t.status === statusFilter)
    if (methodFilter !== 'all') result = result.filter((t) => t.payment_method === methodFilter)
    setFiltered(result)
  }, [typeFilter, statusFilter, methodFilter])

  const totalRevenue = 4567890
  const totalCommission = Math.round(totalRevenue * 0.12)
  const totalPayouts = totalRevenue - totalCommission
  const pendingPayments = sampleTransactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      earning: 'bg-green-100 text-green-700 border-green-200',
      withdrawal: 'bg-blue-100 text-blue-700 border-blue-200',
      commission: 'bg-purple-100 text-purple-700 border-purple-200',
      refund: 'bg-red-100 text-red-700 border-red-200',
      bonus: 'bg-amber-100 text-amber-700 border-amber-200',
    }
    return <Badge className={cn('text-xs border', colors[type] || '')}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
    }
    return <Badge className={cn('text-[10px] border', colors[status] || '')}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Financial Report" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">+18% from last month</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Commission (12%)</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalCommission)}</p>
                  <p className="text-xs text-slate-400 mt-1">Platform earnings</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Payouts</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPayouts)}</p>
                  <p className="text-xs text-slate-400 mt-1">To workers</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pending Payments</p>
                  <p className="text-2xl font-bold text-amber-600">{formatCurrency(pendingPayments)}</p>
                  <p className="text-xs text-slate-400 mt-1">{sampleTransactions.filter((t) => t.status === 'pending').length} transactions</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Revenue by Month</CardTitle>
              <CardDescription className="text-xs">Monthly revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }} formatter={(v: number) => [`PKR ${v.toLocaleString()}`]} cursor={{ fill: '#FFF7ED', opacity: 0.5 }} />
                    <Bar dataKey="revenue" fill="#F97316" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Commission by Category</CardTitle>
              <CardDescription className="text-xs">Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={commissionByCategory} cx="50%" cy="45%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                      {commissionByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }} formatter={(v: number) => [`PKR ${v.toLocaleString()}`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {commissionByCategory.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Breakdown Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Monthly Commission Summary</CardTitle>
                <CardDescription className="text-xs">Commission collected each month at 12% rate</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Month</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Commission (12%)</TableHead>
                    <TableHead>Payouts</TableHead>
                    <TableHead>Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByMonth.slice().reverse().slice(0, 6).map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month} 2024</TableCell>
                      <TableCell>{formatCurrency(row.revenue)}</TableCell>
                      <TableCell className="text-purple-600 font-medium">{formatCurrency(row.commission)}</TableCell>
                      <TableCell>{formatCurrency(row.revenue - row.commission)}</TableCell>
                      <TableCell className="text-green-600 font-bold">{formatCurrency(row.commission)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Transaction History</CardTitle>
            <CardDescription className="text-xs">All financial transactions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="earning">Earning</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="easypaisa">Easypaisa</SelectItem>
                  <SelectItem value="jazzcash">JazzCash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-slate-500">No transactions found.</TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">{formatDate(tx.created_at)}</TableCell>
                        <TableCell>{typeBadge(tx.type)}</TableCell>
                        <TableCell>
                          <p className="text-sm max-w-[200px] truncate">{tx.description || '-'}</p>
                        </TableCell>
                        <TableCell>
                          <p className={cn('text-sm font-semibold', tx.type === 'refund' ? 'text-red-600' : 'text-green-600')}>
                            {tx.type === 'refund' ? '-' : '+'}{formatCurrency(tx.amount)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-purple-600">{tx.commission > 0 ? formatCurrency(tx.commission) : '-'}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{tx.payment_method === 'bank_transfer' ? 'Bank' : tx.payment_method.charAt(0).toUpperCase() + tx.payment_method.slice(1)}</p>
                        </TableCell>
                        <TableCell>{statusBadge(tx.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
