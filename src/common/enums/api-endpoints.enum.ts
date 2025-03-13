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

	VEHICLE_RELATIONS = 'vehicle-relations',
	VEHICLES = 'vehicles',

	DRIVER_RELATIONS = 'driver-relations',
	DRIVERS = 'drivers',

	ACTIVITY_TEMPLATES = 'activity-templates',
	ACTIVITIES = 'activities',

	OPTIMIZATION_BASIC = 'optimization/basic',

	OPTIMIZATION_ADVANCED = 'optimization/advanced',

	OPTIMIZATION_TOURS = 'optimization/tours',

	COST_PROFILES = 'optimization/cost-profiles',

	AVAILABLE_ROADMAP_ASSETS = 'available-roadmap-assets',

	TRIPS = 'trips',

	TRIPS_REPLICATE = 'trips/replicate',

	ROADMAPS = 'roadmaps',

	ROADMAP_STATUS = 'roadmaps/status',

	ASSISTANT_SESSION = 'assistant/session',

	NOTIFICATIONS = 'notifications',

	NOTIFICATIONS_READ = 'notifications/read',

	STATS = 'stats',

	STATS_BY_MONTH = 'stats/by-month',

	STATS_COMPANY = 'stats/company',

	STATS_COMPANY_BY_MONTH = 'stats/company/by-month',

	STATS_COMPANY_TOP_DRIVERS = 'stats/company/top-drivers',
}
