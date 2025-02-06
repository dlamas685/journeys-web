import SeeMore from '@/common/components/ui/misc/see-more'
import { formatTimeShort } from '@/common/utils'
import { PresetsModel, ResultsModel } from '../_models'

type Props = {
	presets: PresetsModel
	results: ResultsModel
}

const Omitted = ({ presets, results }: Readonly<Props>) => {
	return (
		<ul
			role='list'
			className='flex max-h-96 flex-col gap-3 overflow-auto px-4 font-secondary text-sm text-muted-foreground sm:mt-2 sm:max-h-[inherit] sm:px-0'>
			{presets.secondStage.services
				.filter(service => results.response?.skipped.includes(service.id))
				.map((service, index) => (
					<li role='listitem' key={service.id} className='flex flex-col gap-1'>
						<span className='font-medium text-foreground underline'>
							Servicio #{index + 1}
						</span>
						<ul role='list'>
							<li role='listitem'>Nombre: {service.name}</li>
							<li role='listitem'>
								<SeeMore
									lines={4}>{`Descripción: ${service.description}`}</SeeMore>
							</li>
							<li role='listitem'>Ubicación: {service.waypoint.address}</li>
							<li role='listitem'>
								Duración: {formatTimeShort(service.duration)}
							</li>
						</ul>
					</li>
				))}
		</ul>
	)
}

export default Omitted
