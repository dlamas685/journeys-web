export const parseParam = (param: string) => {
	const value = parseInt(param, 10)
	return isNaN(value) ? undefined : value
}
