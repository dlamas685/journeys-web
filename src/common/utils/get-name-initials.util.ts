export const getNameInitials = (name: string): string => {
	const [first, ...rest] = name.split(' ')

	const last = rest.pop()

	return `${first.at(0)}${last ? last.at(0) : first.at(first.length - 1)}`.toUpperCase()
}
