import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token')

  // Block access to protected routes if no session cookie
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Only protect dashboard (authenticated users only)
// Payment is NOT protected here - it handles its own auth logic
export const config = {
  matcher: '/dashboard/:path*',
}
