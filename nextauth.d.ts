import { UserModel } from '@/common/models'
import 'next-auth'

declare module 'next-auth' {
	export interface User {
		expires: number
		accessToken: string
		user: UserModel
	}

	export interface Session {
		token: string
		expires: string
		user: User
	}
}
