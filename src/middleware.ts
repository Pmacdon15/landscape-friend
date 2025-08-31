import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/lists(.*)', '/(email)(.*)', '/(settings)(.*)', '/billing(.*)'])
const isAdminRoute = createRouteMatcher(['/invoices(.*)', '/quotes(.*)'])

export default clerkMiddleware(async (auth, req) => {
  console.log("middleware Start")
  const { userId, orgId, sessionClaims } = await auth()
  // console.log("Admin?: ", sessionClaims?.orgRole)

  if (isProtectedRoute(req) && !userId) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    console.log("Calling redirect from middleware")
    return NextResponse.redirect(url)
  }

  if (isAdminRoute(req) && sessionClaims?.orgRole !== 'org:admin' && orgId) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    console.log("Calling redirect from middleware")
    return NextResponse.redirect(url)
  }
  
  console.log("middleware End")
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/webhooks (webhook routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)',
  ],
}
