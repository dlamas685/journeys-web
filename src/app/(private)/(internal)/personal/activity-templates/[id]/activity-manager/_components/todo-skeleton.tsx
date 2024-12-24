import { Skeleton } from '@/components/ui/skeleton'

const TodoSkeleton = () => {
	return (
		<section className='grid grid-cols-[1fr_auto] gap-3 rounded-md bg-zinc-50 p-4'>
			<section className='flex flex-col gap-1'>
				<span className='flex items-center gap-1 font-secondary font-semibold'>
					<Skeleton className='size-5' />
					<Skeleton className='h-5 w-36' />
				</span>
				<Skeleton className='h-5 w-full' />
				<Skeleton className='h-5 w-full' />
				<Skeleton className='h-5 w-24' />
			</section>
			<section className='flex flex-col justify-between'>
				<Skeleton className='h-6 w-6' />
				<Skeleton className='h-6 w-6' />
			</section>
		</section>
	)
}

export default TodoSkeleton
