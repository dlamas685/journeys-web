import { Waypoints } from 'lucide-react'
import { ReactNode } from 'react'
import CustomCarousel from './_components/custom-carousel'

type Props = {
	children: ReactNode
}

export default function AuthLayout({ children }: Readonly<Props>) {
	return (
		<section className='flex h-screen max-w-[82.5rem] mx-auto'>
			<section className='hidden w-2/4 md:flex md:flex-col md:justify-center md:items-center bg-orange-50'>
				<section className='w-full flex items-center gap-2 p-5 text-orange-600'>
					<Waypoints size={20} />
					<span className='font-secondary font-bold'>JOURNEYS</span>
				</section>
				<CustomCarousel />
			</section>

			<section className='relative w-full h-full bg-white md:w-2/4'>
				<section className='flex justify-center items-center absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]'>
					{children}
				</section>
			</section>
		</section>
	)
}
