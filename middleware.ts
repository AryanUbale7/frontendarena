import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/submission/:path*',
    '/profile/:path*',
    '/update-password',
    '/login',
    '/signup',
    '/forgot-password',
    '/api/:path*',
  ],
}
