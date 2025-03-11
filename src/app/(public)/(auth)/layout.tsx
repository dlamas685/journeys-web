import Image from 'next/image'
import { ReactNode } from 'react'
import CustomCarousel from './_components/custom-carousel'

type Props = {
	children: ReactNode
}

export default function AuthLayout({ children }: Readonly<Props>) {
	return (
		<section className='mx-auto flex h-full md:max-w-7xl'>
			<section className='hidden w-2/4 bg-orange-50 md:flex md:flex-col md:items-center md:justify-center'>
				<section className='flex w-full items-center gap-2 p-5 text-foreground'>
					{/* <Waypoints size={20} /> */}
					<Image
						src='/icons/icon-512x512.png'
						width={20}
						height={20}
						alt='Journeys'
						sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
					/>
					<span className='font-secondary font-bold'>JOURNEYS</span>
				</section>
				<CustomCarousel />
			</section>

			<section className='flex min-h-dvh w-full flex-col items-center gap-6 bg-white px-8 md:w-2/4 md:justify-center'>
				<Image
					src='/brand/isotype-v1.png'
					alt='Journeys'
					width={500}
					height={500}
					sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
					priority
					className='mt-10 size-20 sm:size-24 md:mt-0 md:hidden'
				/>
				{children}
			</section>
		</section>
	)
}
