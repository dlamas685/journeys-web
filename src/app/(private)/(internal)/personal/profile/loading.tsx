import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Mi perfil</FrameTitle>
			</FrameHeader>
			<FrameBody className='max-w-lg'>
				<section className='grid grid-cols-1 items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-3.5'>
					<Skeleton className='size-28 place-self-center rounded-3xl' />

					<section className='flex w-full flex-col gap-1.5 sm:w-auto sm:flex-grow'>
						<Skeleton className='h-5 w-1/3' />

						<section className='flex w-full items-center gap-2'>
							<Skeleton className='h-10 flex-grow' />

							<Skeleton className='h-9 w-16' />
						</section>

						<Skeleton className='h-5 w-full' />
					</section>
				</section>
				<section className='grid w-full grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3'>
					<section className='col-span-full space-y-2'>
						<Skeleton className='h-5 w-1/3' />
						<Skeleton className='h-10 w-full' />
					</section>
					<section className='space-y-2'>
						<Skeleton className='h-5 w-1/3' />
						<Skeleton className='h-10 w-full' />
					</section>
					<section className='space-y-2'>
						<Skeleton className='h-5 w-1/3' />
						<Skeleton className='h-10 w-full' />
					</section>
					<section className='space-y-2'>
						<Skeleton className='h-5 w-1/3' />
						<Skeleton className='h-10 w-full' />
					</section>
					<section className='space-y-2'>
						<Skeleton className='h-5 w-1/3' />
						<Skeleton className='h-10 w-full' />
					</section>
					<section className='space-y-2'>
						<Skeleton className='h-5 w-1/3' />
						<Skeleton className='h-10 w-full' />
					</section>
					<section className='space-y-2'>
						<Skeleton className='h-5 w-1/3' />
						<Skeleton className='h-10 w-full' />
					</section>
				</section>

				<Skeleton className='col-span-full mt-2 h-10 w-full justify-self-start sm:mt-4 sm:w-28' />
			</FrameBody>
		</Frame>
	)
}
