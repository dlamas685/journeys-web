import { NextRequest, NextResponse } from 'next/server'
import { Pathnames, UserTypes } from './common/enums'
import { UserModel } from './common/models'

const publicPaths = [
	`/${Pathnames.LOGIN}`,
	`/${Pathnames.SIGN_UP}`,
	`/${Pathnames.PASSWORD_RESET_REQUEST}`,
	`/${Pathnames.PASSWORD_RESETS}`,
	`/${Pathnames.EMAIL_VERIFICATION}`,
	`/${Pathnames.PROVIDERS}`,
	`/${Pathnames.ERROR}`,
]

export const middleware = async ({ cookies, nextUrl }: NextRequest) => {
	const token = cookies.get('session.token')?.value
	const user = JSON.parse(
		cookies.get('session.user')?.value || '{}'
	) as UserModel
	const pathname = nextUrl.pathname
	const isLoggedIn = Boolean(token)
	const isOnLogin = pathname.startsWith(`/${Pathnames.LOGIN}`)
	const isFirstSteps = pathname.startsWith(`/${Pathnames.FIRST_STEPS}`)
	const isPublic = publicPaths.includes(pathname)
	const defaultPath =
		user.userType && user.userType === UserTypes.PERSONAL
			? Pathnames.HOME
			: Pathnames.DASHBOARD

	if (isLoggedIn) {
		if (!user.userType && !isFirstSteps) {
			return NextResponse.redirect(
				new URL(`/${Pathnames.FIRST_STEPS}`, nextUrl)
			)
		}

		if (user.userType && isFirstSteps) {
			return NextResponse.redirect(
				new URL(`/${user.userType.toLowerCase()}/${defaultPath}`, nextUrl)
			)
		}

		if (isOnLogin && user.userType) {
			return NextResponse.redirect(
				new URL(`/${user.userType.toLowerCase()}/${defaultPath}`, nextUrl)
			)
		}

		if (
			user.userType &&
			!pathname.includes(`/${user.userType.toLowerCase()}`)
		) {
			return NextResponse.redirect(
				new URL(`/${user.userType.toLowerCase()}/${defaultPath}`, nextUrl)
			)
		}

		return NextResponse.next()
	}

	if (!isPublic) {
		return NextResponse.redirect(new URL(`/${Pathnames.LOGIN}`, nextUrl))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\..*$).*)'],
}
