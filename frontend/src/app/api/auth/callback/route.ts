import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * SECURE Password Reset Callback Handler
 * 
 * This route handles the password reset callback from Supabase.
 * It exchanges the tokens from the URL for a secure session,
 * then redirects to the reset password page WITHOUT any tokens in the URL.
 * 
 * Security measures:
 * 1. Tokens are processed server-side only
 * 2. No tokens are ever sent to the client in URL
 * 3. Session is established via secure cookies
 * 4. Redirect URL contains no sensitive data
 * 5. One-time use tokens are immediately consumed
 * 
 * Flow:
 * 1. User clicks reset link in email -> Supabase redirects here with code
 * 2. Server exchanges code for session (PKCE flow)
 * 3. Server sets secure session cookies
 * 4. Server redirects to /reset-password with NO tokens
 * 5. Client reads session from cookies and shows password form
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  console.log('[Auth Callback] Processing password reset callback');

  // Handle OAuth errors
  if (error) {
    console.error('[Auth Callback] OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${requestUrl.origin}/reset-password?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  // Exchange the code for a session
  if (code) {
    try {
      // Create server-side Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        }
      );

      // Exchange the authorization code for a session
      // This is the PKCE flow - the code is single-use and secure
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('[Auth Callback] Code exchange error:', exchangeError);
        return NextResponse.redirect(
          `${requestUrl.origin}/reset-password?error=${encodeURIComponent(exchangeError.message)}`
        );
      }

      if (data.session) {
        console.log('[Auth Callback] Session established successfully for user:', data.session.user.id);
        
        // Create response with redirect
        const response = NextResponse.redirect(`${requestUrl.origin}/reset-password?verified=true`);
        
        // Set secure session cookies
        // These are HTTP-only and secure, preventing XSS attacks
        response.cookies.set('sb-access-token', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: data.session.expires_in,
          path: '/',
        });
        
        response.cookies.set('sb-refresh-token', data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        
        return response;
      }
    } catch (err) {
      console.error('[Auth Callback] Unexpected error:', err);
      return NextResponse.redirect(
        `${requestUrl.origin}/reset-password?error=${encodeURIComponent('An unexpected error occurred')}`
      );
    }
  }

  // No code provided - invalid request
  console.warn('[Auth Callback] No code provided in callback');
  return NextResponse.redirect(`${requestUrl.origin}/reset-password?error=Invalid request`);
}
