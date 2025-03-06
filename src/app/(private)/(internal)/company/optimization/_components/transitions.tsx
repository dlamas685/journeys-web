import { formatDistance, formatTime } from '@/common/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ResultsModel } from '../_models'

type Props = {
	results: ResultsModel
}

const Transitions = ({ results }: Readonly<Props>) => {
	return (
		<ul
			role='list'
			className='flex max-h-96 flex-col gap-3 overflow-auto px-4 font-secondary text-sm text-muted-foreground sm:mt-2 sm:max-h-[inherit] sm:px-0'>
			{results.response?.transitions.map((transition, index) => {
				return (
					<li role='listitem' key={index} className='flex flex-col gap-1'>
						<span className='font-medium text-foreground underline'>
							Transición #{index + 1}
						</span>
						<ul role='list'>
							<li role='listitem'>
								Fecha de inicio:{' '}
								{format(transition.startDateTime, 'PPP', { locale: es })}
							</li>
							<li role='listitem'>
								Hora de inicio: {format(transition.startDateTime, 'HH:mm')}
							</li>
							<li role='listitem'>
								Distancia de transito:{' '}
								{formatDistance(transition.travelDistanceMeters)}
							</li>
							<li role='listitem'>
								Duración de transito: {formatTime(transition.travelDuration)}
							</li>
							<li role='listitem'>
								Duración total: {formatTime(transition.totalDuration)}
							</li>
						</ul>
					</li>
				)
			})}
		</ul>
	)
}

export default Transitions
