import { type CreateCompanyProfileModel } from './create-company-profile.model'
import { type CreatePersonalProfileModel } from './create-personal-profile.model'
import { type CreateUserModel } from './create-user.model'

export interface CreateUserWithProfileModel {
	user: CreateUserModel
	personalProfile?: CreatePersonalProfileModel | null
	companyProfile?: CreateCompanyProfileModel | null
}
