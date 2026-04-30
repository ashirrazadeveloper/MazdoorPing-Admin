'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdmin = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      return data?.role === 'admin'
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        if (!currentSession) {
          setLoading(false)
          return
        }

        setSession(currentSession)
        setUser(currentSession.user)

        const admin = await checkAdmin(currentSession.user.id)
        setIsAdmin(admin)
      } catch {
        // ignore
      }
      setLoading(false)
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }

      if (newSession) {
        setSession(newSession)
        setUser(newSession.user)
        const admin = await checkAdmin(newSession.user.id)
        setIsAdmin(admin)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [checkAdmin])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-[3px] border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    )
  }

  // Not authenticated — let children handle redirect
  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}
