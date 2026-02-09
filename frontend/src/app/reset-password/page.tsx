"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ValidatedInput } from '@/components/ui/validated-input';
import { updatePassword, resetPasswordRequest } from '@/lib/supabase-auth';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [validationState, setValidationState] = useState({
    password: false,
    confirmPassword: false,
  });

  // Secure token handling - check session instead of URL params
  useEffect(() => {
    const checkResetSession = async () => {
      if (typeof window === 'undefined') return;

      try {
        const { supabase } = await import('@/lib/supabase');
        
        // Check if user has an active session (from reset link)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session) {
          console.log('[Reset Password] Valid reset session detected');
          setIsUpdate(true);
          setTokenValid(true);
          
          // Clear URL parameters to prevent token leakage in browser history
          // Use replaceState to avoid adding to history
          if (window.location.search) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } else {
          // Check URL params only for the secure flag
          const params = new URLSearchParams(window.location.search);
          const isSecureFlow = params.get('secure') === 'true';
          
          if (isSecureFlow) {
            // Supabase should have set the session automatically
            // If not, the token might be expired or invalid
            setError('Reset link expired or invalid. Please request a new one.');
          }
          
          setIsUpdate(false);
        }
      } catch (err) {
        console.error('[Reset Password] Session check error:', err);
        setError('Unable to verify reset link. Please try again.');
      }
    };

    checkResetSession();
    
    // Listen for auth state changes (when user clicks the email link)
    const { supabase } = require('@/lib/supabase');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'PASSWORD_RECOVERY') {
        console.log('[Reset Password] Password recovery event detected');
        setIsUpdate(true);
        setTokenValid(true);
        setError('');
        
        // Clear URL to prevent token exposure
        if (window.location.search) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleValidatedInputChange = (field: string, value: string, isValid: boolean) => {
    if (field === 'password') {
      setNewPassword(value);
      setValidationState(prev => ({ ...prev, password: isValid }));
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
      // Validate that it matches the password
      const matches = value === newPassword;
      setValidationState(prev => ({ ...prev, confirmPassword: isValid && matches }));
      if (value && !matches) {
        setError('Passwords do not match');
      } else {
        setError('');
      }
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Check if user signed up with Google (OAuth)
      const { supabase } = await import('@/lib/supabase');
      const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();
      
      if (!searchError && users) {
        const user = users.find(u => u.email === email);
        if (user) {
          // Check if user signed up with Google
          const isGoogleUser = user.app_metadata.provider === 'google' || 
                               user.identities?.some(id => id.provider === 'google');
          
          if (isGoogleUser) {
            setError('This account was created using Google Sign-in. Please use "Sign in with Google" button on the login page to access your account. No password is needed.');
            setIsLoading(false);
            return;
          }
        }
      }
      
      await resetPasswordRequest(email);
      setEmailSent(true);
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setError(error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate both fields
    if (!validationState.password) {
      setError('Please enter a valid password that meets all requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!tokenValid) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }

    try {
      setIsLoading(true);
      await updatePassword(newPassword);
      
      // Clear password from memory
      setNewPassword('');
      setConfirmPassword('');
      
      setPasswordChanged(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Password update error:', error);
      setError(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  if (passwordChanged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Password Changed!</h2>
          <p className="text-muted-foreground">
            Your password has been successfully updated.
            <br />
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
            <p className="text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <p className="text-sm text-muted-foreground">
                Click the link in the email to reset your password.
                The link will expire in 1 hour.
              </p>
            </div>
            <Button onClick={() => setEmailSent(false)} variant="outline" className="w-full">
              Try Different Email
            </Button>
            <Link href="/login" className="block text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <svg
            width="48"
            height="60"
            viewBox="0 0 62 79"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M46.3782 0L30.7564 16.3146L36.1293 21.5024L42.6514 14.691V53.3941L6.77247 17.715C4.26262 15.2191 0 17.0044 0 20.5514V79H7.45364V28.9262L43.3326 64.6053C45.8423 67.1011 50.105 65.316 50.105 61.7689V14.691L56.6272 21.5024L62 16.3146L46.3782 0Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              {isUpdate ? 'Set New Password' : 'Reset Password'}
            </h1>
            <p className="text-muted-foreground">
              {isUpdate 
                ? 'Enter your new password below'
                : 'Enter your email to receive a reset link'
              }
            </p>
          </div>

          {isUpdate ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              {!tokenValid && (
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 text-sm">
                  ⚠️ Verifying reset link... If this persists, please request a new reset link.
                </div>
              )}

              <ValidatedInput
                type="password"
                value={newPassword}
                onValueChange={(value, isValid) => handleValidatedInputChange('password', value, isValid)}
                validationType="password"
                showPasswordStrength={true}
                placeholder="Enter new strong password"
                label="New Password"
                required
                disabled={!tokenValid}
              />

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <ValidatedInput
                  type="password"
                  value={confirmPassword}
                  onValueChange={(value, isValid) => handleValidatedInputChange('confirmPassword', value, isValid)}
                  validationType="password"
                  placeholder="Confirm your new password"
                  required
                  disabled={!tokenValid}
                  className={confirmPassword && newPassword !== confirmPassword ? 'border-red-500' : ''}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !tokenValid || !validationState.password || newPassword !== confirmPassword}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          ) : (
            <>
              {/* Notice for Google users */}
              <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-foreground">
                    <p className="font-medium mb-1">Signed up with Google?</p>
                    <p className="text-muted-foreground">
                      If you created your account using <strong>Sign in with Google</strong>, you don't need a password. 
                      Simply click "Sign in with Google" on the login page to access your account.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRequestReset} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <ValidatedInput
                  type="email"
                  value={email}
                  onValueChange={(value, isValid) => {
                    setEmail(value);
                    setValidationState(prev => ({ ...prev, email: isValid }));
                  }}
                  validationType="email"
                  placeholder="your.email@example.com"
                  label="Email Address"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Only for accounts created with email and password
                </p>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </>
          )}

          <div className="text-center">
            <Link href="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
