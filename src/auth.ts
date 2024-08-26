import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { logIn } from './common/actions/auth.action'
import { credentialsSchema } from './common/schemas'

export const { auth, signIn, signOut, handlers } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = credentialsSchema.safeParse(credentials)

				if (!parsedCredentials.success) return null

				const user = await logIn(parsedCredentials.data)

				if (!user) return null

				return user
			},
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
				rememberMe: { label: 'Remember me', type: 'checkbox' },
			},
		}),
	],
})
