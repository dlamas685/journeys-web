'use client'

import { findAll } from '@/common/actions/crud.action'
import InputMask from '@/common/components/ui/form/input-mask'
import BroomIcon from '@/common/components/ui/icons/broom-icon'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import { ActivityTemplateModel } from '@/common/models'
import { useLoading } from '@/common/stores/loading.store'
import { convertToHHMM, convertToSeconds, sleep } from '@/common/utils'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
	CheckCircle2,
	LoaderCircle,
	LocateFixed,
	PlusCircle,
	Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AdvancedWaypointModel, WaypointActivityModel } from '../_models'
import { useActivities } from '../_store/activities.store'

type Props = {
	waypoint: AdvancedWaypointModel
	onReady?: (waypoint: AdvancedWaypointModel) => void
}

const ActivitiesSetting = ({ waypoint, onReady }: Readonly<Props>) => {
	const [open, setOpen] = useState<boolean>(false)

	const isDesktop = useMediaQuery('(min-width: 40rem)')

	const isLoading = useLoading(state => state.loading)

	const setLoading = useLoading(state => state.setLoading)

	const [activityTemplates, setActivityTemplates] = useState<
		ActivityTemplateModel[]
	>([])

	const activities = useActivities(state => state.activities)

	const setActivities = useActivities(state => state.setActivities)

	const updateActivity = useActivities(state => state.updateActivity)

	const removeActivity = useActivities(state => state.removeActivity)

	const addActivity = useActivities(state => state.addActivity)

	const [temporalMode, setTemporalMode] = useState<string>('manual')

	const [temporalTemplate, setTemporalTemplate] = useState<string>('')

	const handleTemporalMode = (value: string) => {
		setTemporalMode(value)
		setTemporalTemplate('')
		setActivities([])
	}

	const handleTemporalTemplate = (value: string) => {
		const activities =
			activityTemplates
				.find(activityTemplate => activityTemplate.id === value)
				?.activities?.map(
					activity =>
						({
							...activity,
							duration: activity.duration
								? convertToHHMM(activity.duration)
								: '',
						}) as WaypointActivityModel
				) ?? []

		console.log(activities)

		setActivities(activities)
		setTemporalTemplate(value)
	}

	const handleReady = async () => {
		if (
			activities.some(
				activity =>
					!activity.name || !activity.description || !activity.duration
			)
		) {
			toast.error('Criterios Avanzados', {
				description:
					'Por favor, complete todos los campos o elimine las actividades sin completar',
			})
			return
		}

		if (
			activities.some(
				activity =>
					activity.duration && convertToSeconds(activity.duration) < 1800
			)
		) {
			const errors = activities.filter(
				activity =>
					activity.duration && convertToSeconds(activity.duration) < 1800
			)

			toast.error('Criterios Avanzados', {
				description:
					`La duración mínima de una actividad es de 30 minutos. ` +
					`Por favor, corrija las siguientes actividades: ${errors.map(err => err.name).join(', ')}`,
			})
			return
		}

		setLoading(true)

		await sleep(1500)
			.then(() => {
				onReady?.({
					...waypoint,
					via: false,
					vehicleStopover: activities.length > 0,
					activities: activities as WaypointActivityModel[],
					config: {
						mode: temporalMode,
						template: temporalTemplate,
					},
				} as AdvancedWaypointModel)
				setOpen(false)
			})
			.then(() => {
				setActivities([])
			})
			.finally(() => {
				setLoading(false)
			})
	}

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen)

		if (!isOpen) {
			setActivities([])
			setTemporalMode('')
			setTemporalTemplate('')
		}
	}

	const handleClear = () => {
		setActivities([])
		setTemporalMode('')
		setTemporalTemplate('')
	}

	useEffect(() => {
		const fetchActivityTemplates = async () => {
			const response = await findAll<ActivityTemplateModel>(
				ApiEndpoints.ACTIVITY_TEMPLATES,
				{},
				Pathnames.OPTIMIZATION
			)
			setActivityTemplates(response.data)
		}

		fetchActivityTemplates()
	}, [])

	useEffect(() => {
		if (open) {
			setActivities(waypoint.activities || [])
			setTemporalMode(waypoint.config?.mode || 'manual')
			setTemporalTemplate(waypoint.config?.template || '')
		}
	}, [
		open,
		waypoint.activities,
		setActivities,
		waypoint.config?.mode,
		waypoint.config?.template,
	])

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant='secondary' size='sm'>
						<LocateFixed className='mr-1 size-3' />
						{waypoint.address} ({waypoint.activities?.length})
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Actividades</DialogTitle>
						<DialogDescription>{waypoint.address}</DialogDescription>

						<section className='flex flex-col gap-4 px-4 sm:px-0'>
							<section className='space-y-1 font-secondary text-sm text-muted-foreground'>
								<h3 className='font-medium text-foreground'>
									Tipo de configuración
								</h3>

								<RadioGroup
									defaultValue={temporalMode}
									onValueChange={handleTemporalMode}
									value={temporalMode}>
									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='manual' id='manual' />
										<Label htmlFor='manual'>Ingreso manual</Label>
									</div>

									<div className='flex items-center space-x-2'>
										<RadioGroupItem value='template' id='template' />
										<Label htmlFor='template'>Usar una plantilla</Label>
									</div>
								</RadioGroup>
							</section>

							{temporalMode === 'template' && (
								<>
									<section className='space-y-1 font-secondary text-sm text-muted-foreground'>
										<h3 className='font-medium text-foreground'>Plantillas</h3>

										<RadioGroup
											defaultValue={undefined}
											value={temporalTemplate}
											onValueChange={handleTemporalTemplate}
											className='max-h-36 overflow-auto'>
											{activityTemplates.map(activityTemplate => (
												<div
													key={activityTemplate.id}
													className='flex items-center space-x-2'>
													<RadioGroupItem
														value={activityTemplate.id}
														id={activityTemplate.id}
													/>
													<Label htmlFor={activityTemplate.id}>
														{activityTemplate.name}
													</Label>
												</div>
											))}
										</RadioGroup>
									</section>

									<section className='flex max-h-96 flex-col gap-2 overflow-auto p-2 text-sm text-muted-foreground'>
										{activities.map((activity, index) => (
											<div
												key={activity.id}
												className='grid grid-cols-[1.6fr_0.4fr_auto] gap-2'>
												<section>
													<h4 className='font-secondary text-sm font-semibold capitalize text-muted-foreground'>
														{activity.name}
													</h4>

													<p>{activity.description}</p>
												</section>

												<InputMask
													type='text'
													placeholder='HH:mm'
													value={activity.duration ?? undefined}
													options={{
														time: true,
														timePattern: ['h', 'm'],
													}}
													onChange={e =>
														updateActivity({
															...activity,
															duration: e.target.value,
														})
													}
												/>

												<Button
													size='icon'
													variant='link'
													className='text-red-500 hover:text-red-500'
													onClick={() => removeActivity(activity)}>
													<Trash2 className='size-4' />
												</Button>
											</div>
										))}
									</section>
								</>
							)}

							{temporalMode === 'manual' && (
								<section className='grid grid-cols-1 gap-2'>
									<Button
										className='place-self-start'
										variant='secondary'
										onClick={() => addActivity()}>
										<PlusCircle className='mr-1 size-4' />
										Agregar actividad
									</Button>

									<section className='flex max-h-96 flex-col gap-2 overflow-auto px-2 pb-2'>
										{activities.map((activity, index) => (
											<div key={activity.id} className='flex flex-col gap-2'>
												<section className='flex items-center justify-between gap-2'>
													<h4 className='font-secondary text-sm text-muted-foreground'>
														Actividad {index + 1}
													</h4>
													<Button
														size='icon'
														variant='link'
														className='text-red-500 hover:text-red-500'
														onClick={() => removeActivity(activity)}>
														<Trash2 className='size-4' />
													</Button>
												</section>

												<Input
													type='text'
													placeholder='Ingrese el nombre de la actividad'
													value={activity.name ?? ''}
													onChange={e =>
														updateActivity({
															...activity,
															name: e.target.value,
														})
													}
												/>

												<Textarea
													placeholder='Ingrese la descripción de la actividad'
													value={activity.description ?? ''}
													onChange={e =>
														updateActivity({
															...activity,
															description: e.target.value,
														})
													}
												/>

												<InputMask
													type='text'
													placeholder='Ingrese la duración de la actividad (HH:mm)'
													value={activity.duration ?? undefined}
													options={{
														time: true,
														timePattern: ['h', 'm'],
													}}
													onChange={e =>
														updateActivity({
															...activity,
															duration: e.target.value,
														})
													}
												/>
											</div>
										))}
									</section>
								</section>
							)}
						</section>
						<DialogFooter>
							{activities.length > 0 && (
								<Button type='button' variant='secondary' onClick={handleClear}>
									<BroomIcon className='mr-1 size-4' />
									Limpiar
								</Button>
							)}
							<Button type='button' onClick={handleReady}>
								{isLoading ? (
									<LoaderCircle className='mr-1 size-4 animate-spin' />
								) : (
									<CheckCircle2 className='mr-1 size-4' />
								)}
								Listo
							</Button>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={handleOpenChange}>
			<DrawerTrigger asChild>
				<Button variant='secondary' size='sm'>
					<LocateFixed className='mr-1 size-3' />
					{waypoint.address}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className='text-left'>
					<DrawerTitle>Actividades</DrawerTitle>
					<DrawerDescription>{waypoint.address}</DrawerDescription>
				</DrawerHeader>

				<section className='flex max-h-96 flex-col gap-4 overflow-auto px-4 sm:px-0'>
					<section className='space-y-1 font-secondary text-sm text-muted-foreground'>
						<h3 className='font-medium text-foreground'>
							Tipo de configuración
						</h3>

						<RadioGroup
							defaultValue={temporalMode}
							onValueChange={handleTemporalMode}
							value={temporalMode}>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='manual' id='manual' />
								<Label htmlFor='manual'>Ingreso manual</Label>
							</div>

							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='template' id='template' />
								<Label htmlFor='template'>Usar una plantilla</Label>
							</div>
						</RadioGroup>
					</section>

					{temporalMode === 'template' && (
						<>
							<section className='space-y-1 font-secondary text-sm text-muted-foreground'>
								<h3 className='font-medium text-foreground'>Plantillas</h3>

								<RadioGroup
									defaultValue={undefined}
									value={temporalTemplate}
									onValueChange={handleTemporalTemplate}>
									{activityTemplates.map(activityTemplate => (
										<div
											key={activityTemplate.id}
											className='flex items-center space-x-2'>
											<RadioGroupItem
												value={activityTemplate.id}
												id={activityTemplate.id}
											/>
											<Label htmlFor={activityTemplate.id}>
												{activityTemplate.name}
											</Label>
										</div>
									))}
								</RadioGroup>
							</section>

							<section className='flex flex-col gap-2 px-2 pb-2 text-sm text-muted-foreground'>
								{activities.map((activity, index) => (
									<div
										key={activity.id}
										className='grid grid-cols-[1.6fr_0.4fr_auto] gap-2'>
										<section>
											<h4 className='font-secondary text-sm font-semibold capitalize text-muted-foreground'>
												{activity.name}
											</h4>

											<p>{activity.description}</p>
										</section>

										<InputMask
											type='text'
											placeholder='HH:mm'
											value={activity.duration ?? undefined}
											options={{
												time: true,
												timePattern: ['h', 'm'],
											}}
											onChange={e =>
												updateActivity({
													...activity,
													duration: e.target.value,
												})
											}
										/>

										<Button
											size='icon'
											variant='link'
											className='text-red-500 hover:text-red-500'
											onClick={() => removeActivity(activity)}>
											<Trash2 className='size-4' />
										</Button>
									</div>
								))}
							</section>
						</>
					)}

					{temporalMode === 'manual' && (
						<section className='grid grid-cols-1 gap-2'>
							<Button
								className='place-self-start'
								variant='secondary'
								onClick={() => addActivity()}>
								<PlusCircle className='mr-1 size-4' />
								Agregar actividad
							</Button>

							<section className='flex flex-col gap-2 px-2 pb-2'>
								{activities.map((activity, index) => (
									<div key={activity.id} className='flex flex-col gap-2'>
										<section className='flex items-center justify-between gap-2'>
											<h4 className='font-secondary text-sm text-muted-foreground'>
												Actividad {index + 1}
											</h4>
											<Button
												size='icon'
												variant='link'
												className='text-red-500 hover:text-red-500'
												onClick={() => removeActivity(activity)}>
												<Trash2 className='size-4' />
											</Button>
										</section>

										<Input
											type='text'
											placeholder='Ingrese el nombre de la actividad'
											value={activity.name}
											onChange={e =>
												updateActivity({
													...activity,
													name: e.target.value,
												})
											}
										/>

										<Textarea
											placeholder='Ingrese la descripción de la actividad'
											value={activity.description}
											onChange={e =>
												updateActivity({
													...activity,
													description: e.target.value,
												})
											}
										/>

										<InputMask
											type='text'
											placeholder='Ingrese la duración de la actividad (HH:mm)'
											value={activity.duration ?? undefined}
											options={{
												time: true,
												timePattern: ['h', 'm'],
											}}
											onChange={e =>
												updateActivity({
													...activity,
													duration: e.target.value,
												})
											}
										/>
									</div>
								))}
							</section>
						</section>
					)}
				</section>

				<DrawerFooter>
					{activities.length > 0 && (
						<Button type='button' variant='secondary' onClick={handleClear}>
							<BroomIcon className='mr-1 size-4' />
							Limpiar
						</Button>
					)}
					<Button type='button' onClick={handleReady}>
						{isLoading ? (
							<LoaderCircle className='mr-1 size-4 animate-spin' />
						) : (
							<CheckCircle2 className='mr-1 size-4' />
						)}
						Listo
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export default ActivitiesSetting
