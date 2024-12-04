import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
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
			<FrameHeader>
				<FrameTitle>Flotas</FrameTitle>
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
								<TableHead className='text-black'>Nombre</TableHead>
								<TableHead className='text-black'>Descripción</TableHead>
								<TableHead className='text-black'>MDV</TableHead>
								<TableHead className='text-black'>MDC</TableHead>
								<TableHead className='text-black'>Creado</TableHead>
								<TableHead className='text-black'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 6 }).map((_, index) => (
								<TableRow
									key={index}
									className='rounded-l-xl rounded-r-xl border-none bg-zinc-50'>
									<TableCell className='rounded-l-xl'>
										<Skeleton className='h-8 w-full' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-8 w-full' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-8 w-full' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-8 w-full' />
									</TableCell>
									<TableCell>
										<Skeleton className='h-8 w-full' />
									</TableCell>
									<TableCell className='rounded-r-xl'>
										<Skeleton className='h-8 w-full' />
									</TableCell>
								</TableRow>
							))}
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
