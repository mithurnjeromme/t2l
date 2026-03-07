import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware
 *
 * Protections applied:
 * 1. Block .vercel.app preview/deployment URLs — redirect to canonical domain
 * 2. Block raw IP address access — return 404
 * 3. Clear sensitive tokens from URLs (token-leak prevention)
 * 4. Add security headers to all responses
 */

const CANONICAL_DOMAIN = 'turn2law.tech';
const CANONICAL_ORIGIN = 'https://turn2law.tech';

// Vercel's known shared Anycast IP ranges (these won't have your hostname)
// We detect "raw IP" access by checking if the host header looks like an IP address.
const IP_HOST_REGEX = /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/;

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') ?? '';
  const xForwardedHost = request.headers.get('x-forwarded-host') ?? '';
  const effectiveHost = xForwardedHost || host;

  // ── 1. Block raw IP address access ──────────────────────────────────────
  // When someone pastes the IP directly, the browser sends Host: <ip-address>.
  // Vercel processes this before our code in most cases, but on the rare path
  // it reaches middleware, we return a hard 404.
  if (IP_HOST_REGEX.test(effectiveHost)) {
    return new NextResponse(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>404 Not Found</title>
       <meta name="viewport" content="width=device-width,initial-scale=1">
       <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;
       display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0a0a0a;color:#fff}
       .wrap{text-align:center;padding:2rem}.code{font-size:6rem;font-weight:900;opacity:.15;line-height:1}
       h1{font-size:1.5rem;margin:.5rem 0}p{color:#888;margin-bottom:1.5rem}
       a{color:#c9a84c;text-decoration:none;border-bottom:1px solid #c9a84c44;padding-bottom:2px}
       </style></head><body><div class="wrap">
       <div class="code">404</div>
       <h1>Page Not Found</h1>
       <p>Please visit us at our domain.</p>
       <a href="${CANONICAL_ORIGIN}">${CANONICAL_DOMAIN}</a>
       </div></body></html>`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  // ── 2. Block .vercel.app deployment/preview URLs ─────────────────────────
  // Redirects anyone hitting the raw *.vercel.app URL to the canonical domain.
  // This prevents SEO duplication and brand confusion.
  if (
    effectiveHost.endsWith('.vercel.app') &&
    !effectiveHost.includes(CANONICAL_DOMAIN)
  ) {
    const destination = `${CANONICAL_ORIGIN}${url.pathname}${url.search}`;
    return NextResponse.redirect(destination, {
      status: 308, // Permanent redirect
      headers: {
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      },
    });
  }

  // ── 3. Block tokens in URL (security) ────────────────────────────────────
  const hasTokenInUrl =
    url.hash.includes('access_token') ||
    url.hash.includes('refresh_token') ||
    url.searchParams.has('access_token') ||
    url.searchParams.has('refresh_token');

  if (hasTokenInUrl && !url.pathname.startsWith('/api/auth/callback')) {
    console.warn('[Middleware] ⚠️ SECURITY: Blocked request with tokens in URL:', url.pathname);
    const cleanUrl = new URL(url.pathname, url.origin);
    return NextResponse.redirect(cleanUrl);
  }

  // ── 4. Security headers ───────────────────────────────────────────────────
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-Robots-Tag', 'index, follow'); // canonical requests are fine

  if (process.env.NODE_ENV === 'production') {
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://turn2law-backend-p3r6.onrender.com';
    const lawgptApiUrl  = process.env.NEXT_PUBLIC_LAWGPT_API_URL || 'https://turn2law-lawgpt-zzj3.onrender.com';

    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        `connect-src 'self' https://*.supabase.co ${backendApiUrl} ${lawgptApiUrl}`,
        "frame-ancestors 'none'",
      ].join('; ')
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
