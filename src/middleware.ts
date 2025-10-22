import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/billing(.*)', '/settings(.*)'])

export default clerkMiddleware(async (auth, req) => {
	if (isAdminRoute(req)) {
		const { orgId, sessionClaims } = await auth()
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
	protectedRoutes: ['lists', 'email', 'settings', 'billing'],
}
