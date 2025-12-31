import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for the session token in cookies
  const sessionToken = request.cookies.get('session_token')

  // Log for debugging (server-side)
  // console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Token: ${sessionToken ? 'Present' : 'Missing'}`)

  if (!sessionToken) {
    // Redirect to login if no token is found
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow request to proceed if authenticated
  return NextResponse.next()
}

// Ensure middleware only runs on specific paths
export const config = {
  matcher: '/payment/:path*',
}
