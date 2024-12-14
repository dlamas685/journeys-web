export const PASSWORD_REGEX: RegExp =
	/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

export const LICENSE_PLATE_PATTERN: RegExp =
	/^[A-Z]{3} ?\d{3}$|^[A-Z]{2} ?\d{3} ?[A-Z]{2}$/

export const VIN_PATTERN: RegExp = /^[A-HJ-NPR-Z0-9]{17}$/

export const LICENSE_NUMBER: RegExp = /^\d{7,8}$/
