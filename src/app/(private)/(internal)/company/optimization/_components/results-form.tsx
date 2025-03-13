'use client'
import { create } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import Polyline from '@/common/components/ui/google/fragments/polyline'
import TaskErrorIcon from '@/common/components/ui/icons/task-error-icon'
import TransitionsIcon from '@/common/components/ui/icons/transitions-icon'
import VisitsIcon from '@/common/components/ui/icons/visits-icon'
import ResponsiveSheet from '@/common/components/ui/overlay/responsive-sheet'
import { ApiEndpoints } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { useStepper } from '@/common/stores/stepper.store'
import {
	convertToUTCISO,
	formatDistance,
	formatTime,
	hhmmToSeconds,
} from '@/common/utils'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SettingsIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import RiseLoader from 'react-spinners/RiseLoader'
import { CreateRoadmapModel, RoadmapModel } from '../../roadmaps/_models'
import { optimizeTours } from '../_actions/roadmaps.action'
import { Steps } from '../_enums'
import { SettingModel } from '../_models'
import { resultsFormSchema, ResultsFormSchema } from '../_schemas'
import { useOptimization } from '../_store/optimization.store'
import Omitted from './omitted'
import Settings from './settings'
import Transitions from './transitions'
import Visits from './visits'

const ResultsForm = () => {
	const response = useResponse()

	const presets = useOptimization(state => state.presets)

	const setResults = useOptimization(state => state.setResults)

	const results = useOptimization(state => state.results)

	const [resultsLoading, setResultsLoading] = useState<boolean>(false)

	const setLoading = useLoading(state => state.setLoading)

	const [setting, setSetting] = useState<SettingModel | null>(null)

	const handleFinish = useStepper(state => state.handleFinish)

	const form = useForm<ResultsFormSchema>({
		resolver: zodResolver(resultsFormSchema),
		defaultValues: { alias: '' },
	})

	const handleSubmit = async (values: ResultsFormSchema) => {
		setLoading(true)

		if (!setting || !results?.response) return

		const createRoadmapModel: CreateRoadmapModel = {
			code: values.alias,
			startDateTime: setting.firstStage.startDateTime,
			endDateTime: setting.firstStage.endDateTime,
			fleetId: setting.firstStage.fleetId,
			driverId: setting.firstStage.driverId,
			vehicleId: setting.firstStage.vehicleId,
			setting,
		}

		await create<CreateRoadmapModel, RoadmapModel>(
			ApiEndpoints.ROADMAPS,
			createRoadmapModel
		)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Hoja de Ruta',
					description: 'La hoja de ruta ha sido creada exitosamente',
				})

				handleFinish()
			})
			.catch(response.error)
			.finally(() => setLoading(false))
	}

	const getResults = useCallback(async () => {
		if (presets) {
			const setting: SettingModel = {
				firstStage: {
					startWaypoint: presets.firstStage.startWaypoint,
					endWaypoint: presets.firstStage.endWaypoint,
					startDateTime: convertToUTCISO(
						presets.firstStage.global.date,
						presets.firstStage.global.startTime
					),
					endDateTime: convertToUTCISO(
						presets.firstStage.global.date,
						presets.firstStage.global.endTime
					),
					fleetId: presets.firstStage.fleetId,
					driverId: presets.firstStage.driverId,
					vehicleId: presets.firstStage.vehicleId,
					modifiers: presets.firstStage.modifiers,
				},
				secondStage: {
					services: presets.secondStage.services.map(service => ({
						...service,
						duration: hhmmToSeconds(service.duration),
					})),
				},
				thirdStage: presets.thirdStage
					? {
							costProfile: presets.thirdStage.costProfile,
							costModel: presets.thirdStage.costModel
								? {
										costPerHour: presets.thirdStage.costModel.costPerHour,
										costPerKilometer:
											presets.thirdStage.costModel.costPerKilometer,
										costPerTraveledHour:
											presets.thirdStage.costModel.costPerTraveledHour,
										fixedCost: presets.thirdStage.costModel.fixedCost,
									}
								: undefined,
							bounds: presets.thirdStage.bounds
								? {
										routeDistanceLimit:
											presets.thirdStage.bounds.routeDistanceLimit,
										routeDurationLimit: presets.thirdStage.bounds
											.routeDurationLimit
											? hhmmToSeconds(
													presets.thirdStage.bounds.routeDurationLimit
												)
											: undefined,
										travelDurationLimit: presets.thirdStage.bounds
											.travelDurationLimit
											? hhmmToSeconds(
													presets.thirdStage.bounds.travelDurationLimit
												)
											: undefined,
									}
								: undefined,
						}
					: undefined,
			}

			setResultsLoading(true)

			await optimizeTours(setting)
				.then(response => {
					if ('error' in response) {
						throw new ApiError(response)
					}

					setResults({
						response,
					})

					setSetting(setting)
				})
				.catch(response.error)
				.finally(() => setResultsLoading(false))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		getResults()
	}, [getResults])

	return (
		<Form {...form}>
			<form
				id={Steps.RESULTS.toString()}
				onSubmit={form.handleSubmit(handleSubmit)}
				className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:px-2'>
				<h2 className='col-span-full text-base font-medium text-foreground sm:text-lg'>
					Resultados
				</h2>

				{results?.response && presets && (
					<>
						<FormField
							control={form.control}
							name='alias'
							render={({ field }) => (
								<FormItem className='max-w-72'>
									<FormLabel>Alias</FormLabel>
									<FormControl>
										<Input
											placeholder='Ingrese un alias para la hoja de ruta'
											aria-label='Alias de la hoja de rutas'
											aria-required='true'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Map
							className='col-span-full h-72 w-full'
							defaultCenter={{
								lat: presets.firstStage.startWaypoint.location.latitude,
								lng: presets.firstStage.startWaypoint.location.longitude,
							}}
							defaultZoom={12}
							disableDefaultUI={true}
							zoomControl={true}
							fullscreenControl={true}
							reuseMaps
							mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}>
							<Polyline encodedPolyline={results.response.encodedPolyline} />
							{presets.secondStage.services
								.filter(
									service => !results.response?.skipped.includes(service.id)
								)
								.map(service => (
									<AdvancedMarker
										key={service.id}
										position={{
											lat: service.waypoint.location.latitude,
											lng: service.waypoint.location.longitude,
										}}>
										<Pin
											background={'#f9802d'}
											borderColor={'#ac581f'}
											glyphColor={'#ffb92e'}
										/>
									</AdvancedMarker>
								))}

							<AdvancedMarker
								position={{
									lat: presets.firstStage.startWaypoint.location.latitude,
									lng: presets.firstStage.startWaypoint.location.longitude,
								}}
							/>

							<AdvancedMarker
								position={{
									lat: presets.firstStage.endWaypoint.location.latitude,
									lng: presets.firstStage.endWaypoint.location.longitude,
								}}
							/>
						</Map>
						<section className='col-span-full grid grid-cols-1 gap-4 font-secondary sm:grid-cols-2 sm:gap-6'>
							<dl>
								<dt className='text-base font-medium text-foreground'>
									Métricas
								</dt>
								<dd className='text-sm text-muted-foreground'>
									<dl className='grid grid-cols-2 gap-x-3 sm:grid-cols-[1fr_auto]'>
										<dt>Distancia total:</dt>
										<dd>
											{formatDistance(
												results.response.metrics.travelDistanceMeters
											)}
										</dd>
										<dt>Duración en visitas:</dt>
										<dd>
											{formatTime(results.response.metrics.visitDuration)}
										</dd>
										<dt>Duración en transito:</dt>
										<dd>
											{formatTime(results.response.metrics.travelDuration)}
										</dd>
										<dt>Servicios incluidos:</dt>
										<dd>{results.response.metrics.performedServiceCount}</dd>

										<dt>Servicios desestimados:</dt>
										<dd>{results.response.skipped.length}</dd>

										<dt>Costo fijo </dt>
										<dd>
											{results.response.metrics.totalFixedCost?.toFixed(2) ??
												'-'}
										</dd>

										<dt>Costo por hora:</dt>
										<dd>
											{results.response.metrics.totalCostPerHour?.toFixed(2) ??
												'-'}
										</dd>

										<dt>Costo por kilómetro:</dt>
										<dd>
											{results.response.metrics.totalCostPerKilometer?.toFixed(
												2
											) ?? '-'}
										</dd>

										<dt>Costo por hora de recorrida:</dt>
										<dd>
											{results.response.metrics.totalCostPerTraveledHour?.toFixed(
												2
											) ?? '-'}
										</dd>

										<dt>Costo total:</dt>
										<dd>
											{results.response.metrics.totalCost?.toFixed(2) ?? '-'}
										</dd>
									</dl>
								</dd>
							</dl>

							<section className='flex flex-col gap-4 sm:gap-6'>
								<dl>
									<dt className='text-base font-medium text-foreground'>
										Operación
									</dt>
									<dd>
										<dl className='grid grid-cols-2 gap-x-3 text-sm text-muted-foreground sm:grid-cols-[auto_1fr]'>
											<dt>Fecha:</dt>
											<dd>
												{format(results.response.startDateTime, 'PPP', {
													locale: es,
												})}
											</dd>
											<dt>Hora de inicio:</dt>
											<dd>{format(results.response.startDateTime, 'HH:mm')}</dd>
											<dt>Hora de fin:</dt>
											<dd>{format(results.response.endDateTime, 'HH:mm')}</dd>
										</dl>
									</dd>
								</dl>

								<dl>
									<dt className='text-base font-medium text-foreground'>
										Recursos
									</dt>
									<dd>
										{results.response.label.split(' - ').map((item, index) => {
											const [label, value] = item.split(':')

											return (
												<dl
													key={index}
													className='grid grid-cols-2 gap-x-3 text-sm text-muted-foreground sm:grid-cols-[0.6fr_1fr]'>
													<dt>{label}:</dt>
													<dd>{value}</dd>
												</dl>
											)
										})}
									</dd>
								</dl>
							</section>

							<section className='flex gap-2'>
								<ResponsiveSheet
									label='Visitas'
									title='Visitas'
									icon={<VisitsIcon className='size-4' />}
									description='Las visitas están representadas por los servicios a domicilio y métricas que se incluirán en la hoja de rutas.'
									triggerProps={{
										size: 'sm',
									}}>
									<Visits presets={presets} results={results} />
								</ResponsiveSheet>

								<ResponsiveSheet
									label='Transiciones'
									title='Transiciones'
									icon={<TransitionsIcon className='size-4' />}
									description='Las transiciones representan el tiempo y distancia que se recorrerá entre cada visita.'
									triggerProps={{
										size: 'sm',
									}}>
									<Transitions results={results} />
								</ResponsiveSheet>

								{results.response.skipped.length > 0 && (
									<ResponsiveSheet
										label='Omitidos'
										title='Omitidos'
										icon={<TaskErrorIcon className='size-4' />}
										description='Son los servicios desestimados y que no se incluirán en la hoja de rutas.'
										triggerProps={{
											size: 'sm',
										}}>
										<Omitted presets={presets} results={results} />
									</ResponsiveSheet>
								)}

								<ResponsiveSheet
									label='Configuración'
									title='Configuración'
									icon={<SettingsIcon className='size-4' />}
									description='En esta vista previa podrás ver las configuraciones establecidas para optimizar la hoja de rutas que has seleccionado.'
									triggerProps={{
										size: 'sm',
									}}>
									<Settings presets={presets} />
								</ResponsiveSheet>
							</section>
						</section>
					</>
				)}

				{resultsLoading && (
					<section className='col-span-full flex h-96 w-full flex-col items-center justify-center'>
						<p className='mb-6 text-lg font-medium text-foreground'>
							Generando optimización
						</p>
						<RiseLoader loading={resultsLoading} color='#f97316' />
					</section>
				)}
			</form>
		</Form>
	)
}

export default ResultsForm
