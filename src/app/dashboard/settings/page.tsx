'use client'

import React, { useState } from 'react'
import {
  Settings, Save, Info, Percent, Shield, Smartphone,
  Globe, Bell, Mail, Key, HardHat,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [commissionRate, setCommissionRate] = useState(12)
  const [minRate, setMinRate] = useState(500)
  const [maxDailyRate, setMaxDailyRate] = useState(10000)
  const [sosTimeout, setSosTimeout] = useState(30)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Settings" />

      <div className="p-4 sm:p-6 space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="general" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Settings className="mr-1 h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Percent className="mr-1 h-4 w-4" /> Financial
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Bell className="mr-1 h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Info className="mr-1 h-4 w-4" /> About
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Platform Settings</CardTitle>
                  <CardDescription className="text-xs">Configure general platform behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Platform Name</label>
                    <Input defaultValue="MazdoorPing" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Tagline</label>
                    <Input defaultValue="Pakistan's #1 GPS-Based Labor Marketplace" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Support Phone</label>
                    <Input defaultValue="+92-300-1234567" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Support Email</label>
                    <Input defaultValue="support@mazdoorping.pk" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Default Language</label>
                    <Select defaultValue="ur">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ur">Urdu</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Worker Settings</CardTitle>
                  <CardDescription className="text-xs">Worker-related configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Minimum Rate (PKR)</label>
                    <Input type="number" value={minRate} onChange={(e) => setMinRate(parseInt(e.target.value))} />
                    <p className="text-xs text-slate-400">Minimum daily rate a worker can set</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Maximum Daily Rate (PKR)</label>
                    <Input type="number" value={maxDailyRate} onChange={(e) => setMaxDailyRate(parseInt(e.target.value))} />
                    <p className="text-xs text-slate-400">Maximum daily rate cap</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Auto-verification</label>
                    <Select defaultValue="off">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on">Enabled</SelectItem>
                        <SelectItem value="off">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400">Auto-verify workers on signup</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">GPS Tracking</label>
                    <Select defaultValue="on">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on">Enabled</SelectItem>
                        <SelectItem value="off">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400">Track worker location during active jobs</p>
                  </div>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Settings */}
          <TabsContent value="financial">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Commission Settings</CardTitle>
                  <CardDescription className="text-xs">Platform commission configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-orange-800">Commission Rate</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={commissionRate}
                          onChange={(e) => setCommissionRate(parseInt(e.target.value))}
                          className="w-20 text-center text-lg font-bold"
                          min={0}
                          max={50}
                        />
                        <span className="text-xl font-bold text-orange-600">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(parseInt(e.target.value))}
                      className="w-full accent-orange-500"
                    />
                    <p className="text-xs text-orange-600 mt-2">
                      For every PKR 1,000 job, platform earns PKR {commissionRate * 10}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Payment Methods Accepted</label>
                    <div className="space-y-2">
                      {['Cash', 'Easypaisa', 'JazzCash', 'Bank Transfer'].map((method) => (
                        <label key={method} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-slate-50">
                          <input type="checkbox" defaultChecked className="accent-orange-500 rounded" />
                          <span className="text-sm">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Auto-Payout Threshold (PKR)</label>
                    <Input type="number" defaultValue="5000" />
                    <p className="text-xs text-slate-400">Minimum balance before auto-withdrawal</p>
                  </div>

                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : <><Save className="mr-2 h-4 w-4" /> Save Commission Settings</>}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">SOS Alert Settings</CardTitle>
                  <CardDescription className="text-xs">Emergency alert configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">SOS Auto-Timeout (minutes)</label>
                    <Input
                      type="number"
                      value={sosTimeout}
                      onChange={(e) => setSosTimeout(parseInt(e.target.value))}
                    />
                    <p className="text-xs text-slate-400">Auto-resolve SOS if not handled within timeout</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">SOS Notification Recipients</label>
                    <div className="space-y-2">
                      {['Admin Team', 'Support Team', 'Local Emergency'].map((r) => (
                        <label key={r} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-slate-50">
                          <input type="checkbox" defaultChecked={r === 'Admin Team'} className="accent-orange-500 rounded" />
                          <span className="text-sm">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : <><Save className="mr-2 h-4 w-4" /> Save SOS Settings</>}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription className="text-xs">Configure which notifications to send</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    { title: 'New Job Posted', desc: 'When employer posts a new job', checked: true },
                    { title: 'Job Accepted', desc: 'When worker accepts a job', checked: true },
                    { title: 'Job Completed', desc: 'When a job is marked completed', checked: true },
                    { title: 'Payment Received', desc: 'When worker receives payment', checked: true },
                    { title: 'SOS Alert', desc: 'When worker triggers SOS', checked: true },
                    { title: 'New Review', desc: 'When a review is posted', checked: false },
                    { title: 'Worker Signup', desc: 'When new worker registers', checked: false },
                    { title: 'Employer Signup', desc: 'When new employer registers', checked: false },
                    { title: 'Withdrawal Request', desc: 'When worker requests withdrawal', checked: true },
                    { title: 'Dispute Filed', desc: 'When a dispute is raised', checked: true },
                  ].map((item) => (
                    <label key={item.title} className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <div className={cn(
                        'relative h-6 w-11 rounded-full transition-colors cursor-pointer',
                        item.checked ? 'bg-orange-500' : 'bg-slate-200'
                      )}>
                        <div className={cn(
                          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                          item.checked ? 'translate-x-5.5 left-0.5' : 'left-0.5'
                        )} style={{ transform: item.checked ? 'translateX(22px)' : 'translateX(0)' }} />
                      </div>
                    </label>
                  ))}
                </div>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : saved ? '✓ Saved!' : <><Save className="mr-2 h-4 w-4" /> Save Notification Settings</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <HardHat className="h-5 w-5 text-orange-500" />
                    MazdoorPing Admin Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/25">
                      <HardHat className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">MazdoorPing</h3>
                      <p className="text-sm text-slate-500">Admin Dashboard v1.0.0</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 border p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Version</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Build</span>
                      <span className="font-mono text-xs">2024.01.15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Framework</span>
                      <span className="font-medium">Next.js 14</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Database</span>
                      <span className="font-medium">Supabase (PostgreSQL)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">UI Library</span>
                      <span className="font-medium">Tailwind CSS + shadcn/ui</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Platform Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">About MazdoorPing</h4>
                    <p className="text-sm text-orange-700 leading-relaxed">
                      MazdoorPing is Pakistan&apos;s #1 GPS-based labor marketplace connecting
                      skilled workers with employers. Our platform uses real-time GPS tracking,
                      SOS safety features, and a commission-based revenue model to create a
                      transparent and efficient labor market.
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Platform URL</span>
                      <span className="font-medium text-primary">mazdoorping.pk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Support Email</span>
                      <span className="font-medium">support@mazdoorping.pk</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Support Phone</span>
                      <span className="font-medium">+92-300-1234567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Commission Rate</span>
                      <span className="font-medium text-orange-600">{commissionRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Categories</span>
                      <span className="font-medium">14</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Cities</span>
                      <span className="font-medium">8+</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-slate-400 text-center">
                      © 2024 MazdoorPing. All rights reserved.
                      <br />
                      Built with ❤️ in Pakistan
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
