'use client'

import { ApiEndpoints, Pathnames } from '@/common/enums'
import useInfiniteScroll from '@/common/hooks/use-infinite-scroll'
import type { QueryParamsModel } from '@/common/models'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw } from 'lucide-react'
import { TripModel } from '../_models'
import TripCard from './trip-card'
import UpdateForm from './update-form'

type Props = {
	defaultValue: TripModel[]
	page: number
	total: number
	lastPage: number
	queryParams: QueryParamsModel
}

const TripsGrid = ({
	defaultValue,
	queryParams,
	page,
	lastPage,
	total,
}: Readonly<Props>) => {
	const { records, loader, hasMore, isLoading, hasError, clearError } =
		useInfiniteScroll<TripModel>({
			endpoint: ApiEndpoints.TRIPS,
			defaultValue,
			fallbackUrl: Pathnames.TRIPS,
			page,
			lastPage,
			queryParams,
		})

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.05,
				type: 'spring',
				stiffness: 50,
			},
		}),
	}

	return (
		<>
			<section className='grid w-full grid-cols-1 gap-4 sm:grid-cols-3'>
				{records.map((record, index) => (
					<TripCard
						key={index}
						record={record}
						custom={index}
						variants={cardVariants}
						initial='hidden'
						animate='visible'
						updaterForm={<UpdateForm record={record} />}
					/>
				))}
			</section>
			{isLoading && (
				<div className='flex justify-center p-4'>
					<Loader2 className='h-6 w-6 animate-spin' />
				</div>
			)}
			{hasError && (
				<Button
					aria-label='Reintentar la carga de plantillas de actividades'
					aria-disabled={false}
					className='w-48'
					onClick={clearError}
					variant='secondary'>
					<RefreshCcw className='mr-1 size-4' />
					Reintentar
				</Button>
			)}
			{hasMore && <div ref={loader} />}
		</>
	)
}

export default TripsGrid
