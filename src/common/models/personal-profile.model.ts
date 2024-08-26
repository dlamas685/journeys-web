export interface PersonalProfile {
	id: string
	userId: string
	firstName: string
	lastName: string
	dni: string | null
	phone: string | null
	address: string | null
	birthDate: Date | null
}
