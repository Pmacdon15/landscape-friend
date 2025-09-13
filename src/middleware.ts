import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/lists(.*)', '/(email)(.*)', '/(settings)(.*)'])
const isAdminRoute = createRouteMatcher(['/billing(.*)'])

export default clerkMiddleware(async (auth, req) => {

  const { userId, orgId, sessionClaims } = await auth()

 
  if (isAdminRoute(req) && sessionClaims?.orgRole !== 'org:admin' && orgId) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: [
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)',
    '/(lists|email|settings|billing)(.*)',
  ],
}
