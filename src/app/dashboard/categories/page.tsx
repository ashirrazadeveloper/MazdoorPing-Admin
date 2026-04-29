'use client'

import React, { useState } from 'react'
import {
  Grid3X3, Users, TrendingUp, Edit3, Save, X, BarChart3,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

const sampleCategories: Category[] = [
  { id: 'c1', name: 'Painter', name_urdu: 'پینٹر', icon: '🎨', demand: 10, created_at: '2023-01-01T00:00:00Z', worker_count: 345 },
  { id: 'c2', name: 'Electrician', name_urdu: 'بجلی کا کام', icon: '⚡', demand: 9, created_at: '2023-01-01T00:00:00Z', worker_count: 298 },
  { id: 'c3', name: 'Plumber', name_urdu: 'پلمبر', icon: '🔧', demand: 8, created_at: '2023-01-01T00:00:00Z', worker_count: 256 },
  { id: 'c4', name: 'Mason', name_urdu: 'راج', icon: '🧱', demand: 7, created_at: '2023-01-01T00:00:00Z', worker_count: 198 },
  { id: 'c5', name: 'Carpenter', name_urdu: 'تختی', icon: '🪚', demand: 8, created_at: '2023-01-01T00:00:00Z', worker_count: 187 },
  { id: 'c6', name: 'Welder', name_urdu: 'ولڈر', icon: '🔥', demand: 6, created_at: '2023-01-01T00:00:00Z', worker_count: 98 },
  { id: 'c7', name: 'Tile Fixer', name_urdu: 'ٹائل فکسر', icon: '🔲', demand: 7, created_at: '2023-01-01T00:00:00Z', worker_count: 145 },
  { id: 'c8', name: 'POP Ceiling', name_urdu: 'پاپ سیلنگ', icon: '🏠', demand: 6, created_at: '2023-01-01T00:00:00Z', worker_count: 87 },
  { id: 'c9', name: 'Gardener', name_urdu: 'باغبان', icon: '🌿', demand: 5, created_at: '2023-01-01T00:00:00Z', worker_count: 67 },
  { id: 'c10', name: 'Cleaner', name_urdu: 'صفائی', icon: '🧹', demand: 5, created_at: '2023-01-01T00:00:00Z', worker_count: 56 },
  { id: 'c11', name: 'Mover', name_urdu: 'منقولات', icon: '📦', demand: 4, created_at: '2023-01-01T00:00:00Z', worker_count: 45 },
  { id: 'c12', name: 'AC Technician', name_urdu: 'اے سی ٹیکنیشن', icon: '❄️', demand: 9, created_at: '2023-01-01T00:00:00Z', worker_count: 234 },
  { id: 'c13', name: 'Glass Worker', name_urdu: 'شیشہ', icon: '🪟', demand: 4, created_at: '2023-01-01T00:00:00Z', worker_count: 34 },
  { id: 'c14', name: 'General Helper', name_urdu: 'ہیلپر', icon: '👷', demand: 10, created_at: '2023-01-01T00:00:00Z', worker_count: 132 },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(sampleCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDemand, setEditDemand] = useState<number>(0)

  const getDemandColor = (demand: number) => {
    if (demand >= 8) return 'text-green-600'
    if (demand >= 5) return 'text-amber-600'
    return 'text-slate-500'
  }

  const getDemandBg = (demand: number) => {
    if (demand >= 8) return 'bg-green-100'
    if (demand >= 5) return 'bg-amber-100'
    return 'bg-slate-100'
  }

  const getDemandLabel = (demand: number) => {
    if (demand >= 9) return 'Very High'
    if (demand >= 7) return 'High'
    if (demand >= 5) return 'Medium'
    if (demand >= 3) return 'Low'
    return 'Very Low'
  }

  const handleEditDemand = (cat: Category) => {
    setEditingId(cat.id)
    setEditDemand(cat.demand)
  }

  const handleSaveDemand = async (cat: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, demand: editDemand } : c))
    )
    setEditingId(null)
    try {
      await supabase.from('categories').update({ demand: editDemand }).eq('id', cat.id)
    } catch (err) {}
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditDemand(0)
  }

  const totalWorkers = categories.reduce((sum, cat) => sum + (cat.worker_count || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Categories Management" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <Grid3X3 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Categories</p>
                  <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Workers</p>
                  <p className="text-2xl font-bold text-slate-900">{totalWorkers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Avg Workers/Category</p>
                  <p className="text-2xl font-bold text-slate-900">{Math.round(totalWorkers / categories.length)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">{cat.name}</h3>
                      <p className="text-sm text-slate-500" dir="rtl">{cat.name_urdu}</p>
                    </div>
                  </div>
                  <Badge className={cn('text-[10px]', getDemandBg(cat.demand), getDemandColor(cat.demand))}>
                    {getDemandLabel(cat.demand)}
                  </Badge>
                </div>

                {/* Worker count */}
                <div className="mt-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">{cat.worker_count || 0}</span> workers
                  </p>
                </div>

                {/* Demand Meter */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Demand Level</span>
                    <span className={cn('text-xs font-semibold', getDemandColor(cat.demand))}>{cat.demand}/10</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        cat.demand >= 8 ? 'bg-green-500' : cat.demand >= 5 ? 'bg-amber-500' : 'bg-slate-400'
                      )}
                      style={{ width: `${cat.demand * 10}%` }}
                    />
                  </div>
                  {/* Demand dots */}
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full',
                          i < cat.demand
                            ? cat.demand >= 8
                              ? 'bg-green-500'
                              : cat.demand >= 5
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                            : 'bg-slate-100'
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Edit Demand */}
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  {editingId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={editDemand}
                        onChange={(e) => setEditDemand(parseInt(e.target.value))}
                        className="w-24 accent-orange-500"
                      />
                      <span className="text-sm font-medium w-6 text-center">{editDemand}</span>
                      <Button size="sm" className="h-7 px-2 text-xs" onClick={() => handleSaveDemand(cat)}>
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={handleCancelEdit}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-slate-400">Updated {new Date(cat.created_at).toLocaleDateString()}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-primary hover:text-primary-600"
                        onClick={() => handleEditDemand(cat)}
                      >
                        <Edit3 className="mr-1 h-3 w-3" /> Edit Demand
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
