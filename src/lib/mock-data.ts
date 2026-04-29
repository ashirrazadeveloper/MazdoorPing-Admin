import {
  Worker,
  Employer,
  Job,
  Category,
  Transaction,
  WithdrawalRequest,
  SOSAlert,
  DashboardStats,
  RevenueData,
  CategoryData,
  CityData,
  ActivityItem,
} from '@/types';

// ==================== MOCK CATEGORIES ====================
export const mockCategories: Category[] = [
  { id: '1', name: 'Plumber', icon: '🔧', description: 'Pipe fitting, leak repair, installation', base_rate: 800, commission_rate: 15, is_active: true, total_workers: 156, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '2', name: 'Electrician', icon: '⚡', description: 'Wiring, repairs, installation', base_rate: 900, commission_rate: 15, is_active: true, total_workers: 203, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '3', name: 'Carpenter', icon: '🪚', description: 'Furniture, woodwork, repair', base_rate: 1000, commission_rate: 15, is_active: true, total_workers: 89, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '4', name: 'Painter', icon: '🎨', description: 'Interior & exterior painting', base_rate: 700, commission_rate: 12, is_active: true, total_workers: 134, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '5', name: 'Mason', icon: '🧱', description: 'Construction, brick work', base_rate: 900, commission_rate: 15, is_active: true, total_workers: 178, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '6', name: 'Welder', icon: '🔥', description: 'Metal work, welding', base_rate: 1100, commission_rate: 18, is_active: true, total_workers: 67, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '7', name: 'AC Technician', icon: '❄️', description: 'AC repair, installation, gas refill', base_rate: 1200, commission_rate: 18, is_active: true, total_workers: 145, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '8', name: 'Cleaner', icon: '🧹', description: 'House & office cleaning', base_rate: 500, commission_rate: 10, is_active: true, total_workers: 112, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '9', name: 'Driver', icon: '🚗', description: 'Personal & commercial driving', base_rate: 1500, commission_rate: 12, is_active: true, total_workers: 98, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '10', name: 'Laborer', icon: '💪', description: 'Construction & general labor', base_rate: 600, commission_rate: 10, is_active: true, total_workers: 234, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '11', name: 'Gardener', icon: '🌿', description: 'Lawn care, landscaping', base_rate: 700, commission_rate: 12, is_active: true, total_workers: 56, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '12', name: 'Tailor', icon: '🧵', description: 'Stitching, alterations', base_rate: 500, commission_rate: 10, is_active: true, total_workers: 78, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '13', name: 'Mechanic', icon: '🔩', description: 'Vehicle repair & maintenance', base_rate: 1000, commission_rate: 15, is_active: true, total_workers: 167, created_at: '2024-01-15', updated_at: '2024-01-15' },
  { id: '14', name: 'Locksmith', icon: '🔑', description: 'Lock repair, key making', base_rate: 800, commission_rate: 15, is_active: true, total_workers: 45, created_at: '2024-01-15', updated_at: '2024-01-15' },
];

