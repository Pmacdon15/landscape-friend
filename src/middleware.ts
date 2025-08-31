import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/lists(.*)', '/(email)(.*)', '/(settings)(.*)', '/billing(.*)'])
const isAdminRoute = createRouteMatcher(['/invoices(.*)', '/quotes(.*)'])

export default clerkMiddleware(async (auth, req) => {
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
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes, except for webhooks
    '/(api(?!/webhooks)|trpc)(.*)',
  ],
}
