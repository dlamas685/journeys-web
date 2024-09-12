import { CreateCompanyProfileModel } from './create-company-profile.model'

export interface UpdateCompanyProfileModel
	extends Partial<CreateCompanyProfileModel> {
	managerEmail?: string
	managerPhone?: string
	phone?: string
	taxAddress?: string
}
