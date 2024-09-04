import { CreateCompanyProfileModel } from './create-company-profile.model'
import { CreatePersonalProfileModel } from './create-personal-profile.model'
import { CreateUserModel } from './create-user.model'

export interface CreateUserWithProfileModel {
	user: CreateUserModel
	personalProfile?: CreatePersonalProfileModel | null
	companyProfile?: CreateCompanyProfileModel | null
}
