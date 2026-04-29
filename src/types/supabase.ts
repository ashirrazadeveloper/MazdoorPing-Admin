export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          name_urdu: string
          icon: string
          demand: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_urdu: string
          icon: string
          demand?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_urdu?: string
          icon?: string
          demand?: number
          created_at?: string
        }
      }
      workers: {
        Row: {
          id: string
          name: string
          phone: string
          email?: string
          cnic?: string
          photo?: string
          category: string
          experience: number
          rate: number
          rate_type: string
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
          fcm_token?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string
          cnic?: string
          photo?: string
          category: string
          experience?: number
          rate: number
          rate_type?: string
          rating?: number
          total_jobs?: number
          available?: boolean
          city?: string
          area?: string
          language?: string
          verified?: boolean
          premium?: boolean
          balance?: number
          total_earned?: number
          lat?: number
          lng?: number
          bio?: string
          fcm_token?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          cnic?: string
          photo?: string
          category?: string
          experience?: number
          rate?: number
          rate_type?: string
          rating?: number
          total_jobs?: number
          available?: boolean
          city?: string
          area?: string
          language?: string
          verified?: boolean
          premium?: boolean
          balance?: number
          total_earned?: number
          lat?: number
          lng?: number
          bio?: string
          fcm_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      employers: {
        Row: {
          id: string
          name: string
          phone: string
          email?: string
          type: string
          city: string
          area?: string
          verified: boolean
          fcm_token?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email?: string
          type?: string
          city?: string
          area?: string
          verified?: boolean
          fcm_token?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          type?: string
          city?: string
          area?: string
          verified?: boolean
          fcm_token?: string
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          category: string
          description?: string
          rate: number
          rate_type: string
          status: string
          city: string
          area?: string
          address?: string
          lat?: number
          lng?: number
          urgent: boolean
          payment_method: string
          payment_status: string
          worker_id?: string
          employer_id: string
          completed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          description?: string
          rate: number
          rate_type?: string
          status?: string
          city?: string
          area?: string
          address?: string
          lat?: number
          lng?: number
          urgent?: boolean
          payment_method?: string
          payment_status?: string
          worker_id?: string
          employer_id: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          description?: string
          rate?: number
          rate_type?: string
          status?: string
          city?: string
          area?: string
          address?: string
          lat?: number
          lng?: number
          urgent?: boolean
          payment_method?: string
          payment_status?: string
          worker_id?: string
          employer_id?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          type: string
          amount: number
          status: string
          payment_method: string
          job_id?: string
          worker_id?: string
          employer_id?: string
          commission: number
          description?: string
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          amount: number
          status?: string
          payment_method?: string
          job_id?: string
          worker_id?: string
          employer_id?: string
          commission?: number
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          amount?: number
          status?: string
          payment_method?: string
          job_id?: string
          worker_id?: string
          employer_id?: string
          commission?: number
          description?: string
          created_at?: string
        }
      }
      sos_alerts: {
        Row: {
          id: string
          worker_id: string
          lat: number
          lng: number
          message?: string
          status: string
          resolved_at?: string
          resolved_by?: string
          created_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          lat: number
          lng: number
          message?: string
          status?: string
          resolved_at?: string
          resolved_by?: string
          created_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          lat?: number
          lng?: number
          message?: string
          status?: string
          resolved_at?: string
          resolved_by?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          rating: number
          comment?: string
          job_id: string
          worker_id: string
          employer_id: string
          created_at: string
        }
        Insert: {
          id?: string
          rating: number
          comment?: string
          job_id: string
          worker_id: string
          employer_id: string
          created_at?: string
        }
        Update: {
          id?: string
          rating?: number
          comment?: string
          job_id?: string
          worker_id?: string
          employer_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          title: string
          message: string
          type: string
          read: boolean
          worker_id?: string
          employer_id?: string
          job_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type?: string
          read?: boolean
          worker_id?: string
          employer_id?: string
          job_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          worker_id?: string
          employer_id?: string
          job_id?: string
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          worker_id: string
          employer_id: string
          created_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          employer_id: string
          created_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          employer_id?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      // Add enums if needed
    }
  }
}
