import { UserTypes } from '../enums/user-types.enum'

export const USER_TYPES = Object.keys(UserTypes).filter(key =>
	isNaN(Number(key))
) as [keyof typeof UserTypes]