// ==================== MOCK WORKERS ====================
export const mockWorkers: Worker[] = [
  { id: 'w1', user_id: 'u1', full_name: 'Muhammad Ali', phone: '0300-1234567', cnic: '35201-1234567-1', category_id: '1', city: 'Lahore', area: 'DHA Phase 5', rating: 4.8, total_reviews: 56, total_jobs: 124, total_earnings: 245000, is_verified: true, is_active: true, is_available: true, base_rate: 800, experience_years: 8, skills: ['Pipe Fitting', 'Leak Repair', 'Installation'], bio: 'Experienced plumber with 8 years of expertise', created_at: '2024-01-20', updated_at: '2024-03-15', category: mockCategories[0] },
  { id: 'w2', user_id: 'u2', full_name: 'Ahmed Hassan', phone: '0301-2345678', cnic: '35201-2345678-1', category_id: '2', city: 'Karachi', area: 'Clifton', rating: 4.5, total_reviews: 34, total_jobs: 89, total_earnings: 198000, is_verified: true, is_active: true, is_available: false, base_rate: 900, experience_years: 5, skills: ['Wiring', 'Circuit Repair', 'Installation'], bio: 'Certified electrician', created_at: '2024-02-10', updated_at: '2024-03-10', category: mockCategories[1] },
  { id: 'w3', user_id: 'u3', full_name: 'Imran Khan', phone: '0302-3456789', cnic: '35201-3456789-1', category_id: '3', city: 'Islamabad', area: 'F-10 Markaz', rating: 4.9, total_reviews: 78, total_jobs: 156, total_earnings: 412000, is_verified: true, is_active: true, is_available: true, base_rate: 1000, experience_years: 12, skills: ['Furniture Making', 'Wood Carving', 'Repair'], bio: 'Master carpenter specializing in custom furniture', created_at: '2024-01-05', updated_at: '2024-03-20', category: mockCategories[2] },
  { id: 'w4', user_id: 'u4', full_name: 'Bilal Siddiqui', phone: '0303-4567890', cnic: '35201-4567890-1', category_id: '7', city: 'Lahore', area: 'Gulberg III', rating: 4.2, total_reviews: 23, total_jobs: 67, total_earnings: 156000, is_verified: true, is_active: true, is_available: true, base_rate: 1200, experience_years: 4, skills: ['AC Repair', 'Gas Refill', 'Installation'], bio: 'AC technician with quick turnaround', created_at: '2024-02-15', updated_at: '2024-03-18', category: mockCategories[6] },
  { id: 'w5', user_id: 'u5', full_name: 'Usman Sheikh', phone: '0304-5678901', cnic: '35201-5678901-1', category_id: '5', city: 'Rawalpindi', area: 'Satellite Town', rating: 4.6, total_reviews: 45, total_jobs: 98, total_earnings: 287000, is_verified: false, is_active: true, is_available: true, base_rate: 900, experience_years: 7, skills: ['Brick Work', 'Plastering', 'Construction'], bio: 'Skilled mason for all construction needs', created_at: '2024-03-01', updated_at: '2024-03-19', category: mockCategories[4] },
  { id: 'w6', user_id: 'u6', full_name: 'Hammad Raza', phone: '0305-6789012', cnic: '35201-6789012-1', category_id: '10', city: 'Faisalabad', area: 'D Ground', rating: 3.9, total_reviews: 12, total_jobs: 34, total_earnings: 68000, is_verified: true, is_active: false, is_available: false, base_rate: 600, experience_years: 2, skills: ['Loading', 'Unloading', 'General Labor'], bio: 'Hardworking laborer', created_at: '2024-02-20', updated_at: '2024-03-12', category: mockCategories[9] },
  { id: 'w7', user_id: 'u7', full_name: 'Tariq Mehmood', phone: '0306-7890123', cnic: '35201-7890123-1', category_id: '13', city: 'Karachi', area: 'North Nazimabad', rating: 4.7, total_reviews: 67, total_jobs: 145, total_earnings: 345000, is_verified: true, is_active: true, is_available: true, base_rate: 1000, experience_years: 10, skills: ['Engine Repair', 'Oil Change', 'Diagnostics'], bio: 'Expert auto mechanic', created_at: '2024-01-10', updated_at: '2024-03-17', category: mockCategories[12] },
  { id: 'w8', user_id: 'u8', full_name: 'Kamran Yousaf', phone: '0307-8901234', cnic: '35201-8901234-1', category_id: '4', city: 'Lahore', area: 'Model Town', rating: 4.4, total_reviews: 38, total_jobs: 76, total_earnings: 134000, is_verified: true, is_active: true, is_available: false, base_rate: 700, experience_years: 6, skills: ['Interior Painting', 'Exterior Painting', 'Wallpaper'], bio: 'Professional painter', created_at: '2024-02-05', updated_at: '2024-03-14', category: mockCategories[3] },
  { id: 'w9', user_id: 'u9', full_name: 'Naveed Iqbal', phone: '0308-9012345', cnic: '35201-9012345-1', category_id: '9', city: 'Islamabad', area: 'G-9 Markaz', rating: 4.1, total_reviews: 19, total_jobs: 45, total_earnings: 178000, is_verified: false, is_active: true, is_available: true, base_rate: 1500, experience_years: 3, skills: ['Personal Driving', 'Commercial Driving', 'Highway'], bio: 'Experienced driver with valid license', created_at: '2024-03-05', updated_at: '2024-03-20', category: mockCategories[8] },
  { id: 'w10', user_id: 'u10', full_name: 'Asif Malik', phone: '0309-0123456', cnic: '35201-0123456-1', category_id: '6', city: 'Peshawar', area: 'University Town', rating: 4.3, total_reviews: 28, total_jobs: 56, total_earnings: 198000, is_verified: true, is_active: true, is_available: true, base_rate: 1100, experience_years: 9, skills: ['MIG Welding', 'TIG Welding', 'Arc Welding'], bio: 'Certified welder', created_at: '2024-01-25', updated_at: '2024-03-16', category: mockCategories[5] },
];

