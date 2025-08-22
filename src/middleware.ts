import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/lists(.*)', '/(email)(.*)', '/(settings)(.*)', '/billing(.*)'])
const isAdminRoute = createRouteMatcher(['/invoices(.*)'])
//TODO: finish this routes
export default clerkMiddleware(async (auth, req) => {
  // const clerk = await clerkClient()
  const { userId, orgId, sessionClaims } = await auth()
  // console.log("Admin?: ", sessionClaims?.orgRole)

  if (isProtectedRoute(req) && !userId) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (isAdminRoute(req) && sessionClaims?.orgRole !== 'org:admin' && orgId) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

})
export const config = {
  matcher: [
    '/((?!_next|static|favicon.ico).*)',
  ],
}