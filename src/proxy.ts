import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher([
	'/billing(.*)',
	'/settings(.*)',
	'/lists/client(.*)',
	'/email(.*)',
])
const isProtectedRoute = createRouteMatcher([
	'/lists(.*)',
	// '/settings(.*)',
	// '/billing(.*)',
])
export const proxy = clerkMiddleware(async (auth, req) => {
	if (isProtectedRoute(req)) {
		await auth.protect()
	}
	if (isAdminRoute(req)) {
		const { sessionClaims, orgId } = await auth.protect()

		if (sessionClaims?.orgRole !== 'org:admin' && orgId) {
			const url = req.nextUrl.clone()
			url.pathname = '/'
			return NextResponse.redirect(url)
		}
	}
})

export const config = {
	matcher: [
		'/((?!api/webhooks|_next/static|_next/image|favicon.ico).*)',
		'/(lists|email|settings|billing)(.*)',
	],
}