// ==================== MOCK EMPLOYERS ====================
export const mockEmployers: Employer[] = [
  { id: 'e1', user_id: 'ue1', full_name: 'Saad Ahmed', phone: '0321-1234567', cnic: '35201-1111111-1', city: 'Lahore', company_name: 'Ahmed Constructions', rating: 4.6, total_reviews: 23, total_jobs_posted: 45, total_spent: 567000, is_active: true, created_at: '2024-01-10', updated_at: '2024-03-15' },
  { id: 'e2', user_id: 'ue2', full_name: 'Fatima Noor', phone: '0322-2345678', cnic: '35201-2222222-1', city: 'Karachi', rating: 4.8, total_reviews: 34, total_jobs_posted: 67, total_spent: 890000, is_active: true, created_at: '2024-01-15', updated_at: '2024-03-20' },
  { id: 'e3', user_id: 'ue3', full_name: 'Hassan Raza', phone: '0323-3456789', cnic: '35201-3333333-1', city: 'Islamabad', rating: 4.3, total_reviews: 12, total_jobs_posted: 23, total_spent: 234000, is_active: true, created_at: '2024-02-01', updated_at: '2024-03-18' },
  { id: 'e4', user_id: 'ue4', full_name: 'Ayesha Khan', phone: '0324-4567890', cnic: '35201-4444444-1', city: 'Rawalpindi', rating: 4.5, total_reviews: 18, total_jobs_posted: 34, total_spent: 345000, is_active: true, created_at: '2024-02-10', updated_at: '2024-03-19' },
  { id: 'e5', user_id: 'ue5', full_name: 'Omar Farooq', phone: '0325-5678901', cnic: '35201-5555555-1', city: 'Faisalabad', rating: 4.0, total_reviews: 8, total_jobs_posted: 15, total_spent: 156000, is_active: false, created_at: '2024-02-20', updated_at: '2024-03-10' },
  { id: 'e6', user_id: 'ue6', full_name: 'Zainab Ali', phone: '0326-6789012', cnic: '35201-6666666-1', city: 'Lahore', rating: 4.7, total_reviews: 29, total_jobs_posted: 56, total_spent: 678000, is_active: true, created_at: '2024-01-20', updated_at: '2024-03-17' },
  { id: 'e7', user_id: 'ue7', full_name: 'Bilal Waqas', phone: '0327-7890123', cnic: '35201-7777777-1', city: 'Peshawar', rating: 4.2, total_reviews: 15, total_jobs_posted: 28, total_spent: 289000, is_active: true, created_at: '2024-03-01', updated_at: '2024-03-20' },
  { id: 'e8', user_id: 'ue8', full_name: 'Mariam Siddiqui', phone: '0328-8901234', cnic: '35201-8888888-1', city: 'Karachi', rating: 4.9, total_reviews: 42, total_jobs_posted: 89, total_spent: 1230000, is_active: true, created_at: '2024-01-05', updated_at: '2024-03-20' },
];

