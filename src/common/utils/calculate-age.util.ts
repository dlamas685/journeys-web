export const calculateAge = (birthDate: string) => {
	const today = new Date()
	const birth = new Date(birthDate)
	const years = today.getFullYear() - birth.getFullYear()
	const months = today.getMonth() - birth.getMonth()
	const days = today.getDate() - birth.getDate()

	if (months < 0 || (months === 0 && days < 0)) {
		return years - 1
	}

	return years
}
