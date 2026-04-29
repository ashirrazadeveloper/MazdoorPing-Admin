'use client'

import React, { useState } from 'react'
import {
  AlertTriangle, ShieldCheck, MapPin, Phone, Clock, User,
  CheckCircle2, Eye, Navigation, MessageSquare, XCircle,
  Bell, BellOff,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, formatRelativeTime, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { SOSAlert } from '@/types'

const sampleAlerts: SOSAlert[] = [
  {
    id: 'sos1', worker_id: 'w10', lat: 31.5204, lng: 74.3587,
    message: 'Worker is in an unsafe environment. The employer is threatening and refusing to pay after work completion. Needs immediate assistance.',
    status: 'active', created_at: '2024-01-15T13:45:00Z',
    worker: { id: 'w10', name: 'Rashid Ali', phone: '0305-9998877', city: 'Lahore' },
  },
  {
    id: 'sos2', worker_id: 'w11', lat: 24.8607, lng: 67.0011,
    message: 'Employer refused to pay after work completion. Feeling threatened and unsafe at the worksite.',
    status: 'active', created_at: '2024-01-15T12:30:00Z',
    worker: { id: 'w11', name: 'Faisal Mehmood', phone: '0306-8887766', city: 'Karachi' },
  },
  {
    id: 'sos3', worker_id: 'w12', lat: 33.6844, lng: 73.0479,
    message: 'Accident at worksite. Worker injured and needs medical help immediately.',
    status: 'active', created_at: '2024-01-15T14:15:00Z',
    worker: { id: 'w12', name: 'Tahir Abbas', phone: '0315-8889900', city: 'Islamabad' },
  },
  {
    id: 'sos4', worker_id: 'w7', lat: 31.4504, lng: 74.3587,
    message: 'False alarm - Worker accidentally triggered SOS button.',
    status: 'resolved', resolved_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T09:30:00Z',
    worker: { id: 'w7', name: 'Imran Ali', phone: '0301-6667788', city: 'Lahore' },
  },
  {
    id: 'sos5', worker_id: 'w9', lat: 33.6844, lng: 73.0479,
    message: 'Worker felt unsafe due to electrical hazards at the worksite.',
    status: 'resolved', resolved_at: '2024-01-14T16:00:00Z',
    created_at: '2024-01-14T14:00:00Z',
    worker: { id: 'w9', name: 'Kashif Iqbal', phone: '0309-5554433', city: 'Islamabad' },
  },
  {
    id: 'sos6', worker_id: 'w8', lat: 31.4187, lng: 73.0791,
    message: 'Dispute over payment amount. Employer wants to pay less than agreed.',
    status: 'false_alarm', resolved_at: '2024-01-13T12:00:00Z',
    created_at: '2024-01-13T11:00:00Z',
    worker: { id: 'w8', name: 'Zubair Ahmed', phone: '0308-7776655', city: 'Faisalabad' },
  },
]

export default function SOSAlertsPage() {
  const [alerts, setAlerts] = useState<SOSAlert[]>(sampleAlerts)
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false)
  const [resolveStatus, setResolveStatus] = useState<string>('resolved')

  const activeAlerts = alerts.filter((a) => a.status === 'active')
  const investigatingAlerts = alerts.filter((a) => a.status === 'investigating')
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved' || a.status === 'false_alarm')

  const handleResolve = async () => {
    if (!selectedAlert) return
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id
          ? { ...a, status: resolveStatus as SOSAlert['status'], resolved_at: new Date().toISOString() }
          : a
      )
    )
    setResolveDialogOpen(false)
    setDetailOpen(false)
    try {
      await supabase
        .from('sos_alerts')
        .update({ status: resolveStatus, resolved_at: new Date().toISOString() })
        .eq('id', selectedAlert.id)
    } catch (err) {}
  }

  const openResolveDialog = (alert: SOSAlert) => {
    setSelectedAlert(alert)
    setResolveStatus('resolved')
    setResolveDialogOpen(true)
  }

  const openDetail = (alert: SOSAlert) => {
    setSelectedAlert(alert)
    setDetailOpen(true)
  }

  const statusColors: Record<string, string> = {
    active: 'bg-red-100 text-red-800 border-red-200',
    investigating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    false_alarm: 'bg-slate-100 text-slate-600 border-slate-200',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="SOS Alerts" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className={activeAlerts.length > 0 ? 'border-2 border-red-300 bg-red-50/50' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', activeAlerts.length > 0 ? 'bg-red-100' : 'bg-slate-100')}>
                  <AlertTriangle className={cn('h-5 w-5', activeAlerts.length > 0 ? 'text-red-600' : 'text-slate-400')} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Alerts</p>
                  <p className={cn('text-2xl font-bold', activeAlerts.length > 0 ? 'text-red-600' : 'text-slate-900')}>
                    {activeAlerts.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Eye className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Investigating</p>
                  <p className="text-2xl font-bold text-slate-900">{investigatingAlerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Resolved</p>
                  <p className="text-2xl font-bold text-slate-900">{alerts.filter((a) => a.status === 'resolved').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <BellOff className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">False Alarms</p>
                  <p className="text-2xl font-bold text-slate-900">{alerts.filter((a) => a.status === 'false_alarm').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900">Active SOS Alerts</h2>
              <Badge variant="destructive" className="animate-pulse">
                {activeAlerts.length} ACTIVE
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="border-2 border-red-200 bg-red-50/50 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 animate-pulse">
                          <AlertTriangle className="h-7 w-7 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-red-900">{alert.worker?.name || 'Unknown Worker'}</h3>
                          <p className="text-sm text-red-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {alert.worker?.phone}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive" className="animate-pulse">ACTIVE</Badge>
                    </div>

                    <p className="text-sm text-red-800 bg-white rounded-lg p-3 border border-red-100 mb-3">
                      {alert.message}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-red-600">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="font-mono">{alert.lat.toFixed(4)}, {alert.lng.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-red-600">
                        <Clock className="h-3.5 w-3.5" />
                        {formatRelativeTime(alert.created_at)}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-red-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {alert.worker?.city}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openResolveDialog(alert)}>
                        <ShieldCheck className="mr-1 h-4 w-4" /> Resolve
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => openDetail(alert)}>
                        <Eye className="mr-1 h-4 w-4" /> View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-300 hover:bg-slate-50" onClick={() => window.open(`https://maps.google.com/?q=${alert.lat},${alert.lng}`, '_blank')}>
                        <Navigation className="mr-1 h-4 w-4" /> Open Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Resolved / Past Alerts */}
        {resolvedAlerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Resolved & Past Alerts</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {resolvedAlerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-full',
                          alert.status === 'resolved' ? 'bg-green-100' : 'bg-slate-100'
                        )}>
                          {alert.status === 'resolved' ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          ) : (
                            <BellOff className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{alert.worker?.name || 'Unknown'}</h3>
                          <p className="text-sm text-slate-500">{alert.worker?.phone}</p>
                        </div>
                      </div>
                      <Badge className={cn('border', statusColors[alert.status])}>
                        {getStatusLabel(alert.status)}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{alert.message}</p>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Created: {formatDate(alert.created_at)}
                      </span>
                      {alert.resolved_at && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resolved: {formatDate(alert.resolved_at)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openDetail(alert)}>
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alert Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              SOS Alert Details
            </DialogTitle>
            <DialogDescription>Complete alert information</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 mt-4">
              <Badge className={cn('border', statusColors[selectedAlert.status])}>
                {getStatusLabel(selectedAlert.status)}
              </Badge>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Worker</p>
                  <p className="text-sm font-medium">{selectedAlert.worker?.name}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium">{selectedAlert.worker?.phone}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">City</p>
                  <p className="text-sm font-medium">{selectedAlert.worker?.city}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-slate-500">Coordinates</p>
                  <p className="text-sm font-mono">{selectedAlert.lat.toFixed(4)}, {selectedAlert.lng.toFixed(4)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">Message</p>
                <p className="text-sm bg-slate-50 rounded-lg p-3 border">{selectedAlert.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="font-medium">{formatDate(selectedAlert.created_at)}</p>
                </div>
                {selectedAlert.resolved_at && (
                  <div>
                    <p className="text-xs text-slate-500">Resolved</p>
                    <p className="font-medium">{formatDate(selectedAlert.resolved_at)}</p>
                  </div>
                )}
              </div>

              {selectedAlert.status === 'active' && (
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => openResolveDialog(selectedAlert)}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Resolve Alert
                  </Button>
                  <Button variant="outline" onClick={() => window.open(`https://maps.google.com/?q=${selectedAlert.lat},${selectedAlert.lng}`, '_blank')}>
                    <Navigation className="mr-2 h-4 w-4" /> Open in Maps
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Resolve SOS Alert</DialogTitle>
            <DialogDescription>
              Mark this alert for worker &quot;{selectedAlert?.worker?.name}&quot; as resolved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Resolution Status</p>
              <div className="space-y-2">
                <label
                  className={cn(
                    'flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-colors',
                    resolveStatus === 'resolved' ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'
                  )}
                  onClick={() => setResolveStatus('resolved')}
                >
                  <input
                    type="radio"
                    name="resolveStatus"
                    checked={resolveStatus === 'resolved'}
                    onChange={() => setResolveStatus('resolved')}
                    className="accent-green-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-green-700">Resolved</p>
                    <p className="text-xs text-green-600">Alert was genuine and has been handled</p>
                  </div>
                </label>
                <label
                  className={cn(
                    'flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-colors',
                    resolveStatus === 'false_alarm' ? 'border-slate-500 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  )}
                  onClick={() => setResolveStatus('false_alarm')}
                >
                  <input
                    type="radio"
                    name="resolveStatus"
                    checked={resolveStatus === 'false_alarm'}
                    onChange={() => setResolveStatus('false_alarm')}
                    className="accent-slate-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">False Alarm</p>
                    <p className="text-xs text-slate-500">Alert was triggered accidentally</p>
                  </div>
                </label>
                <label
                  className={cn(
                    'flex items-center gap-3 rounded-lg border-2 p-3 cursor-pointer transition-colors',
                    resolveStatus === 'investigating' ? 'border-yellow-500 bg-yellow-50' : 'border-slate-200 hover:border-slate-300'
                  )}
                  onClick={() => setResolveStatus('investigating')}
                >
                  <input
                    type="radio"
                    name="resolveStatus"
                    checked={resolveStatus === 'investigating'}
                    onChange={() => setResolveStatus('investigating')}
                    className="accent-yellow-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Investigating</p>
                    <p className="text-xs text-yellow-600">Alert is being investigated</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleResolve}>Confirm</Button>
              <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
