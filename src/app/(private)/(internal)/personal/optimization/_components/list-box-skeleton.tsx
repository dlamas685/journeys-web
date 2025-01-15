import { Skeleton } from '@/components/ui/skeleton'

const ListBoxSkeleton = () => {
	return (
		<ul className='max-h-96 overflow-auto py-3 pr-2 font-secondary text-sm text-muted-foreground'>
			{Array.from({ length: 5 }).map((_, index) => (
				<li
					key={index}
					className='mb-2 flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-muted-foreground p-3 transition-all'>
					<Skeleton className='h-8 w-8 rounded-full' />
					<p>
						<Skeleton className='h-4 w-20' />
						<br />
						<Skeleton className='h-4 w-20' />
					</p>
				</li>
			))}
		</ul>
	)
}

export default ListBoxSkeleton
