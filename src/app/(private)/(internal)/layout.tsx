import { findAll } from '@/common/actions/crud.action'
import { getServerUser } from '@/common/actions/session.action'
import {
	ApiEndpoints,
	Pathnames,
	SortDirections,
	UserTypes,
} from '@/common/enums'
import { NotificationModel, QueryParamsModel } from '@/common/models'
import {
	Car,
	CarFront,
	CarTaxiFront,
	Home,
	Layers,
	LayoutDashboard,
	MapPinHouse,
	MapPinned,
	NotepadTextDashed,
	Route,
	UsersRound,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { v4 as uuid } from 'uuid'
import Navbar from './_components/layout/navbar'
import Notifications from './_components/layout/notifications'
import Profile from './_components/layout/profile'
import SearchBox from './_components/layout/search-box'
import Sidebar from './_components/layout/sidebar'
import { MenuItem } from './_types/menu-item.type'

type Props = {
	children: ReactNode
}

export default async function InternalLayout({ children }: Readonly<Props>) {
	const user = await getServerUser()

	if (!user) notFound()

	const pathRoot = user.userType?.toLowerCase()

	const items: MenuItem[] = [
		{
			id: uuid(),
			icon: <Home />,
			label: 'Inicio',
			href: `/${pathRoot}/${Pathnames.HOME}`,
			userType: UserTypes.PERSONAL,
		},
		{
			id: uuid(),
			icon: <LayoutDashboard />,
			label: 'Panel de Control',
			href: `/${pathRoot}/${Pathnames.DASHBOARD}`,
			userType: UserTypes.COMPANY,
		},

		{
			id: uuid(),
			icon: <CarTaxiFront />,
			label: 'Viajes',
			href: `/${pathRoot}/${Pathnames.TRIPS}`,
			userType: UserTypes.PERSONAL,
		},
		{
			id: uuid(),
			icon: <Layers />,
			label: 'Hojas de Ruta',
			href: `/${pathRoot}/${Pathnames.ROADMAPS}`,
			userType: UserTypes.COMPANY,
		},
		{
			id: uuid(),
			icon: <Route />,
			label: 'Optimización',
			href: `/${pathRoot}/${Pathnames.OPTIMIZATION}`,
		},

		{
			id: uuid(),
			icon: <MapPinHouse />,
			label: 'Lugares Favoritos',
			href: `/${pathRoot}/${Pathnames.FAVORITE_PLACES}`,
			userType: UserTypes.PERSONAL,
		},
		{
			id: uuid(),
			icon: <MapPinned />,
			label: 'Direcciones Favoritas',
			href: `/${pathRoot}/${Pathnames.FAVORITE_ADDRESSES}`,
			userType: UserTypes.PERSONAL,
		},

		{
			id: uuid(),
			icon: <CarFront />,
			label: 'Flotas',
			href: `/${pathRoot}/${Pathnames.FLEETS}`,
			userType: UserTypes.COMPANY,
		},

		{
			id: uuid(),
			icon: <UsersRound />,
			label: 'Conductores',
			href: `/${pathRoot}/${Pathnames.DRIVERS}`,
			userType: UserTypes.COMPANY,
		},
		{
			id: uuid(),
			icon: <Car />,
			label: 'Vehículos',
			href: `/${pathRoot}/${Pathnames.VEHICLES}`,
			userType: UserTypes.COMPANY,
		},

		{
			id: uuid(),
			icon: <NotepadTextDashed />,
			label: 'Plantillas de Actividades',
			href: `/${pathRoot}/${Pathnames.ACTIVITY_TEMPLATES}`,
		},
	]

	const userItems = items.filter(
		item => item.userType === user.userType || !item.userType
	)

	const queryParams: QueryParamsModel = {
		sorts: [{ field: 'createdAt', direction: SortDirections.DESC }],
	}

	const fallbackUrl =
		user.userType === 'COMPANY' ? Pathnames.DASHBOARD : Pathnames.HOME

	const notifications = await findAll<NotificationModel>(
		ApiEndpoints.NOTIFICATIONS,
		queryParams,
		fallbackUrl
	).then(resp => resp.data)

	return (
		<section className='mx-auto flex min-h-dvh w-full flex-col md:max-w-7xl'>
			<header className='grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b p-4 sm:grid-cols-[auto_1fr_repeat(2,auto)] sm:p-6'>
				<Link href='/' className='hidden items-center gap-3 sm:flex'>
					<Image
						src='/brand/isotype-v1.png'
						alt='Journeys'
						width={250}
						height={250}
						className='size-11'
					/>
					<Image
						src='/brand/journeys-app-6-logotype-v1.png'
						alt='Logotipo'
						width={250}
						height={250}
						className='mt-2 hidden h-7 w-32 md:block'
					/>
				</Link>
				<SearchBox
					className='col-start-2 col-end-3 justify-self-center sm:col-auto'
					user={user}
				/>
				<Notifications
					recipientId={user.id}
					data={notifications}
					className='col-start-1 col-end-2 row-start-1 row-end-2 sm:col-auto sm:row-auto'
				/>
				<Profile user={user} />
			</header>
			<main className='relative mx-auto flex w-full max-w-4xl flex-grow flex-col gap-0 p-4 sm:static sm:gap-8 sm:p-8 md:p-10'>
				<Navbar items={userItems} />
				<Sidebar items={userItems} />
				{children}
			</main>
		</section>
	)
}
