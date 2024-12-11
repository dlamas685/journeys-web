import { type CreateUserModel } from './create-user.model'
import { type UpdateCompanyProfileModel } from './update-company-profile.model'
import { type UpdatePersonalProfileModel } from './update-personal-profile.model'

export interface UpdateUserModel
	extends Partial<Omit<CreateUserModel, 'companyProfile' | 'personalProfile'>> {
	companyProfile?: UpdateCompanyProfileModel
	personalProfile?: UpdatePersonalProfileModel
}
