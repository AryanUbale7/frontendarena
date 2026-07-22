import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

async function getExpectedHmac(secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode('admin_authenticated')
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Protected routes logic
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup') || request.nextUrl.pathname.startsWith('/forgot-password')
  const isPortalRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/submission') || request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/update-password')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginRoute = request.nextUrl.pathname.startsWith('/admin/login')

  // 1. Admin Routes protection (using custom hardcoded auth cookie) - Bypass Supabase calls entirely
  if (isAdminRoute && !isAdminLoginRoute) {
    const adminAuthCookie = request.cookies.get('admin_auth')
    const expectedHmac = await getExpectedHmac(process.env.ADMIN_PASSKEY || 'fallback-secret')
    if (!adminAuthCookie || adminAuthCookie.value !== expectedHmac) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // 2. Admin Login page redirection - Bypass Supabase calls entirely
  if (isAdminLoginRoute) {
    const adminAuthCookie = request.cookies.get('admin_auth')
    const expectedHmac = await getExpectedHmac(process.env.ADMIN_PASSKEY || 'fallback-secret')
    if (adminAuthCookie && adminAuthCookie.value === expectedHmac) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // 3. Public marketing routes - Bypass session check completely
  if (!isPortalRoute && !isAuthRoute) {
    return supabaseResponse
  }

  // 4. Initialize Supabase only for routes requiring auth checks (portal or authentication pages)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Portal Routes protection
  if (!user && isPortalRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user IS logged in and tries to access auth routes, redirect to dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
