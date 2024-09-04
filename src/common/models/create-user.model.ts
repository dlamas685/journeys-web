import { UserTypes } from '../enums'
import { CreateCompanyProfileModel } from './create-company-profile.model'
import { CreatePersonalProfileModel } from './create-personal-profile.model'

export interface CreateUserModel {
	email: string
	password: string
	userType: UserTypes
	companyProfile?: CreateCompanyProfileModel | null
	personalProfile?: CreatePersonalProfileModel | null
}
