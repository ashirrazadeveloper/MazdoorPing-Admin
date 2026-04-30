import { supabase } from './supabase'

// ==================== AUTH ====================
export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function checkIsAdmin(userId: string) {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).single()
  return data?.role === 'admin'
}

// ==================== DASHBOARD STATS ====================
export async function getDashboardStats() {
  const [workersRes, employersRes, jobsRes, revenueRes, sosRes] = await Promise.all([
    supabase.from('workers').select('id', { count: 'exact', head: true }),
    supabase.from('employers').select('id', { count: 'exact', head: true }),
    supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('transactions').select('amount').eq('type', 'commission'),
    supabase.from('sos_alerts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ])
  const totalRevenue = (revenueRes.data || []).reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0)
  return {
    totalWorkers: workersRes.count || 0,
    totalEmployers: employersRes.count || 0,
    activeJobs: jobsRes.count || 0,
    totalRevenue,
    pendingSOS: sosRes.count || 0,
    workersGrowth: 12.5,
    employersGrowth: 8.3,
    revenueGrowth: 23.1,
  }
}

// ==================== WORKERS ====================
export async function getAllWorkers(filters?: { status?: string; search?: string; category?: string; city?: string }) {
  let query = supabase
    .from('workers')
    .select('*, profiles!inner(full_name, phone), category:categories(*)')
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.category) query = query.eq('category_id', filters.category)
  if (filters?.city) query = query.eq('city', filters.city)
  if (filters?.search) {
    query = query.or(
      `profiles.full_name.ilike.%${filters.search}%,profiles.phone.ilike.%${filters.search}%,cnic.ilike.%${filters.search}%`
    )
  }

  const { data } = await query
  return (data || []).map((w: any) => ({
    ...w,
    full_name: w.profiles?.full_name || '',
    phone: w.profiles?.phone || '',
  }))
}

export async function updateWorkerStatus(workerId: string, status: 'active' | 'rejected' | 'suspended') {
  const updates: any = { status }
  if (status === 'active') updates.is_verified = true
  if (status === 'active') updates.is_available = true
  const { data, error } = await supabase
    .from('workers')
    .update(updates)
    .eq('id', workerId)
    .select()
    .single()

  // Get worker profile for notification
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', workerId)
    .single()

  if (status === 'active') {
    await supabase.from('notifications').insert({
      user_id: workerId,
      type: 'system',
      title: 'Account Verified!',
      message: `Congratulations ${profile?.full_name || ''}! Your account has been verified. You can now use all features of MazdoorPing.`,
    })
  } else if (status === 'rejected') {
    await supabase.from('notifications').insert({
      user_id: workerId,
      type: 'system',
      title: 'Account Rejected',
      message: `Your verification was not approved. Please contact support for more information.`,
    })
  } else if (status === 'suspended') {
    await supabase.from('notifications').insert({
      user_id: workerId,
      type: 'system',
      title: 'Account Suspended',
      message: 'Your account has been suspended. Please contact support for more information.',
    })
  }

  return { data, error }
}

export async function getPendingWorkersCount() {
  const { count } = await supabase
    .from('workers')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
  return count || 0
}

// ==================== EMPLOYERS ====================
export async function getAllEmployers(filters?: { search?: string; city?: string }) {
  let query = supabase
    .from('employers')
    .select('*, profiles!inner(full_name, phone)')
    .order('created_at', { ascending: false })

  if (filters?.city) query = query.eq('city', filters.city)
  if (filters?.search) {
    query = query.or(
      `profiles.full_name.ilike.%${filters.search}%,profiles.phone.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`
    )
  }

  const { data } = await query
  return (data || []).map((e: any) => ({
    ...e,
    full_name: e.profiles?.full_name || '',
    phone: e.profiles?.phone || '',
  }))
}

export async function updateEmployerStatus(employerId: string, isActive: boolean) {
  const { data } = await supabase
    .from('employers')
    .update({ is_active: isActive })
    .eq('id', employerId)
    .select()
    .single()
  return data
}

// ==================== JOBS ====================
export async function getAllJobs(filters?: { status?: string; category?: string }) {
  let query = supabase
    .from('jobs')
    .select(
      '*, category:categories(*), employer:employers!employer_id(id, company_name, profiles!inner(full_name, phone)), worker:workers!worker_id(id, profiles!inner(full_name))'
    )
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.category) query = query.eq('category_id', filters.category)

  const { data } = await query
  return (data || []).map((j: any) => ({
    ...j,
    employer: j.employer
      ? { ...j.employer, full_name: j.employer.profiles?.full_name || '', phone: j.employer.profiles?.phone || '' }
      : null,
    worker: j.worker
      ? { ...j.worker, full_name: j.worker.profiles?.full_name || '' }
      : null,
  }))
}

export async function updateJobStatus(jobId: string, status: string) {
  const updates: any = { status }
  if (status === 'completed') updates.completed_at = new Date().toISOString()
  const { data } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId)
    .select()
    .single()
  return data
}

// ==================== CATEGORIES ====================
export async function getAllCategories() {
  const { data } = await supabase.from('categories').select('*').order('name')
  return data || []
}

export async function updateCategory(id: string, updates: any) {
  const { data } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return data
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  const { data } = await supabase
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()
  return data
}

