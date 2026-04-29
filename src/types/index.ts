// Types for the MazdoorPing Admin Panel

export type JobStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
export type PaymentStatus = 'pending' | 'paid' | 'commission_deducted' | 'refunded'
export type PaymentMethod = 'cash' | 'easypaisa' | 'jazzcash' | 'bank_transfer'
export type RateType = 'hourly' | 'daily' | 'weekly' | 'monthly'
export type EmployerType = 'individual' | 'contractor' | 'company'
export type TransactionType = 'earning' | 'withdrawal' | 'commission' | 'refund' | 'bonus'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type SOSStatus = 'active' | 'investigating' | 'resolved' | 'false_alarm'
export type NotificationType = 'info' | 'job' | 'payment' | 'system' | 'sos' | 'review'

export interface Worker {
  id: string
  name: string
  phone: string
  email?: string
  cnic?: string
  photo?: string
  category: string
  experience: number
  rate: number
  rate_type: RateType
  rating: number
  total_jobs: number
  available: boolean
  city: string
  area?: string
  language: string
  verified: boolean
  premium: boolean
  balance: number
  total_earned: number
  lat?: number
  lng?: number
  bio?: string
  created_at: string
  updated_at: string
}

export interface Employer {
  id: string
  name: string
  phone: string
  email?: string
  type: EmployerType
  city: string
  area?: string
  verified: boolean
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  category: string
  description?: string
  rate: number
  rate_type: RateType
  status: JobStatus
  city: string
  area?: string
  address?: string
  lat?: number
  lng?: number
  urgent: boolean
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  worker_id?: string
  employer_id: string
  completed_at?: string
  created_at: string
  updated_at: string
  // Joined relations
  employer?: Pick<Employer, 'id' | 'name' | 'phone'>
  worker?: Pick<Worker, 'id' | 'name' | 'phone'>
}

export interface Category {
  id: string
  name: string
  name_urdu: string
  icon: string
  demand: number
  created_at: string
  worker_count?: number
}

export interface Review {
  id: string
  rating: number
  comment?: string
  job_id: string
  worker_id: string
  employer_id: string
  created_at: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  payment_method: PaymentMethod
  job_id?: string
  worker_id?: string
  employer_id?: string
  commission: number
  description?: string
  created_at: string
}

export interface SOSAlert {
  id: string
  worker_id: string
  lat: number
  lng: number
  message?: string
  status: SOSStatus
  resolved_at?: string
  resolved_by?: string
  created_at: string
  worker?: Pick<Worker, 'id' | 'name' | 'phone' | 'city'>
}

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  worker_id?: string
  employer_id?: string
  job_id?: string
  created_at: string
}

// Dashboard stats
export interface DashboardStats {
  totalWorkers: number
  totalEmployers: number
  activeJobs: number
  totalRevenue: number
  avgRating: number
}

// Chart data types
export interface RevenueChartData {
  month: string
  revenue: number
  commission: number
}

export interface JobsStatusData {
  name: string
  value: number
  color: string
}

export interface CityData {
  city: string
  workers: number
}

export interface CategoryData {
  name: string
  jobs: number
  fill?: string
}
