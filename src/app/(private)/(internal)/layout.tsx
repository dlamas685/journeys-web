import { getServerUser } from '@/common/actions/session.action'
import { Pathnames, UserTypes } from '@/common/enums'
import {
	Bookmark,
	Car,
	CarFront,
	CarTaxiFront,
	HomeIcon,
	ListTodo,
	MapPinHouse,
	Newspaper,
	Route,
	UsersRound,
} from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { v4 as uuid } from 'uuid'
import Navbar from './_components/layout/navbar'
import Notifications from './_components/layout/notifications'
import Profile from './_components/layout/profile'
import SearchBox from './_components/layout/search-box'
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
			icon: <HomeIcon />,
			label: 'Inicio',
			href: `/${pathRoot}/${Pathnames.HOME}`,
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
			icon: <Bookmark />,
			label: 'Direcciones Favoritas',
			href: `/${pathRoot}/${Pathnames.FAVORITE_ADDRESSES}`,
			userType: UserTypes.PERSONAL,
		},

		{
			id: uuid(),
			icon: <ListTodo />,
			label: 'Plantillas de Tareas',
			href: `/${pathRoot}/${Pathnames.TASK_TEMPLATES}`,
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
			icon: <Car />,
			label: 'Vehículos',
			href: `/${pathRoot}/${Pathnames.VEHICLES}`,
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
			icon: <CarTaxiFront />,
			label: 'Viajes',
			href: `/${pathRoot}/${Pathnames.TRIPS}`,
			userType: UserTypes.PERSONAL,
		},
		{
			id: uuid(),
			icon: <Route />,
			label: 'Optimización',
			href: `/${pathRoot}/${Pathnames.OPTIMIZATION}`,
			userType: UserTypes.PERSONAL,
		},
		{
			id: uuid(),
			icon: <Route />,
			label: 'Hojas de Ruta',
			href: `/${pathRoot}/${Pathnames.ROADMAPS}`,
			userType: UserTypes.COMPANY,
		},
		{
			id: uuid(),
			icon: <Newspaper />,
			label: 'Publicaciones',
			href: `/${pathRoot}/${Pathnames.PUBLICATIONS}`,
			userType: UserTypes.PERSONAL,
		},
	]

	const userItems = items.filter(
		item => item.userType === user.userType || !item.userType
	)

	return (
		<section className='mx-auto flex min-h-dvh w-full flex-col md:max-w-[82.5rem]'>
			<header className='grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b p-4 sm:grid-cols-[auto_1fr_repeat(2,auto)] sm:p-6'>
				<section className='hidden items-center gap-3 sm:flex'>
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
				</section>
				<SearchBox
					className='col-start-2 col-end-3 justify-self-center sm:col-auto'
					user={user}
				/>
				<Notifications className='col-start-1 col-end-2 row-start-1 row-end-2 sm:col-auto sm:row-auto' />
				<Profile user={user} />
			</header>
			<main className='relative flex w-full flex-grow flex-col gap-0 p-4 sm:static sm:gap-8 sm:p-8 md:p-10'>
				<Navbar items={userItems} />
				{children}
			</main>
		</section>
	)
}