// ==================== MOCK JOBS ====================
export const mockJobs: Job[] = [
  { id: 'j1', employer_id: 'e1', worker_id: 'w1', category_id: '1', title: 'Bathroom Pipe Repair', description: 'Need to fix leaking pipes in bathroom', city: 'Lahore', area: 'DHA Phase 5', address: 'House 23, Street 4, DHA Phase 5', status: 'completed', budget_min: 2000, budget_max: 5000, final_price: 3500, commission: 525, is_urgent: false, scheduled_date: '2024-03-15', scheduled_time: '10:00 AM', completed_at: '2024-03-15', created_at: '2024-03-14', updated_at: '2024-03-15', employer: mockEmployers[0], worker: mockWorkers[0], category: mockCategories[0] },
  { id: 'j2', employer_id: 'e2', worker_id: 'w2', category_id: '2', title: 'Full House Wiring', description: 'Complete rewiring for a 3-story house', city: 'Karachi', area: 'Clifton', address: 'Block 5, Clifton', status: 'in_progress', budget_min: 15000, budget_max: 25000, final_price: 20000, commission: 3000, is_urgent: false, scheduled_date: '2024-03-18', scheduled_time: '09:00 AM', created_at: '2024-03-16', updated_at: '2024-03-18', employer: mockEmployers[1], worker: mockWorkers[1], category: mockCategories[1] },
  { id: 'j3', employer_id: 'e3', category_id: '3', title: 'Custom Wardrobe', description: 'Build a custom wooden wardrobe', city: 'Islamabad', area: 'F-10 Markaz', address: 'Street 12, F-10', status: 'open', budget_min: 20000, budget_max: 35000, commission: 0, is_urgent: false, scheduled_date: '2024-03-25', created_at: '2024-03-20', updated_at: '2024-03-20', employer: mockEmployers[2], category: mockCategories[2] },
  { id: 'j4', employer_id: 'e4', worker_id: 'w4', category_id: '7', title: 'AC Gas Refill & Service', description: 'Annual AC service with gas refill for 3 units', city: 'Lahore', area: 'Gulberg III', address: 'Main Boulevard Gulberg', status: 'completed', budget_min: 5000, budget_max: 8000, final_price: 6500, commission: 975, is_urgent: true, scheduled_date: '2024-03-12', completed_at: '2024-03-12', created_at: '2024-03-11', updated_at: '2024-03-12', employer: mockEmployers[3], worker: mockWorkers[3], category: mockCategories[6] },
  { id: 'j5', employer_id: 'e5', worker_id: 'w5', category_id: '5', title: 'Wall Construction', description: 'Build a boundary wall - 40 feet', city: 'Rawalpindi', area: 'Satellite Town', address: 'House 56, Satellite Town', status: 'disputed', budget_min: 30000, budget_max: 50000, final_price: 42000, commission: 6300, is_urgent: false, scheduled_date: '2024-03-10', created_at: '2024-03-08', updated_at: '2024-03-16', employer: mockEmployers[4], worker: mockWorkers[4], category: mockCategories[4] },
  { id: 'j6', employer_id: 'e6', category_id: '9', title: 'Airport Drop-off', description: 'Need driver for airport drop early morning', city: 'Lahore', area: 'Model Town', address: 'Model Town Extension', status: 'open', budget_min: 1500, budget_max: 2500, commission: 0, is_urgent: true, scheduled_date: '2024-03-22', scheduled_time: '04:00 AM', created_at: '2024-03-21', updated_at: '2024-03-21', employer: mockEmployers[5], category: mockCategories[8] },
  { id: 'j7', employer_id: 'e7', worker_id: 'w7', category_id: '13', title: 'Engine Overhaul', description: 'Complete engine overhaul for Honda Civic 2019', city: 'Peshawar', area: 'University Town', address: 'University Road Workshop', status: 'in_progress', budget_min: 25000, budget_max: 40000, final_price: 35000, commission: 5250, is_urgent: false, scheduled_date: '2024-03-17', created_at: '2024-03-15', updated_at: '2024-03-19', employer: mockEmployers[6], worker: mockWorkers[6], category: mockCategories[12] },
  { id: 'j8', employer_id: 'e8', worker_id: 'w3', category_id: '3', title: 'Kitchen Cabinets', description: 'Build and install kitchen cabinets', city: 'Karachi', area: 'North Nazimabad', address: 'Block H, North Nazimabad', status: 'completed', budget_min: 40000, budget_max: 70000, final_price: 55000, commission: 8250, is_urgent: false, scheduled_date: '2024-03-05', completed_at: '2024-03-10', created_at: '2024-03-01', updated_at: '2024-03-10', employer: mockEmployers[7], worker: mockWorkers[2], category: mockCategories[2] },
  { id: 'j9', employer_id: 'e1', worker_id: 'w8', category_id: '4', title: 'Office Painting', description: 'Paint 4 rooms in office', city: 'Lahore', area: 'Johar Town', address: 'Office 12, Johar Town', status: 'cancelled', budget_min: 15000, budget_max: 25000, commission: 0, is_urgent: false, scheduled_date: '2024-03-20', created_at: '2024-03-18', updated_at: '2024-03-19', employer: mockEmployers[0], worker: mockWorkers[7], category: mockCategories[3] },
  { id: 'j10', employer_id: 'e2', category_id: '6', title: 'Gate Fabrication', description: 'Fabricate and install main gate', city: 'Karachi', area: 'Defence', address: 'DHA Phase 6', status: 'open', budget_min: 20000, budget_max: 35000, commission: 0, is_urgent: false, created_at: '2024-03-20', updated_at: '2024-03-20', employer: mockEmployers[1], category: mockCategories[5] },
];

