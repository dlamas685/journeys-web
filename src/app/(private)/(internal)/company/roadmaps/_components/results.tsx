'use client'
import Polyline from '@/common/components/ui/google/fragments/polyline'
import TaskErrorIcon from '@/common/components/ui/icons/task-error-icon'
import TransitionsIcon from '@/common/components/ui/icons/transitions-icon'
import VisitsIcon from '@/common/components/ui/icons/visits-icon'
import ResponsiveSheet from '@/common/components/ui/overlay/responsive-sheet'
import { formatDistance, formatTime } from '@/common/utils'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SettingsIcon } from 'lucide-react'
import Omitted from '../../optimization/_components/omitted'
import Settings from '../../optimization/_components/settings'
import Transitions from '../../optimization/_components/transitions'
import Visits from '../../optimization/_components/visits'
import {
	RoadmapOptimizationModel,
	SettingModel,
} from '../../optimization/_models'
import { toPresets } from '../_utils'

type Props = {
	setting: SettingModel
	results: RoadmapOptimizationModel
}

const Results = ({ results, setting }: Readonly<Props>) => {
	const presets = toPresets(setting)

	return (
		<section className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6'>
			<Map
				className='col-span-full h-72 w-full'
				defaultCenter={{
					lat: setting.firstStage.startWaypoint.location.latitude,
					lng: setting.firstStage.startWaypoint.location.longitude,
				}}
				defaultZoom={12}
				disableDefaultUI={true}
				zoomControl={true}
				fullscreenControl={true}
				reuseMaps
				mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}>
				<Polyline encodedPolyline={results.encodedPolyline} />
				{presets.secondStage.services
					.filter(service => !results.skipped.includes(service.id))
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
					<dt className='text-base font-medium text-foreground'>Métricas</dt>
					<dd className='text-sm text-muted-foreground'>
						<dl className='grid grid-cols-2 gap-x-3 sm:grid-cols-[1fr_auto]'>
							<dt>Distancia total:</dt>
							<dd>{formatDistance(results.metrics.travelDistanceMeters)}</dd>
							<dt>Duración en visitas:</dt>
							<dd>{formatTime(results.metrics.visitDuration)}</dd>
							<dt>Duración en transito:</dt>
							<dd>{formatTime(results.metrics.travelDuration)}</dd>
							<dt>Servicios incluidos:</dt>
							<dd>{results.metrics.performedServiceCount}</dd>

							<dt>Servicios desestimados:</dt>
							<dd>{results.skipped.length}</dd>

							<dt>Costo fijo </dt>
							<dd>{results.metrics.totalFixedCost?.toFixed(2) ?? '-'}</dd>

							<dt>Costo por hora:</dt>
							<dd>{results.metrics.totalCostPerHour?.toFixed(2) ?? '-'}</dd>

							<dt>Costo por kilómetro:</dt>
							<dd>
								{results.metrics.totalCostPerKilometer?.toFixed(2) ?? '-'}
							</dd>

							<dt>Costo por hora de recorrida:</dt>
							<dd>
								{results.metrics.totalCostPerTraveledHour?.toFixed(2) ?? '-'}
							</dd>

							<dt>Costo total:</dt>
							<dd>{results.metrics.totalCost?.toFixed(2) ?? '-'}</dd>
						</dl>
					</dd>
				</dl>

				<section className='flex flex-col gap-4 sm:gap-6'>
					<dl>
						<dt className='text-base font-medium text-foreground'>Operación</dt>
						<dd>
							<dl className='grid grid-cols-2 gap-x-3 text-sm text-muted-foreground sm:grid-cols-[auto_1fr]'>
								<dt>Fecha:</dt>
								<dd>
									{format(results.startDateTime, 'PPP', {
										locale: es,
									})}
								</dd>
								<dt>Hora de inicio:</dt>
								<dd>{format(results.startDateTime, 'HH:mm')}</dd>
								<dt>Hora de fin:</dt>
								<dd>{format(results.endDateTime, 'HH:mm')}</dd>
							</dl>
						</dd>
					</dl>

					<dl>
						<dt className='text-base font-medium text-foreground'>Recursos</dt>
						<dd>
							{results.label.split(' - ').map((item, index) => {
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
						<Visits presets={presets} results={{ response: results }} />
					</ResponsiveSheet>

					<ResponsiveSheet
						label='Transiciones'
						title='Transiciones'
						icon={<TransitionsIcon className='size-4' />}
						description='Las transiciones representan el tiempo y distancia que se recorrerá entre cada visita.'
						triggerProps={{
							size: 'sm',
						}}>
						<Transitions results={{ response: results }} />
					</ResponsiveSheet>

					{results.skipped.length > 0 && (
						<ResponsiveSheet
							label='Omitidos'
							title='Omitidos'
							icon={<TaskErrorIcon className='size-4' />}
							description='Son los servicios desestimados y que no se incluirán en la hoja de rutas.'
							triggerProps={{
								size: 'sm',
							}}>
							<Omitted presets={presets} results={{ response: results }} />
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
		</section>
	)
}

export default Results
