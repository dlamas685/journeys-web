import type { NextAuthConfig, User } from 'next-auth'
import { Pathnames } from './common/enums'

export const authConfig: NextAuthConfig = {
	pages: {
		signIn: '/login',
		signOut: '/login',
		error: '/error',
		newUser: '/signup',
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const pathname = nextUrl.pathname
			const isLoggedIn = !!auth?.user
			const isOnHome = pathname.startsWith(`/${Pathnames.HOME}`)

			if (!isLoggedIn) return false

			if (isOnHome) return true

			return Response.redirect(new URL(`/${Pathnames.HOME}`, nextUrl))
		},

		jwt({ token, user }) {
			if (user) {
				token.data = user
			}
			return token
		},

		session({ session, token }) {
			const auth = token.data as User
			session.user = auth.user as any
			session.token = auth.accessToken
			session.expires = new Date(auth.expires * 1000).toISOString() as any

			return session
		},
	},
	providers: [],
}