// ==================== MOCK TRANSACTIONS ====================
export const mockTransactions: Transaction[] = [
  { id: 't1', type: 'commission', amount: 525, status: 'completed', description: 'Commission from Job #j1 - Bathroom Pipe Repair', job_id: 'j1', worker_id: 'w1', employer_id: 'e1', created_at: '2024-03-15' },
  { id: 't2', type: 'commission', amount: 3000, status: 'pending', description: 'Commission from Job #j2 - Full House Wiring', job_id: 'j2', worker_id: 'w2', employer_id: 'e2', created_at: '2024-03-18' },
  { id: 't3', type: 'commission', amount: 975, status: 'completed', description: 'Commission from Job #j4 - AC Gas Refill', job_id: 'j4', worker_id: 'w4', employer_id: 'e4', created_at: '2024-03-12' },
  { id: 't4', type: 'payout', amount: 24500, status: 'completed', description: 'Payout to Muhammad Ali', worker_id: 'w1', created_at: '2024-03-16' },
  { id: 't5', type: 'payout', amount: 18000, status: 'pending', description: 'Payout to Ahmed Hassan', worker_id: 'w2', created_at: '2024-03-19' },
  { id: 't6', type: 'commission', amount: 8250, status: 'completed', description: 'Commission from Job #j8 - Kitchen Cabinets', job_id: 'j8', worker_id: 'w3', employer_id: 'e8', created_at: '2024-03-10' },
  { id: 't7', type: 'refund', amount: 2000, status: 'completed', description: 'Refund for cancelled Job #j9', job_id: 'j9', employer_id: 'e1', created_at: '2024-03-19' },
  { id: 't8', type: 'withdrawal', amount: 35000, status: 'completed', description: 'Withdrawal by Imran Khan', worker_id: 'w3', created_at: '2024-03-14' },
  { id: 't9', type: 'commission', amount: 6300, status: 'pending', description: 'Commission from Job #j5 - Wall Construction (disputed)', job_id: 'j5', worker_id: 'w5', employer_id: 'e5', created_at: '2024-03-16' },
  { id: 't10', type: 'payout', amount: 42000, status: 'pending', description: 'Payout to Usman Sheikh (held for dispute)', worker_id: 'w5', created_at: '2024-03-17' },
];

// ==================== MOCK WITHDRAWALS ====================
export const mockWithdrawals: WithdrawalRequest[] = [
  { id: 'wd1', worker_id: 'w1', amount: 15000, method: 'JazzCash', account_details: '0300-1234567', status: 'pending', created_at: '2024-03-20', worker: mockWorkers[0] },
  { id: 'wd2', worker_id: 'w2', amount: 25000, method: 'Easypaisa', account_details: '0301-2345678', status: 'pending', created_at: '2024-03-19', worker: mockWorkers[1] },
  { id: 'wd3', worker_id: 'w3', amount: 50000, method: 'Bank Transfer', account_details: 'IBAN: PK36ABCD0000001234567890', status: 'approved', created_at: '2024-03-18', processed_at: '2024-03-19', worker: mockWorkers[2] },
  { id: 'wd4', worker_id: 'w4', amount: 12000, method: 'JazzCash', account_details: '0303-4567890', status: 'pending', created_at: '2024-03-20', worker: mockWorkers[3] },
  { id: 'wd5', worker_id: 'w7', amount: 30000, method: 'Bank Transfer', account_details: 'IBAN: PK36EFGH0000009876543210', status: 'rejected', created_at: '2024-03-17', processed_at: '2024-03-18', worker: mockWorkers[6] },
];

