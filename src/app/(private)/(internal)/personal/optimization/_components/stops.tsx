import SeeMore from '@/common/components/ui/misc/see-more'
import { formatTime } from '@/common/utils'
import { RouteModel } from '../_models'

type Props = {
	route: RouteModel
}

const Stops = ({ route }: Readonly<Props>) => (
	<ul
		role='list'
		className='flex max-h-96 flex-col gap-3 overflow-auto px-4 font-secondary text-sm text-muted-foreground sm:mt-2 sm:max-h-[inherit] sm:px-0'>
		{route.stops.map((stop, index) => (
			<li role='listitem' key={stop.placeId} className='flex flex-col gap-1'>
				<span className='font-medium text-foreground underline'>
					Parada #{index + 1}
				</span>
				<ul role='list'>
					<li role='listitem'>Dirección: {stop.address}</li>
					<li role='listitem'>Duración: {formatTime(stop.duration)}</li>
					<li role='listitem'>
						Actividades incluidas:
						<ul
							role='list'
							className='list-disc space-y-2 pl-6 font-secondary text-muted-foreground'>
							{stop.activities.map(activity => (
								<li role='listitem' key={activity.id}>
									<p>Nombre: {activity.name}</p>
									<SeeMore>{`Descripción: ${activity.description}`}</SeeMore>
									<p>Duración: {formatTime(activity.duration)}</p>
								</li>
							))}
						</ul>
					</li>
				</ul>
			</li>
		))}
	</ul>
)

export default Stops
