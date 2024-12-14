'use client'
import { SortDirections } from '@/common/enums'
import { type QueryParamsModel } from '@/common/models'
import { jsonToBase64 } from '@/common/utils'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
	queryParams: QueryParamsModel
	field: string
	label: string
}

const SortingButtons = ({ field, label, queryParams }: Readonly<Props>) => {
	const [value, setValue] = useState<SortDirections>(
		(queryParams.sorts && queryParams.sorts[0]?.direction) ?? SortDirections.ASC
	)

	const pathname = usePathname()

	const router = useRouter()

	const handleValueChange = (direction: SortDirections) => {
		if (!direction) return

		if (queryParams.sorts && queryParams.sorts[0]?.direction === direction)
			return

		setValue(direction)

		const newQueryParams: QueryParamsModel = {
			...queryParams,
			sorts: [
				{
					field,
					direction,
				},
			],
		}

		const query = jsonToBase64(newQueryParams)

		router.replace(`${pathname}?query=${query}`)
	}

	return (
		<ToggleGroup
			type='single'
			size='sm'
			variant='outline'
			value={value}
			defaultValue={value}
			onValueChange={handleValueChange}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<ToggleGroupItem
							data-state={value === SortDirections.ASC ? 'on' : 'off'}
							value={SortDirections.ASC}
							aria-label={`Ordenar de forma ascendente por ${label}`}
							aria-disabled={false}>
							<ArrowUpAZ className='size-4' />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent className='bg-orange-100 font-secondary text-primary'>
						<p>
							Ordenar de forma ascendente por <b>{label}</b>
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<ToggleGroupItem
							data-state={value === SortDirections.DESC ? 'on' : 'off'}
							value={SortDirections.DESC}
							aria-label={`Ordenar de forma descendente por ${label}`}
							aria-disabled={false}>
							<ArrowDownAZ className='size-4' />
						</ToggleGroupItem>
					</TooltipTrigger>
					<TooltipContent className='bg-orange-100 font-secondary text-primary'>
						<p>
							Ordenar de forma descendente por <b>{label}</b>
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</ToggleGroup>
	)
}

export default SortingButtons
