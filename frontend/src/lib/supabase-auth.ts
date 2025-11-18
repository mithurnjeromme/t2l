import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  userType: 'client' | 'lawyer';
  phone?: string;
  city?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up with email and password
 * Creates both an auth user and a profile in the database
 */
export const signUpWithEmail = async (data: SignUpData) => {
  const { email, password, fullName, userType, phone, city } = data;
  
  console.log('[Supabase Auth] Signing up user:', email);
  
  // Create auth user in Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: userType,
        phone: phone || null,
        city: city || null
      }
    }
  });

  if (authError) {
    console.error('[Supabase Auth] Signup error:', authError);
    throw authError;
  }

  console.log('[Supabase Auth] Signup successful:', authData.user?.id);
  
  // Profile will be created automatically by database trigger
  return { user: authData.user, session: authData.session };
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (data: SignInData) => {
  const { email, password } = data;
  
  console.log('[Supabase Auth] Signing in user:', email);
  
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('[Supabase Auth] Sign in error:', error);
    throw error;
  }

  console.log('[Supabase Auth] Sign in successful:', authData.user?.id);
  
  return { user: authData.user, session: authData.session };
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  console.log('[Supabase Auth] Signing out');
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('[Supabase Auth] Sign out error:', error);
    throw error;
  }
  
  console.log('[Supabase Auth] Sign out successful');
};

/**
 * Get current session
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('[Supabase Auth] Get session error:', error);
    throw error;
  }
  
  return session;
};

/**
 * Get current user
 */
export const getCurrentAuthUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('[Supabase Auth] Get user error:', error);
    throw error;
  }
  
  return user;
};

/**
 * Request password reset email
 */
export const resetPasswordRequest = async (email: string) => {
  console.log('[Supabase Auth] Requesting password reset for:', email);
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) {
    console.error('[Supabase Auth] Password reset request error:', error);
    throw error;
  }
  
  console.log('[Supabase Auth] Password reset email sent');
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string) => {
  console.log('[Supabase Auth] Updating password');
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    console.error('[Supabase Auth] Update password error:', error);
    throw error;
  }
  
  console.log('[Supabase Auth] Password updated successfully');
};

/**
 * Listen to auth state changes
 * Returns an unsubscribe function
 */
export const onAuthStateChange = (callback: (session: any) => void) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log('[Supabase Auth] Auth state changed:', _event);
    callback(session);
  });

  return () => {
    console.log('[Supabase Auth] Unsubscribing from auth state changes');
    subscription.unsubscribe();
  };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const session = await getSession();
    return !!session;
  } catch (error) {
    return false;
  }
};

/**
 * Get user profile from database
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle(); // Use maybeSingle instead of single to handle no results gracefully

  if (error) {
    console.error('[Supabase Auth] Get profile error:', error);
    throw error;
  }

  if (!data) {
    console.error('[Supabase Auth] Profile not found for user:', userId);
    throw new Error('Profile not found. Please contact support or try signing up again.');
  }

  return data;
};