// ==================== FINANCIALS ====================
export async function getFinancialData() {
  const [transactions, withdrawals] = await Promise.all([
    supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(100),
    supabase
      .from('withdrawals')
      .select('*, worker:workers!worker_id(id, profiles!inner(full_name, phone))')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const totalEarnings = (transactions.data || [])
    .filter((t: any) => t.type === 'commission')
    .reduce((s: number, t: any) => s + Number(t.amount), 0)
  const totalPayouts = (transactions.data || [])
    .filter((t: any) => t.type === 'payout')
    .reduce((s: number, t: any) => s + Number(t.amount), 0)

  const mappedWithdrawals = (withdrawals.data || []).map((w: any) => ({
    ...w,
    worker: w.worker
      ? { ...w.worker, full_name: w.worker.profiles?.full_name || '', phone: w.worker.profiles?.phone || '' }
      : null,
  }))

  return {
    transactions: transactions.data || [],
    withdrawals: mappedWithdrawals,
    totalEarnings,
    totalPayouts,
  }
}

export async function approveWithdrawal(withdrawalId: string) {
  const { data } = await supabase
    .from('withdrawals')
    .update({ status: 'approved', processed_at: new Date().toISOString() })
    .eq('id', withdrawalId)
    .select()
    .single()
  return data
}

export async function rejectWithdrawal(withdrawalId: string) {
  const { data } = await supabase
    .from('withdrawals')
    .update({ status: 'rejected', processed_at: new Date().toISOString() })
    .eq('id', withdrawalId)
    .select()
    .single()
  return data
}

// ==================== SOS ALERTS ====================
export async function getSOSAlerts() {
  const { data } = await supabase
    .from('sos_alerts')
    .select('*, worker:workers!worker_id(id, profiles!inner(full_name, phone), category:categories(name))')
    .order('created_at', { ascending: false })

  return (data || []).map((a: any) => ({
    ...a,
    worker: a.worker
      ? {
          ...a.worker,
          full_name: a.worker.profiles?.full_name || '',
          phone: a.worker.profiles?.phone || '',
        }
      : null,
  }))
}

export async function updateSOSStatus(alertId: string, status: 'acknowledged' | 'resolved') {
  const updates: any = { status }
  if (status === 'resolved') updates.resolved_at = new Date().toISOString()
  const { data } = await supabase
    .from('sos_alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single()
  return data
}

// ==================== SETTINGS ====================
export async function getSettings() {
  const { data } = await supabase.from('settings').select('*')
  return data || []
}

export async function updateSetting(key: string, value: string) {
  const { data } = await supabase
    .from('settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select()
    .single()
  return data
}

export async function upsertSetting(key: string, value: string) {
  const { data } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })
    .select()
    .single()
  return data
}

// ==================== ACTIVITY ====================
export async function getRecentActivity(limit = 20) {
  const [recentJobs, recentWorkers] = await Promise.all([
    supabase
      .from('jobs')
      .select('id, title, status, created_at, employer:employers!employer_id(profiles!inner(full_name))')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('workers')
      .select('id, status, category:categories(name), created_at, profiles!inner(full_name)')
      .order('created_at', { ascending: false })
      .limit(limit),
  ])

  const activity = [
    ...(recentWorkers.data || []).map((w: any) => ({
      id: `w-${w.id}`,
      type: 'worker_registered' as const,
      message: `New worker ${w.profiles?.full_name || 'Unknown'} registered as ${w.category?.name || 'N/A'}`,
      timestamp: w.created_at,
    })),
    ...(recentJobs.data || []).map((j: any) => ({
      id: `j-${j.id}`,
      type: 'job_posted' as const,
      message: `${j.employer?.profiles?.full_name || 'Employer'} posted "${j.title}"`,
      timestamp: j.created_at,
    })),
  ]
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)

  return activity
}

// ==================== CHART DATA ====================
export async function getRevenueByMonth() {
  const { data } = await supabase
    .from('transactions')
    .select('amount, created_at')
    .eq('type', 'commission')
    .order('created_at')

  const monthly: Record<string, number> = {}
  ;(data || []).forEach((t: any) => {
    const month = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    monthly[month] = (monthly[month] || 0) + Number(t.amount || 0)
  })

  return Object.entries(monthly).map(([month, revenue]) => ({
    month,
    revenue,
    commission: Math.round(revenue * 0.15),
  }))
}

export async function getWorkersByCategory() {
  const { data } = await supabase
    .from('categories')
    .select('name, icon, total_workers')
    .order('total_workers', { ascending: false })
    .limit(8)

  return (data || []).map((c: any) => ({
    name: c.name,
    workers: c.total_workers || 0,
    jobs: Math.round((c.total_workers || 0) * 2.3),
  }))
}

export async function getWorkersByCity() {
  const { data } = await supabase.from('workers').select('city')
  const cityCount: Record<string, number> = {}
  ;(data || []).forEach((w: any) => {
    if (w.city) cityCount[w.city] = (cityCount[w.city] || 0) + 1
  })

  return Object.entries(cityCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

// ==================== WORKER SKILLS ====================
export async function getWorkerSkills(workerId: string) {
  const { data } = await supabase.from('worker_skills').select('skill').eq('worker_id', workerId)
  return (data || []).map((s: any) => s.skill)
}
