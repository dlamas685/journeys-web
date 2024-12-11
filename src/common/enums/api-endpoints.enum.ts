export enum ApiEndpoints {
	LOGIN = 'auth/login',
	SIGN_UP = 'auth/sign-up',
	GOOGLE_LOGIN = 'auth/google/login',
	ACCESS_TOKEN_VALIDATION = 'auth/access-token-validation',
	PASSWORD_RESET_REQUEST = 'auth/password-reset-request',
	PASSWORD_RESETS = 'auth/password-resets',
	EMAIL_VERIFICATION = 'auth/email-verification',

	LINK_VALIDATION = 'verification-tokens/link-validation',

	USERS = 'users',

	FILES_PROFILES = 'files/profile',
	FILES_VEHICLES = 'files/vehicles',
	FILES_DRIVERS = 'files/drivers',

	OPTIONS = 'options',
	OPTIONS_PROFILE = 'options/profile',
	OPTIONS_SECURITY = 'options/security',
	OPTIONS_SECURITY_PASSWORD_EXISTS = 'options/security/password-exists',

	FAVORITE_ADDRESSES = 'favorite-addresses',
	FAVORITE_PLACES = 'favorite-places',

	FLEETS = 'fleets',
	VEHICLES = 'vehicles',
	DRIVERS = 'drivers',
}
