import Copyright from '@/common/components/ui/misc/copyright'
import Logout from '@/common/components/ui/misc/logout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import * as motion from 'framer-motion/client'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import CompanyProfileForm from './_components/company-profile-form'
import PersonalProfileForm from './_components/personal-profile-form'

export default async function FirsStepsPage() {
	return (
		<section className='relative w-full min-h-dvh flex flex-col gap-4 items-center bg-gradient-to-r from-orange-50 via-white to-orange-50'>
			<motion.header
				className='max-w-xs mt-1 flex flex-col items-center sm:max-w-sm sm:mt-2 md:max-w-xl md:mt-4'
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
					className='w-52 h-52 md:w-64 md:h-64'
					priority
				/>

				<h1 className='text-center text-xl font-bold font-primary italic md:text-2xl'>
					¡Bienvenid@! <br /> Nos alegra tenerte con nosotros.
				</h1>
				<p className='mt-2 text-center text-sm text-secondary font-light text-slate-950 md:text-base'>
					Para comenzar, selecciona un tipo de usuario. Si no estás seguro,
					selecciona la opción que más se ajuste a tus necesidades. Podrás
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
					className='flex flex-col gap-2 items-center sm:gap-4'>
					<TabsList className='grid w-full grid-cols-2 max-w-xs sm:max-w-sm md:max-w-md'>
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

			<Logout className='absolute top-5 right-5'>
				<LogOut className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
				<span className='ml-1 hidden sm:inline'>Salir</span>
			</Logout>

			<Copyright />
		</section>
	)
}
