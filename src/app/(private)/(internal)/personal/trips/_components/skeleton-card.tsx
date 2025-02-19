import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonCard = () => {
	return (
		<Card className='flex flex-col gap-4 border-none p-4 shadow-bento'>
			<CardHeader className='p-0'>
				<Skeleton className='h-4 w-1/2' />
			</CardHeader>
			<CardContent className='flex flex-grow flex-col gap-2 p-0'>
				<section className='flex flex-col gap-2'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />

					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />

					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />

					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />

					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />
				</section>
				<Skeleton className='h-8 w-full' />
				<Skeleton className='h-8 w-full' />
			</CardContent>
			<CardFooter className='grid grid-cols-2 gap-2 p-0'>
				<Skeleton className='h-8' />
				<Skeleton className='h-8' />
			</CardFooter>
		</Card>
	)
}

export default SkeletonCard
