import { NextRequest, NextResponse } from 'next/server'
import { Pathnames } from './common/enums'
import { UserModel } from './common/models'

const publicPaths = [
	`/${Pathnames.LOGIN}`,
	`/${Pathnames.SIGN_UP}`,
	`/${Pathnames.PROVIDERS}`,
	`/${Pathnames.PASSWORD_RESET_REQUEST}`,
	`/${Pathnames.PASSWORD_RESETS}`,
	`/${Pathnames.EMAIL_VERIFICATION}`,
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

	if (isLoggedIn) {
		if (!isFirstSteps && !user.userType) {
			return NextResponse.redirect(
				new URL(`/${Pathnames.FIRST_STEPS}`, nextUrl)
			)
		}

		if (isFirstSteps && user.userType) {
			return NextResponse.redirect(new URL(`/${Pathnames.HOME}`, nextUrl))
		}

		if (isOnLogin) {
			// Si está logueado y está en la página de login, redirige a la página de inicio
			return NextResponse.redirect(new URL(`/${Pathnames.HOME}`, nextUrl))
		}
		// Si está logueado y la ruta es privada, permite el acceso
		return NextResponse.next()
	}

	// Si no está logueado y la ruta no es pública, redirige al login
	if (!isPublic) {
		return NextResponse.redirect(new URL(`/${Pathnames.LOGIN}`, nextUrl))
	}

	// Permitir el acceso a rutas públicas o login si no está logueado
	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\..*$).*)'],
}
