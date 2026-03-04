import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from './lib/auth'

const publicRoutes = ['/', '/login', '/register']
// Routes that should not be accessible when authenticated (e.g., login, register)
const unauthenticatedRoutes = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticatedUser = await isAuthenticated()

  const unauthenticatedRoute = unauthenticatedRoutes.includes(pathname)
  if (unauthenticatedRoute && isAuthenticatedUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const isPublicRoute = publicRoutes.includes(pathname)
  if (isPublicRoute) {
    return NextResponse.next()
  }

  if (!isAuthenticatedUser) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!admin|api|_next/static|_next/image|.*\\.png$|.*\\.ico$|.*\\.svg$).*)'],
}
