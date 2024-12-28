import Copyright from '@/common/components/ui/misc/copyright'
import Logout from '@/common/components/ui/misc/logout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import * as motion from 'framer-motion/client'
import { LogOut } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import CompanyProfileForm from './_components/company-profile-form'
import PersonalProfileForm from './_components/personal-profile-form'

export const metadata: Metadata = {
	title: 'Journeys • Primeros Pasos',
	description:
		'Completa tu perfil para comenzar a disfrutar de todas las funcionalidades de Journeys.',
}

export default function FirsStepsPage() {
	return (
		<section className='relative flex min-h-dvh w-full flex-col items-center gap-4 bg-gradient-to-r from-orange-50 via-white to-orange-50 px-8 sm:px-0'>
			<motion.header
				className='mt-1 flex max-w-xs flex-col items-center gap-2 sm:mt-2 sm:max-w-sm md:mt-4 md:max-w-xl'
				initial={{
					opacity: 0,
				}}
				animate={{
					opacity: 1,
				}}
				exit={{
					opacity: 0,
				}}
				transition={{
					duration: 1.5,
				}}>
				<Image
					src='/brand/imagotype-v1.png'
					width={200}
					height={200}
					alt='Journeys'
					className='mt-10 size-28 md:size-40'
					sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
				/>

				<h1 className='mt-2 text-center font-primary text-xl font-bold italic md:text-2xl'>
					¡Bienvenid@! <br /> Nos alegra tenerte con nosotros.
				</h1>
				<p className='text-center text-sm font-light text-secondary text-slate-950 md:text-base'>
					Para comenzar, Seleccione un tipo de usuario. Si no estás seguro,
					Seleccione la opción que más se ajuste a tus necesidades. Podrás
					cambiarlo más adelante.
				</p>
			</motion.header>

			<motion.section
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
				className='w-full flex-grow'>
				<Tabs
					defaultValue='personal'
					className='flex flex-col items-center gap-2 sm:gap-4'>
					<TabsList className='grid w-full max-w-xs grid-cols-2 sm:max-w-sm md:max-w-md'>
						<TabsTrigger value='personal'>Personal</TabsTrigger>
						<TabsTrigger value='company'>Empresa</TabsTrigger>
					</TabsList>
					<TabsContent
						value='personal'
						className='w-full max-w-xs sm:max-w-sm md:max-w-lg'>
						<PersonalProfileForm />
					</TabsContent>
					<TabsContent
						value='company'
						className='w-full max-w-xs sm:max-w-sm md:max-w-lg'>
						<CompanyProfileForm />
					</TabsContent>
				</Tabs>
			</motion.section>

			<Logout className='absolute right-5 top-5'>
				<LogOut className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
				<span className='ml-1 hidden sm:inline'>Salir</span>
			</Logout>

			<Copyright />
		</section>
	)
}
