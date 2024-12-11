import { type CreatePersonalProfileModel } from './create-personal-profile.model'

export interface UpdatePersonalProfileModel
	extends Partial<CreatePersonalProfileModel> {
	dni?: string
	firstName?: string
	lastName?: string
	phone?: string
	address?: string
	birthDate?: string
}
