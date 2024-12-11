import { UserTypes } from '../enums'
import { type CreateCompanyProfileModel } from './create-company-profile.model'
import { type CreatePersonalProfileModel } from './create-personal-profile.model'

export interface CreateUserModel {
	email: string
	password: string
	userType: UserTypes
	companyProfile?: CreateCompanyProfileModel
	personalProfile?: CreatePersonalProfileModel
}
