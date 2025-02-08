'use client'
import { ApiError } from '@/common/classes/api-error.class'
import Polyline from '@/common/components/ui/google/fragments/polyline'
import TaskErrorIcon from '@/common/components/ui/icons/task-error-icon'
import TransitionsIcon from '@/common/components/ui/icons/transitions-icon'
import VisitsIcon from '@/common/components/ui/icons/visits-icon'
import ResponsiveSheet from '@/common/components/ui/overlay/responsive-sheet'
import { MAP_CENTER } from '@/common/constants'
import useResponse from '@/common/hooks/use-response'
import {
	convertToUTCISO,
	formatDistance,
	formatTime,
	hhmmToSeconds,
} from '@/common/utils'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SettingsIcon } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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

	const form = useForm<ResultsFormSchema>({
		resolver: zodResolver(resultsFormSchema),
		defaultValues: {},
	})

	const handleSubmit = (values: ResultsFormSchema) => {}

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

			await optimizeTours(setting)
				.then(response => {
					if ('error' in response) {
						throw new ApiError(response)
					}

					setResults({
						response,
					})
				})
				.catch(response.error)
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
						<Map
							className='col-span-full h-72 w-full'
							defaultCenter={MAP_CENTER}
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
			</form>
		</Form>
	)
}

export default ResultsForm
