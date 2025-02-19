import { formatTime, hhmmToSeconds } from '@/common/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
	EXTRA_COMPUTATIONS,
	REFERENCE_ROUTES,
	ROUTING_PREFERENCES,
	TRAFFIC_MODELS,
	TRAVEL_MODES,
} from '../_constants'
import {
	ReferenceRoute,
	TrafficModel,
	TrafficOption,
	TravelMode,
} from '../_enums'
import { PresetsModel } from '../_models'

type Props = {
	presets: PresetsModel
}

const Criteria = ({ presets }: Readonly<Props>) => {
	return (
		<section className='sm:overflow-[inherit] flex max-h-96 flex-col gap-4 overflow-auto px-4 sm:mt-2 sm:max-h-[inherit] sm:px-0'>
			<article className='flex flex-col gap-2 font-secondary'>
				<h2 className='text-base font-semibold text-foreground'>Básicos</h2>

				<dl className='grid grid-cols-[0.5fr_1fr] gap-x-6 gap-y-2 text-sm text-muted-foreground'>
					<dt>Origen:</dt>
					<dd>{presets.basic.origin?.address}</dd>

					<dt>Destino:</dt>
					<dd>{presets.basic.destination?.address}</dd>

					<dt>Fecha de salida:</dt>
					<dd>
						{format(new Date(presets.basic.departure.date), 'PPP', {
							locale: es,
						})}
					</dd>

					<dt>Hora de salida:</dt>
					<dd>{presets.basic.departure.time}</dd>

					<dt>Puntos de interés:</dt>
					<dd>
						{presets.basic.interestPoints &&
						presets.basic.interestPoints.length > 0 ? (
							<ul role='list'>
								{presets.basic.interestPoints?.map(interestPoint => (
									<li key={interestPoint.placeId}>{interestPoint.address}</li>
								))}
							</ul>
						) : (
							'-'
						)}
					</dd>

					<dt>Tipo de vehículo:</dt>
					<dd>{TRAVEL_MODES[presets.basic.travelMode as TravelMode]}</dd>

					<dt>Consideraciones de tráfico:</dt>
					<dd>
						{ROUTING_PREFERENCES[presets.basic.trafficOption as TrafficOption]}
					</dd>

					<dt>Otras consideraciones:</dt>
					<dd>
						<ul role='list'>
							<li>
								Evitar peajes:{' '}
								{presets.basic.modifiers?.avoidTolls ? 'Sí' : 'No'}
							</li>
							<li>
								Evitar autopistas:{' '}
								{presets.basic.modifiers?.avoidHighways ? 'Sí' : 'No'}
							</li>
							<li>
								Evitar transbordadores:{' '}
								{presets.basic.modifiers?.avoidFerries ? 'Sí' : 'No'}
							</li>
						</ul>
					</dd>
				</dl>
			</article>

			{presets.advanced && (
				<article className='flex flex-col gap-2 font-secondary'>
					<h2 className='text-base font-semibold text-foreground'>Avanzados</h2>

					<dl className='grid grid-cols-[0.5fr_1fr] gap-x-6 gap-y-2 text-sm text-muted-foreground'>
						<dt>Cálculos adicionales:</dt>
						<dd>
							<ul role='list'>
								{presets.advanced.extraComputations?.map(extraComputation => (
									<li key={extraComputation}>
										{EXTRA_COMPUTATIONS[extraComputation]}
									</li>
								))}
							</ul>
						</dd>

						<dt>Modelo de tráfico:</dt>
						<dd>
							{presets.advanced.trafficModel &&
							presets.basic.travelMode === TravelMode.DRIVE &&
							presets.basic.trafficOption ===
								TrafficOption.TRAFFIC_AWARE_OPTIMAL
								? TRAFFIC_MODELS[presets.advanced.trafficModel as TrafficModel]
								: 'No compatible'}
						</dd>

						<dt>Ruta de referencia:</dt>
						<dd>
							{presets.advanced.interestPoints?.length === 0
								? presets.advanced.requestedReferenceRoutes
									? REFERENCE_ROUTES[ReferenceRoute.SHORTER_DISTANCE]
									: 'No'
								: 'No compatible'}
						</dd>

						<dt>Rutas alternativas:</dt>
						<dd>
							{presets.advanced.interestPoints?.length === 0
								? presets.advanced.computeAlternativeRoutes
									? 'Sí'
									: 'No'
								: 'No compatible'}
						</dd>

						{presets.advanced.interestPoints && (
							<>
								<dt>Paradas:</dt>
								<dd>
									{presets.advanced.interestPoints &&
									presets.advanced.interestPoints.length > 0 &&
									presets.advanced.interestPoints.some(
										interestPoint => interestPoint.vehicleStopover
									) ? (
										<ul role='list'>
											{presets.advanced.interestPoints
												.filter(interestPoint => interestPoint.vehicleStopover)
												.map(interestPoint => (
													<li role='listitem' key={interestPoint.placeId}>
														{interestPoint.address} (
														{interestPoint.activities &&
															formatTime(
																interestPoint.activities.reduce(
																	(acc, activity) =>
																		acc + hhmmToSeconds(activity.duration),
																	0
																)
															)}
														)
													</li>
												))}
										</ul>
									) : (
										'-'
									)}
								</dd>

								<dt>De Paso:</dt>
								<dd>
									{presets.advanced.interestPoints &&
									presets.advanced.interestPoints.length > 0 &&
									presets.advanced.interestPoints.some(
										interestPoint => !interestPoint.vehicleStopover
									) ? (
										<ul role='list'>
											{presets.advanced.interestPoints
												.filter(interestPoint => !interestPoint.vehicleStopover)
												.map(interestPoint => (
													<li role='listitem' key={interestPoint.placeId}>
														{interestPoint.address}
													</li>
												))}
										</ul>
									) : (
										'-'
									)}
								</dd>
							</>
						)}
					</dl>
				</article>
			)}
		</section>
	)
}

export default Criteria
