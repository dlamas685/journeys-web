import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Skeleton } from '@/components/ui/skeleton'
import TodoSkeleton from './_components/todo-skeleton'

export default function Loading() {
	return (
		<Frame className='gap-5 sm:gap-3'>
			<FrameHeader className='sm:flex sm:flex-col sm:gap-1'>
				<section className='flex flex-col gap-1'>
					<FrameTitle>Actividades</FrameTitle>
					<Skeleton className='h-4 w-60' />
				</section>
				<section className='flex flex-col gap-1'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-20' />
				</section>
			</FrameHeader>
			<FrameBody className='sm:gap-4'>
				<section className='flex justify-between gap-2'>
					<Skeleton className='h-9 w-24' />

					<section className='grid grid-cols-2 gap-1'>
						<Skeleton className='h-9 w-24' />
						<Skeleton className='h-9 w-24' />
					</section>
				</section>
				<section className='grid h-full w-full grid-cols-1 gap-3 overflow-hidden md:grid-cols-2'>
					{Array.from({ length: 8 }).map((_, index) => (
						<TodoSkeleton key={index} />
					))}
				</section>
			</FrameBody>
		</Frame>
	)
}
