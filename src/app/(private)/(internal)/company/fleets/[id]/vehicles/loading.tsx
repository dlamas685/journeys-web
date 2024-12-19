import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { PAGINATION_LIMITS_OPTIONS } from '@/common/constants'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

export default function Loading() {
	return (
		<Frame className='gap-5 sm:gap-3'>
			<FrameHeader className='sm:flex sm:flex-col sm:gap-1'>
				<section className='flex flex-col gap-1'>
					<FrameTitle>Vehículos</FrameTitle>
					<Skeleton className='h-4 w-40' />
				</section>
				<section className='flex flex-col gap-1'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-full' />
				</section>
			</FrameHeader>
			<FrameBody className='gap-0 sm:gap-4'>
				<header className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2'>
					<Skeleton className='h-10 w-full' />
					<section className='row-start-1 flex flex-wrap items-center justify-center gap-2 sm:col-start-2 sm:justify-end'>
						<Skeleton className='h-9 w-24' />
						<Skeleton className='h-9 w-24' />
						<Skeleton className='h-9 w-24' />
					</section>
				</header>

				<section className='w-full'>
					<Table className='border-separate border-spacing-y-3 font-secondary'>
						<TableHeader>
							<TableRow className='border-none hover:bg-inherit'>
								<TableHead className='h-10 w-24'>
									<Skeleton className='h-5 w-full' />
								</TableHead>
								<TableHead className='h-10 w-80'>
									<Skeleton className='h-5 w-36' />
								</TableHead>
								<TableHead className='h-10 w-20'>
									<Skeleton className='h-5 w-full' />
								</TableHead>
								<TableHead className='h-10 w-20'>
									<Skeleton className='h-5 w-full' />
								</TableHead>
								<TableHead className='h-10 w-24'>
									<Skeleton className='h-5 w-full' />
								</TableHead>
								<TableHead className='h-10 w-20'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: PAGINATION_LIMITS_OPTIONS[0] }).map(
								(_, index) => (
									<TableRow
										key={index}
										className='rounded-l-xl rounded-r-xl border-none bg-zinc-50'>
										<TableCell className='h-12 rounded-l-xl'>
											<Skeleton className='h-5 w-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-full' />
										</TableCell>
										<TableCell>
											<Skeleton className='h-5 w-full' />
										</TableCell>
										<TableCell className='rounded-r-xl'>
											<Skeleton className='h-5 w-full' />
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				</section>

				<footer className='grid w-full grid-cols-1 items-center justify-center gap-3 sm:grid-cols-2'>
					<Skeleton className='h-5 w-48 self-center justify-self-center sm:justify-self-start' />
					<Skeleton className='h-9 w-full' />
				</footer>
			</FrameBody>
		</Frame>
	)
}
