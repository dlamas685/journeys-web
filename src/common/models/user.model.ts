import { UserTypes } from '../enums/user-types.enum'
import { CompanyProfileModel } from './company-profile.model'
import { PersonalProfileModel } from './personal-profile.model'

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
