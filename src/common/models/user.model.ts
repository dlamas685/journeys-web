import { UserTypes } from '../enums/user-types.enum'
import { CompanyProfile } from './company-profile.model'
import { PersonalProfile } from './personal-profile.model'

export interface UserModel {
	id: string
	email: string
	emailVerified: Date
	imageUrl: string
	userType: UserTypes
	createdAt: Date
	updatedAt: Date
	companyProfile: CompanyProfile | null
	personalProfile: PersonalProfile | null
}
