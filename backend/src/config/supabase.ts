import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://vjfpqtyinumanvpgqlbj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZnBxdHlpbnVtYW52cGdxbGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTEyOTIsImV4cCI6MjA3MTA2NzI5Mn0.IL4G5wXabjKdpUZGBAdAq5bvm1W6Xvb-zg9ux9uq5LY';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Database types for Turn2Law - Matching Frontend Structure
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  country_code: string;
  user_type: 'client' | 'lawyer';
  email_verified: boolean;
  profile_image_url?: string;
  // Client specific fields
  city?: string;
  legal_issue?: string;
  created_at: string;
  updated_at: string;
}

export interface LawyerProfile {
  id: string;
  user_id: string;
  bar_number: string;
  experience_years: number;
  specialization: string;
  education: string;
  court_practice: string;
  languages: string;
  bio: string;
  consultation_fee: number;
  profile_image_url?: string;
  verified: boolean;
  rating: number;
  total_reviews: number;
  total_consultations: number;
  availability_status: 'available' | 'busy' | 'offline';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LegalCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Consultation {
  id: string;
  client_id: string;
  lawyer_id: string;
  category_id: string;
  title: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_at: string;
  duration_minutes: number;
  consultation_type: 'video' | 'phone' | 'chat';
  amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  meeting_link?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  consultation_id: string;
  client_id: string;
  lawyer_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Helper function to check Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.warn('Supabase connection test failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.warn('❌ Supabase connection failed:', error);
    return false;
  }
}