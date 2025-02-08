import SeeMore from '@/common/components/ui/misc/see-more'
import { useDependenciesContext } from '@/common/hooks/use-dependencies-context'
import { formatDistance } from '@/common/utils'
import { formatHHMM } from '@/common/utils/format-hhmm.util'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CostProfile } from '../_enums'
import { CostProfileModel, PresetsModel } from '../_models'

type Props = {
	presets: PresetsModel
}

const Settings = ({ presets }: Readonly<Props>) => {
	const { dependencies } = useDependenciesContext()

	const costProfiles = dependencies?.costProfiles as CostProfileModel[]

	const costProfile = costProfiles.find(
		costProfile => costProfile.id === presets.thirdStage?.costProfile
	)

	return (
		<section className='sm:overflow-[inherit] flex max-h-96 flex-col gap-4 overflow-auto px-4 sm:mt-2 sm:max-h-[inherit] sm:px-0'>
			<article className='flex flex-col gap-2 font-secondary'>
				<h2 className='text-base font-semibold text-foreground'>
					Primera Etapa
				</h2>

				<dl className='grid grid-cols-[0.5fr_1fr] text-sm text-muted-foreground sm:grid-cols-[0.3fr_1fr] sm:gap-x-6 sm:gap-y-2'>
					<dt>Ubicación inicial:</dt>
					<dd>{presets.firstStage.startWaypoint.address}</dd>

					<dt>Ubicación final:</dt>
					<dd>{presets.firstStage.endWaypoint.address}</dd>

					<dt>Fecha de inicio:</dt>
					<dd>
						{format(new Date(presets.firstStage.global.date), 'PPP', {
							locale: es,
						})}
					</dd>

					<dt>Hora de inicio:</dt>
					<dd>{presets.firstStage.global.startTime}</dd>

					<dt>Hora de fin:</dt>
					<dd>{presets.firstStage.global.endTime}</dd>

					<dt>Flota:</dt>
					<dd>No completado</dd>

					<dt>Vehículo:</dt>
					<dd>No completado</dd>

					<dt>Conductor:</dt>
					<dd>No completado</dd>

					<dt>Otras consideraciones:</dt>
					<dd>
						<ul role='list'>
							<li>
								Evitar peajes:{' '}
								{presets.firstStage.modifiers?.avoidTolls ? 'Sí' : 'No'}
							</li>
							<li>
								Evitar autopistas:{' '}
								{presets.firstStage.modifiers?.avoidHighways ? 'Sí' : 'No'}
							</li>
							<li>
								Evitar transbordadores:{' '}
								{presets.firstStage.modifiers?.avoidFerries ? 'Sí' : 'No'}
							</li>

							<li>
								Considerar tráfico:{' '}
								{presets.firstStage.modifiers?.avoidFerries ? 'Sí' : 'No'}
							</li>
						</ul>
					</dd>
				</dl>
			</article>

			<article className='flex flex-col gap-2 font-secondary'>
				<h2 className='text-base font-semibold text-foreground'>
					Segunda Etapa
				</h2>

				<section className='grid grid-cols-[0.5fr_1fr] text-sm text-muted-foreground sm:grid-cols-[0.3fr_1fr] sm:gap-x-6 sm:gap-y-2'>
					<h3>Servicios a domicilio:</h3>
					<ul role='list' className='flex flex-col gap-3'>
						{presets.secondStage.services.map((service, index) => (
							<li
								role='listitem'
								key={service.id}
								className='flex flex-col gap-1'>
								<span className='underline'>Servicio #{index + 1}</span>
								<ul role='list'>
									<li role='listitem'>Nombre: {service.name}</li>
									<li role='listitem'>
										<SeeMore lines={4}>
											{`Descripción: ${service.description}`}
										</SeeMore>
									</li>
									<li role='listitem'>Ubicación: {service.waypoint.address}</li>
									<li role='listitem'>
										Duración: {formatHHMM(service.duration)}
									</li>
								</ul>
							</li>
						))}
					</ul>
				</section>
			</article>

			{presets.thirdStage && (
				<article className='flex flex-col gap-2 font-secondary text-sm text-muted-foreground'>
					<h2 className='text-base font-semibold text-foreground'>
						Tercera Etapa
					</h2>

					<dl className='grid grid-cols-[0.5fr_1fr] sm:grid-cols-[0.3fr_1fr] sm:gap-x-6 sm:gap-y-2'>
						<dt>Perfil de costo:</dt>
						<dd>
							<p>Los valores de los costos representan unidades relativas.</p>

							<dl className='grid grid-cols-2'>
								<dt>Nombre:</dt>
								<dd>{costProfile?.name}</dd>

								<dt>Descripción:</dt>
								<dd>{costProfile?.description}</dd>

								<dt>Costo fijo (CF):</dt>
								<dd>
									{presets.thirdStage.costProfile ===
									CostProfile.optimized_custom
										? (presets.thirdStage.costModel?.fixedCost ?? '-')
										: costProfile?.fixedCost}
								</dd>

								<dt>Costo por kilómetro (CPK):</dt>
								<dd>
									{presets.thirdStage.costProfile ===
									CostProfile.optimized_custom
										? (presets.thirdStage.costModel?.costPerKilometer ?? '-')
										: costProfile?.costPerKilometer}
								</dd>

								<dt>Costo por hora (CPH):</dt>
								<dd>
									{presets.thirdStage.costProfile ===
									CostProfile.optimized_custom
										? (presets.thirdStage.costModel?.costPerHour ?? '-')
										: costProfile?.costPerHour}
								</dd>

								<dt>Costo por hora recorrida (CPHR):</dt>
								<dd>
									{presets.thirdStage.costProfile ===
									CostProfile.optimized_custom
										? (presets.thirdStage.costModel?.costPerTraveledHour ?? '-')
										: costProfile?.costPerTraveledHour}
								</dd>

								<dt>Multiplicador de tiempo de tránsito:</dt>
								<dd>
									{presets.thirdStage.costProfile ===
									CostProfile.optimized_custom
										? (presets.thirdStage.costModel?.travelDurationMultiple?.at(
												0
											) ?? '1')
										: costProfile?.travelDurationMultiple}
								</dd>
							</dl>
						</dd>
					</dl>

					{presets.thirdStage.bounds && (
						<dl className='grid grid-cols-[0.5fr_1fr] sm:grid-cols-[0.3fr_1fr] sm:gap-x-6 sm:gap-y-2'>
							<dt>Límites:</dt>
							<dd>
								<dl className='grid grid-cols-2'>
									<dt>Duración total:</dt>
									<dd>
										{presets.thirdStage.bounds.routeDurationLimit
											? formatHHMM(presets.thirdStage.bounds.routeDurationLimit)
											: '-'}
									</dd>

									<dt>Duración en transito:</dt>
									<dd>
										{presets.thirdStage.bounds.travelDurationLimit
											? formatHHMM(
													presets.thirdStage.bounds.travelDurationLimit
												)
											: '-'}
									</dd>

									<dt>Distancia total:</dt>
									<dd>
										{presets.thirdStage.bounds.routeDistanceLimit
											? formatDistance(
													presets.thirdStage.bounds.routeDistanceLimit
												)
											: '-'}
									</dd>
								</dl>
							</dd>
						</dl>
					)}
				</article>
			)}
		</section>
	)
}

export default Settings
