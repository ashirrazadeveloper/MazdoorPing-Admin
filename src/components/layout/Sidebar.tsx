'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Grid3X3,
  DollarSign,
  AlertTriangle,
  Settings,
  LogOut,
  HardHat,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Workers', href: '/dashboard/workers', icon: Users },
  { label: 'Employers', href: '/dashboard/employers', icon: Building2 },
  { label: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
  { label: 'Categories', href: '/dashboard/categories', icon: Grid3X3 },
  { label: 'Financials', href: '/dashboard/financials', icon: DollarSign },
  { label: 'SOS Alerts', href: '/dashboard/sos-alerts', icon: AlertTriangle },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#1E293B] ${className}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/25">
          <HardHat className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">MazdoorPing</h1>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${active ? 'active' : 'text-slate-400'}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-4">
        <Link
          href="/login"
          className="sidebar-link text-slate-400 hover:text-red-300"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Sign Out</span>
        </Link>
        <div className="mt-3 px-4">
          <p className="text-xs text-slate-500">MazdoorPing v1.0.0</p>
          <p className="text-xs text-slate-600">Pakistan&apos;s #1 Labor App</p>
        </div>
      </div>
    </aside>
  )
}
