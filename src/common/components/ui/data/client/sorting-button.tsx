'use client'

import { SortDirections } from '@/common/enums'
import { QueryParamsModel, SortFieldModel } from '@/common/models'
import { decodeQuery, jsonToBase64 } from '@/common/utils'
import { cn } from '@/lib/utils'
import { MoveDown, MoveUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ComponentProps } from 'react'

type Props = ComponentProps<'section'> & {
	field: string
}

const SortingButton = ({
	className,
	children,
	field,
	...rest
}: Readonly<Props>) => {
	const router = useRouter()

	const pathname = usePathname()

	const searchParams = useSearchParams()

	const query = searchParams.get('query')

	const queryParams = decodeQuery(query ?? '') ?? {}

	const sort = queryParams.sorts?.find(sort => sort.field === field)

	const handleSort = () => {
		const direction =
			sort?.direction === SortDirections.ASC
				? SortDirections.DESC
				: sort?.direction === SortDirections.DESC
					? undefined
					: SortDirections.ASC

		if (!direction) {
			const newQueryParams: QueryParamsModel = {
				...queryParams,
				sorts: undefined,
			}

			const query = jsonToBase64(newQueryParams)

			router.replace(`${pathname}?query=${query}`)

			return
		}

		const newSort: SortFieldModel = {
			field,
			direction,
		}

		const newQueryParams: QueryParamsModel = {
			...queryParams,
			sorts: [newSort],
		}

		const query = jsonToBase64(newQueryParams)

		router.replace(`${pathname}?query=${query}`)
	}

	return (
		<section
			className={cn(
				'flex cursor-pointer select-none items-center gap-1 transition-all hover:text-orange-500',
				className
			)}
			{...rest}
			onClick={handleSort}>
			{children}

			<div className='flex items-center'>
				<MoveUp
					className={cn('size-3', {
						'text-orange-500': sort?.direction === SortDirections.ASC,
					})}
				/>
				<MoveDown
					className={cn('-ml-1.5 size-3', {
						'text-orange-500': sort?.direction === SortDirections.DESC,
					})}
				/>
			</div>
		</section>
	)
}

export default SortingButton
