import { formatTime } from '@/common/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PresetsModel, ResultsModel } from '../_models'

type Props = {
	presets: PresetsModel
	results: ResultsModel
}

const Visits = ({ presets, results }: Readonly<Props>) => {
	return (
		<ul
			role='list'
			className='flex max-h-96 flex-col gap-3 overflow-auto px-4 font-secondary text-sm text-muted-foreground sm:mt-2 sm:max-h-[inherit] sm:px-0'>
			{results.response?.visits.map((visit, index) => {
				const address = presets.secondStage.services.find(
					service => service.id === visit.visitId
				)?.waypoint.address

				return (
					<li
						role='listitem'
						key={visit.visitId}
						className='flex flex-col gap-1'>
						<span className='font-medium text-foreground underline'>
							Visita #{index + 1}
						</span>
						<ul role='list'>
							<li role='listitem'>Servicio: {visit.visitName}</li>
							<li role='listitem'>
								Fecha de inicio:{' '}
								{format(visit.startDateTime, 'PPP', { locale: es })}
							</li>
							<li role='listitem'>
								Hora de inicio: {format(visit.startDateTime, 'HH:mm')}
							</li>
							<li role='listitem'>Dirección: {address}</li>
							<li role='listitem'>
								Desvió:{' '}
								{visit.detour !== 0
									? formatTime(visit.detour)
									: 'No registrado'}
							</li>

							<li role='listitem'>
								Duración: {formatTime(visit.visitDuration)}
							</li>
						</ul>
					</li>
				)
			})}
		</ul>
	)
}

export default Visits