// ==================== MOCK SOS ALERTS ====================
export const mockSOSAlerts: SOSAlert[] = [
  { id: 'sos1', worker_id: 'w1', job_id: 'j2', latitude: 24.8607, longitude: 67.0011, address: 'Block 5, Clifton, Karachi', message: 'Employer became aggressive, need help immediately', status: 'active', emergency_contact: '0300-1234567', created_at: '2024-03-20T14:30:00', worker: mockWorkers[0] },
  { id: 'sos2', worker_id: 'w5', job_id: 'j5', latitude: 33.5651, longitude: 73.0169, address: 'House 56, Satellite Town, Rawalpindi', message: 'Disputed situation, employer refusing to pay', status: 'acknowledged', emergency_contact: '0304-5678901', created_at: '2024-03-20T11:15:00', worker: mockWorkers[4] },
  { id: 'sos3', worker_id: 'w6', latitude: 31.4504, longitude: 73.1350, address: 'D Ground, Faisalabad', message: 'Injured at work site', status: 'resolved', emergency_contact: '0305-6789012', created_at: '2024-03-19T09:45:00', resolved_at: '2024-03-19T11:00:00', worker: mockWorkers[5] },
  { id: 'sos4', worker_id: 'w10', latitude: 34.0151, longitude: 71.5249, address: 'University Town, Peshawar', message: 'Suspicious activity at workplace', status: 'active', emergency_contact: '0309-0123456', created_at: '2024-03-20T16:00:00', worker: mockWorkers[9] },
];

// ==================== MOCK DASHBOARD STATS ====================
export const mockDashboardStats: DashboardStats = {
  totalWorkers: 1762,
  totalEmployers: 489,
  activeJobs: 234,
  totalRevenue: 4567890,
  pendingSOS: 2,
  workersGrowth: 12.5,
  employersGrowth: 8.3,
  revenueGrowth: 23.1,
};

// ==================== MOCK CHART DATA ====================
export const mockRevenueData: RevenueData[] = [
  { month: 'Oct', revenue: 1250000, commission: 187500 },
  { month: 'Nov', revenue: 1480000, commission: 222000 },
  { month: 'Dec', revenue: 1320000, commission: 198000 },
  { month: 'Jan', revenue: 1690000, commission: 253500 },
  { month: 'Feb', revenue: 1850000, commission: 277500 },
  { month: 'Mar', revenue: 2100000, commission: 315000 },
];

export const mockCategoryData: CategoryData[] = [
  { name: 'Electrician', workers: 203, jobs: 456 },
  { name: 'Plumber', workers: 156, jobs: 389 },
  { name: 'Laborer', workers: 234, jobs: 312 },
  { name: 'Mechanic', workers: 167, jobs: 278 },
  { name: 'AC Tech', workers: 145, jobs: 234 },
  { name: 'Mason', workers: 178, jobs: 198 },
  { name: 'Painter', workers: 134, jobs: 167 },
  { name: 'Cleaner', workers: 112, jobs: 145 },
];

export const mockCityData: CityData[] = [
  { name: 'Lahore', value: 456 },
  { name: 'Karachi', value: 389 },
  { name: 'Islamabad', value: 278 },
  { name: 'Rawalpindi', value: 189 },
  { name: 'Faisalabad', value: 145 },
  { name: 'Peshawar', value: 98 },
  { name: 'Multan', value: 67 },
  { name: 'Quetta', value: 45 },
];

// ==================== MOCK ACTIVITY ====================
export const mockActivity: ActivityItem[] = [
  { id: 'a1', type: 'worker_registered', message: 'New worker Asif Malik registered as Welder in Peshawar', timestamp: '2024-03-20T16:30:00' },
  { id: 'a2', type: 'job_posted', message: 'Fatima Noor posted "Gate Fabrication" job in Karachi', timestamp: '2024-03-20T16:00:00' },
  { id: 'a3', type: 'sos_alert', message: 'SOS Alert from Muhammad Ali in Clifton, Karachi', timestamp: '2024-03-20T14:30:00' },
  { id: 'a4', type: 'job_completed', message: 'Job "Kitchen Cabinets" completed by Imran Khan', timestamp: '2024-03-20T13:00:00' },
  { id: 'a5', type: 'payment_received', message: 'Commission Rs.8,250 received from Kitchen Cabinets job', timestamp: '2024-03-20T12:45:00' },
  { id: 'a6', type: 'worker_registered', message: 'New worker Naveed Iqbal registered as Driver in Islamabad', timestamp: '2024-03-20T12:00:00' },
  { id: 'a7', type: 'job_posted', message: 'Zainab Ali posted "Airport Drop-off" urgent job in Lahore', timestamp: '2024-03-20T11:30:00' },
  { id: 'a8', type: 'review_posted', message: 'Saad Ahmed left 5-star review for Muhammad Ali', timestamp: '2024-03-20T11:00:00' },
];
