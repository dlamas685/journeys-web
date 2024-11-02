export interface CompanyProfileModel {
	id: string
	userId: string
	name: string
	cuit: string
	phone?: string
	taxAddress?: string
	manager: string
	managerPhone?: string
	managerEmail?: string
}
