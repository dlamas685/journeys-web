import { UserTypes } from '../enums/user-types.enum'
import { type CompanyProfileModel } from './company-profile.model'
import { type PersonalProfileModel } from './personal-profile.model'

export interface UserModel {
	id: string
	email: string
	emailVerified?: Date | null
	imageUrl?: string | null
	userType?: UserTypes | null
	createdAt: Date
	updatedAt: Date
	companyProfile?: CompanyProfileModel | null
	personalProfile?: PersonalProfileModel | null
}
