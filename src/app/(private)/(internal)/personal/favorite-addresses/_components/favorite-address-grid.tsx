'use client'

import { ApiEndpoints, Pathnames } from '@/common/enums'
import useInfiniteScroll from '@/common/hooks/use-infinite-scroll'
import { QueryParamsModel } from '@/common/models'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw } from 'lucide-react'
import { FavoriteAddressModel } from '../_models'
import FavoriteAddressCard from './favorite-address-card'
import UpsertForm from './upsert-form'

type Props = {
	defaultValue: FavoriteAddressModel[]
	page: number
	total: number
	lastPage: number
	queryParams: QueryParamsModel
}

const FavoriteAddressGrid = ({
	defaultValue,
	queryParams,
	page,
	lastPage,
	total,
}: Readonly<Props>) => {
	const { records, loader, hasMore, isLoading, hasError, clearError } =
		useInfiniteScroll<FavoriteAddressModel>({
			endpoint: ApiEndpoints.FAVORITE_ADDRESSES,
			defaultValue,
			fallbackUrl: Pathnames.FAVORITE_ADDRESSES,
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
			<section className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
				{records.map((record, index) => (
					<FavoriteAddressCard
						key={record.id}
						record={record}
						custom={index}
						variants={cardVariants}
						initial='hidden'
						animate='visible'
						updaterForm={<UpsertForm record={record} />}
					/>
				))}
			</section>
			{isLoading && (
				<div className='flex justify-center p-4'>
					<Loader2 className='h-6 w-6 animate-spin' />
				</div>
			)}
			{hasError && (
				<Button className='w-48' onClick={clearError} variant='secondary'>
					<RefreshCcw className='mr-1 size-4' />
					Reintentar
				</Button>
			)}
			{hasMore && <div ref={loader} />}
		</>
	)
}

export default FavoriteAddressGrid
