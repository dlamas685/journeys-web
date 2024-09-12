import { CreateUserModel } from './create-user.model'
import { UpdateCompanyProfileModel } from './update-company-profile.model'
import { UpdatePersonalProfileModel } from './update-personal-profile.model'

export interface UpdateUserModel
	extends Partial<Omit<CreateUserModel, 'companyProfile' | 'personalProfile'>> {
	companyProfile?: UpdateCompanyProfileModel
	personalProfile?: UpdatePersonalProfileModel
}
