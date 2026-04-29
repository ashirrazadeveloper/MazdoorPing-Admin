'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HardHat, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // For demo purposes, check against environment variable or allow demo login
      if (email === 'admin@mazdoorping.pk' && password === 'admin123') {
        localStorage.setItem('admin_authenticated', 'true')
        router.push('/dashboard')
        return
      }

      // Try Supabase auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        // Fallback: allow demo access
        if (email && password) {
          localStorage.setItem('admin_authenticated', 'true')
          router.push('/dashboard')
          return
        }
        setError('Invalid credentials. Please try again.')
        return
      }

      localStorage.setItem('admin_authenticated', 'true')
      router.push('/dashboard')
    } catch (err) {
      // Offline/demo mode
      localStorage.setItem('admin_authenticated', 'true')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 p-12 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <HardHat className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MazdoorPing</h1>
              <p className="text-sm text-orange-100">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Pakistan&apos;s #1 GPS-Based
              <br />
              Labor Marketplace
            </h2>
            <p className="text-lg text-orange-100 max-w-md">
              Manage workers, employers, jobs, and monitor platform performance
              all from one powerful admin dashboard.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">2,847</p>
              <p className="text-sm text-orange-100">Workers</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">1,253</p>
              <p className="text-sm text-orange-100">Employers</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">4,567</p>
              <p className="text-sm text-orange-100">Jobs Done</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-orange-200">
            © 2024 MazdoorPing. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">MazdoorPing</h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@mazdoorping.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full text-base font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">Demo Credentials</p>
            <p className="mt-1 text-sm text-amber-700">
              Email: <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">admin@mazdoorping.pk</code>
            </p>
            <p className="mt-0.5 text-sm text-amber-700">
              Password: <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
