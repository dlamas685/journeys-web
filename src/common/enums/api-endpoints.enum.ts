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

	OPTIONS = 'options',
	OPTIONS_PROFILE = 'options/profile',
	OPTIONS_SECURITY = 'options/security',
	OPTIONS_SECURITY_PASSWORD_EXISTS = 'options/security/password-exists',

	FAVORITE_ADDRESSES = 'favorite-addresses',
}
