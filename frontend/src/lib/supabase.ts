import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
  }

  return { url, anonKey };
}

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const { url, anonKey } = getSupabaseEnv();

  supabaseInstance = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'turn2law-web'
      }
    }
  });

  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseClient(), prop, receiver);
  }
});

// Database types for Turn2Law
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  country_code: string;
  user_type: 'client' | 'lawyer';
  email_verified: boolean;
  profile_image_url?: string;
  city?: string;
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
  rating: number;
  total_consultations: number;
  verified: boolean;
  city: string;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  client_id: string;
  lawyer_id: string;
  title: string;
  description: string;
  legal_area: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  consultation_type: 'video' | 'phone' | 'chat' | 'in_person';
  scheduled_at?: string;
  duration_minutes: number;
  fee: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  razorpay_payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  consultation_id: string;
  sender_id: string;
  message_text: string;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'success' | 'pending' | 'failed';
  payment_method?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  consultation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WalletBalance {
  id: string;
  user_id: string;
  balance: number;
  total_earnings: number;
  total_spent: number;
  pending_amount: number;
  created_at: string;
  updated_at: string;
}

// Authentication helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  return { error };
};

// User profile functions
export const getUserProfile = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

// Lawyer profile functions
export const getLawyerProfile = async (userId: string): Promise<LawyerProfile | null> => {
  const { data, error } = await supabase
    .from('lawyer_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching lawyer profile:', error);
    return null;
  }
  return data;
};

export const updateLawyerProfile = async (userId: string, updates: Partial<LawyerProfile>) => {
  const { data, error } = await supabase
    .from('lawyer_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
};

// Consultation functions
export const getUserConsultations = async (userId: string, userType: 'client' | 'lawyer') => {
  const field = userType === 'client' ? 'client_id' : 'lawyer_id';
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      client:profiles!consultations_client_id_fkey(full_name, email),
      lawyer:profiles!consultations_lawyer_id_fkey(full_name, email)
    `)
    .eq(field, userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching consultations:', error);
    return [];
  }
  return data;
};

export const createConsultation = async (consultation: Partial<Consultation>) => {
  const { data, error } = await supabase
    .from('consultations')
    .insert([consultation])
    .select()
    .single();

  return { data, error };
};

export const updateConsultation = async (id: string, updates: Partial<Consultation>) => {
  const { data, error } = await supabase
    .from('consultations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const getConsultationMessages = async (consultationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching consultation messages:', error);
    return [];
  }

  return data;
};

export const sendMessage = async (message: Partial<Message> & Record<string, any>) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single();

  return { data, error };
};

export const subscribeToMessages = (
  consultationId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`messages:${consultationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `consultation_id=eq.${consultationId}`
      },
      callback
    )
    .subscribe();
};

export const getClientStats = async (userId: string) => {
  const [consultations, wallet] = await Promise.all([
    getUserConsultations(userId, 'client'),
    getWalletBalance(userId)
  ]);

  return {
    totalConsultations: consultations.length,
    activeCases: consultations.filter((c: any) =>
      ['pending', 'accepted', 'in_progress'].includes(c.status)
    ).length,
    walletBalance: wallet?.balance ?? 0,
    totalSpent: wallet?.total_spent ?? 0
  };
};

export const getLawyerStats = async (userId: string) => {
  const [consultations, wallet, profile] = await Promise.all([
    getUserConsultations(userId, 'lawyer'),
    getWalletBalance(userId),
    getLawyerProfile(userId)
  ]);

  const completedConsultations = consultations.filter((c: any) => c.status === 'completed');
  const clientIds = new Set(
    consultations
      .map((c: any) => c.client_id)
      .filter(Boolean)
  );

  const now = new Date();
  const monthlyEarnings = consultations
    .filter((c: any) => {
      const createdAt = new Date(c.created_at);
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    })
    .reduce((sum: number, c: any) => sum + (c.fee ?? 0), 0);

  return {
    totalClients: clientIds.size,
    totalConsultations: consultations.length,
    completedConsultations: completedConsultations.length,
    walletBalance: wallet?.balance ?? 0,
    monthlyEarnings,
    totalEarnings: wallet?.total_earnings ?? 0,
    rating: profile?.rating ?? 5
  };
};

export const getRecentActivity = async (
  userId: string,
  userType: 'client' | 'lawyer',
  limit = 5
) => {
  const [consultations, transactions] = await Promise.all([
    getUserConsultations(userId, userType),
    getTransactions(userId)
  ]);

  const consultationActivity = consultations.map((consultation: any) => ({
    id: consultation.id,
    type: 'consultation',
    title: consultation.title || consultation.legal_area || 'Consultation',
    status: consultation.status,
    date: consultation.updated_at || consultation.created_at,
    participant: userType === 'client'
      ? consultation.lawyer?.full_name
      : consultation.client?.full_name
  }));

  const transactionActivity = transactions.map((transaction: any) => ({
    id: transaction.id,
    type: 'transaction',
    date: transaction.created_at,
    transactionType: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    status: transaction.status
  }));

  return [...consultationActivity, ...transactionActivity]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export const getWalletBalance = async (userId: string): Promise<WalletBalance | null> => {
  const { data, error } = await supabase
    .from('wallet_balances')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching wallet balance:', error);
    return null;
  }

  return data;
};

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data ?? [];
};

export const createTransaction = async (transaction: Partial<Transaction>) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();

  return { data, error };
};

export const updateWalletBalance = async (
  userId: string,
  amount: number,
  type: 'credit' | 'debit'
) => {
  const currentWallet = await getWalletBalance(userId);

  if (!currentWallet) {
    const initialValues = type === 'credit'
      ? {
          balance: amount,
          total_earnings: amount,
          total_spent: 0,
          pending_amount: 0
        }
      : {
          balance: 0,
          total_earnings: 0,
          total_spent: 0,
          pending_amount: amount
        };

    const { data, error } = await supabase
      .from('wallet_balances')
      .insert([{
        user_id: userId,
        ...initialValues,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    return { data, error };
  }

  const updates = type === 'credit'
    ? {
        balance: currentWallet.balance + amount,
        total_earnings: currentWallet.total_earnings + amount,
        updated_at: new Date().toISOString()
      }
    : {
        balance: Math.max(0, currentWallet.balance - amount),
        pending_amount: currentWallet.pending_amount + amount,
        updated_at: new Date().toISOString()
      };

  const { data, error } = await supabase
    .from('wallet_balances')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
};
