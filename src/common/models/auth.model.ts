import { UserModel } from './user.model'

export interface AuthModel {
	accessToken: string
	expires: number
	user: UserModel
}
