// ==================== WORKER TYPES ====================
export interface Worker {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  cnic: string;
  avatar_url?: string;
  category_id: string;
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  total_earnings: number;
  is_verified: boolean;
  is_active: boolean;
  is_available: boolean;
  base_rate: number;
  experience_years: number;
  skills: string[];
  bio?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// ==================== EMPLOYER TYPES ====================
export interface Employer {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  cnic: string;
  avatar_url?: string;
  company_name?: string;
  city: string;
  rating: number;
  total_reviews: number;
  total_jobs_posted: number;
  total_spent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== JOB TYPES ====================
export interface Job {
  id: string;
  employer_id: string;
  worker_id?: string;
  category_id: string;
  title: string;
  description: string;
  city: string;
  area: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  budget_min: number;
  budget_max: number;
  final_price?: number;
  commission: number;
  is_urgent: boolean;
  scheduled_date?: string;
  scheduled_time?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  employer?: Employer;
  worker?: Worker;
  category?: Category;
  bids?: Bid[];
}

export interface Bid {
  id: string;
  job_id: string;
  worker_id: string;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  worker?: Worker;
}

// ==================== CATEGORY TYPES ====================
export interface Category {
  id: string;
  name: string;
  name_ur?: string;
  icon: string;
  description?: string;
  base_rate: number;
  commission_rate: number;
  is_active: boolean;
  total_workers: number;
  created_at: string;
  updated_at: string;
}

// ==================== FINANCIAL TYPES ====================
export interface Transaction {
  id: string;
  type: 'commission' | 'payout' | 'refund' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  job_id?: string;
  worker_id?: string;
  employer_id?: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  worker_id: string;
  amount: number;
  method: string;
  account_details: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  created_at: string;
  processed_at?: string;
  worker?: Worker;
}

// ==================== SOS ALERT TYPES ====================
export interface SOSAlert {
  id: string;
  worker_id: string;
  job_id?: string;
  latitude: number;
  longitude: number;
  address: string;
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  emergency_contact?: string;
  created_at: string;
  resolved_at?: string;
  worker?: Worker;
}

// ==================== DASHBOARD TYPES ====================
export interface DashboardStats {
  totalWorkers: number;
  totalEmployers: number;
  activeJobs: number;
  totalRevenue: number;
  pendingSOS: number;
  workersGrowth: number;
  employersGrowth: number;
  revenueGrowth: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  commission: number;
}

export interface CategoryData {
  name: string;
  workers: number;
  jobs: number;
}

export interface CityData {
  name: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  type: 'worker_registered' | 'job_posted' | 'job_completed' | 'payment_received' | 'sos_alert' | 'review_posted';
  message: string;
  timestamp: string;
  icon?: string;
}

// ==================== SETTINGS TYPES ====================
export interface PlatformSettings {
  commission_rate: number;
  supported_cities: string[];
  payment_methods: string[];
  min_withdrawal_amount: number;
  max_job_budget: number;
  support_phone: string;
  support_email: string;
}

// ==================== AUTH TYPES ====================
export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  avatar_url?: string;
  last_login?: string;
}
