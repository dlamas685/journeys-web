'use client'

import { findAll } from '@/common/actions/crud.action'
import {
	ApiEndpoints,
	FilterRules,
	FilterTypes,
	Pathnames,
	UserTypes,
} from '@/common/enums'
import {
	ActivityTemplateModel,
	QueryParamsModel,
	UserModel,
} from '@/common/models'
import { Button } from '@/components/ui/button'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Search } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { ComponentProps, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { RoadmapModel } from '../../company/roadmaps/_models'
import { TripModel } from '../../personal/trips/_models'

type Props = ComponentProps<typeof Button> & {
	placeholder?: string
	user: UserModel
}

const SearchBox = ({
	className,
	placeholder,
	user,
	...rest
}: Readonly<Props>) => {
	const [open, setOpen] = useState(false)

	const [searchTerm, setSearchTerm] = useState('')

	const [foundTrips, setFoundTrips] = useState<TripModel[]>([])

	const [foundActivityTemplates, setFoundActivityTemplates] = useState<
		ActivityTemplateModel[]
	>([])

	const [foundRoadmaps, setFoundRoadmaps] = useState<RoadmapModel[]>([])

	const pathname = usePathname()

	const router = useRouter()

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(open => !open)
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	const runCommand = (command: () => unknown) => {
		setOpen(false)
		command()
	}

	const handleSearch = useDebouncedCallback(async (term: string) => {
		console.log(`Searching... ${term}`)

		if (term.trim() === '') {
			setFoundTrips([])
			setFoundActivityTemplates([])
			setFoundRoadmaps([])
			return
		}

		const activityTemplateParams: QueryParamsModel = {
			filters: [
				{
					field: 'name',
					rule: FilterRules.CONTAINS,
					type: FilterTypes.STRING,
					value: term,
				},
			],
		}

		const foundActivityTemplates = await findAll<ActivityTemplateModel>(
			ApiEndpoints.ACTIVITY_TEMPLATES,
			activityTemplateParams,
			pathname
		).then(response => response.data)

		setFoundActivityTemplates(foundActivityTemplates)

		if (user.userType === UserTypes.PERSONAL) {
			const tripParams: QueryParamsModel = {
				filters: [
					{
						field: 'code',
						rule: FilterRules.CONTAINS,
						type: FilterTypes.STRING,
						value: term,
					},
				],
			}

			const foundTrips = await findAll<TripModel>(
				ApiEndpoints.TRIPS,
				tripParams,
				pathname
			).then(response => response.data)

			setFoundTrips(foundTrips)

			return
		}

		if (user.userType === UserTypes.COMPANY) {
			const roadmapsParams: QueryParamsModel = {
				filters: [
					{
						field: 'code',
						rule: FilterRules.CONTAINS,
						type: FilterTypes.STRING,
						value: term,
					},
				],
			}

			const foundRoadmaps = await findAll<RoadmapModel>(
				ApiEndpoints.ROADMAPS,
				roadmapsParams,
				pathname
			).then(response => response.data)

			setFoundRoadmaps(foundRoadmaps)

			return
		}
	}, 300)

	return (
		<>
			<Button
				type='button'
				aria-label={
					user.userType === UserTypes.PERSONAL
						? 'Buscar en la plataforma'
						: 'Buscar hojas de ruta'
				}
				aria-disabled='false'
				variant='outline'
				className={cn(
					'h-10 w-full items-center justify-start gap-2 border-none bg-muted px-4 font-secondary text-sm font-normal text-muted-foreground shadow-none hover:bg-muted-foreground/15 hover:text-accent-foreground md:max-w-sm',
					className
				)}
				onClick={() => setOpen(true)}
				{...rest}>
				<Search className='h-4 w-4' />
				<span className='inline-flex flex-grow truncate'>
					{user.userType === UserTypes.PERSONAL
						? 'Buscar en la plataforma'
						: 'Buscar en la plataforma'}
				</span>
				<kbd className='pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-secondary text-[10px] font-medium opacity-100 sm:flex'>
					<span className='text-xs'>⌘</span>K
				</kbd>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogTitle></DialogTitle>
				<CommandInput
					placeholder={
						user.userType === UserTypes.PERSONAL
							? 'Escribe para encontrar viajes y/o plantillas...'
							: 'Escribe para encontrar hojas de ruta y/o plantillas…'
					}
					value={searchTerm}
					onValueChange={(value: string) => {
						setSearchTerm(value)
						handleSearch(value)
					}}
				/>
				<CommandList>
					<CommandEmpty>No se encontraron resultados</CommandEmpty>

					{user.userType === UserTypes.PERSONAL ? (
						<>
							{foundTrips.length > 0 && (
								<CommandGroup heading='Viajes'>
									{foundTrips.map(trip => (
										<CommandItem
											key={trip.id}
											onSelect={() => {
												runCommand(() => {
													router.push(
														`/${UserTypes.PERSONAL.toLowerCase()}/${Pathnames.TRIPS}/${trip.id}`
													)
												})
											}}>
											{trip.code}
										</CommandItem>
									))}
								</CommandGroup>
							)}

							{foundActivityTemplates.length > 0 && (
								<CommandGroup heading='Plantillas de actividades'>
									{foundActivityTemplates.map(activityTemplate => (
										<CommandItem
											key={activityTemplate.id}
											onSelect={() => {
												runCommand(() => {
													router.push(
														`/${UserTypes.PERSONAL.toLowerCase()}/${Pathnames.ACTIVITY_TEMPLATES}/${activityTemplate.id}/${Pathnames.ACTIVITY_MANAGER}`
													)
												})
											}}>
											{activityTemplate.name}
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</>
					) : (
						<>
							{foundRoadmaps.length > 0 && (
								<CommandGroup heading='Hojas de ruta'>
									{foundRoadmaps.map(trip => (
										<CommandItem
											key={trip.id}
											onSelect={() => {
												runCommand(() => {
													router.push(
														`/${UserTypes.COMPANY.toLowerCase()}/${Pathnames.ROADMAPS}/${trip.id}`
													)
												})
											}}>
											{trip.code}
										</CommandItem>
									))}
								</CommandGroup>
							)}

							{foundActivityTemplates.length > 0 && (
								<CommandGroup heading='Plantillas de actividades'>
									{foundActivityTemplates.map(activityTemplate => (
										<CommandItem
											key={activityTemplate.id}
											onSelect={() => {
												runCommand(() => {
													router.push(
														`/${UserTypes.COMPANY.toLowerCase()}/${Pathnames.ACTIVITY_TEMPLATES}/${activityTemplate.id}/${Pathnames.ACTIVITY_MANAGER}`
													)
												})
											}}>
											{activityTemplate.name}
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</>
					)}

					{/* <pre>{JSON.stringify(foundTrips, null, 3)}</pre> */}
				</CommandList>
			</CommandDialog>
		</>
	)
}

export default SearchBox
