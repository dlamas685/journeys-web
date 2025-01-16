'use client'

import { useMediaQuery } from '@/common/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { SquareChartGantt } from 'lucide-react'
import { useState } from 'react'
import { ROUTING_PREFERENCES, TRAVEL_MODES } from '../_constants'
import { RoutingPreference, TravelMode } from '../_enums'
import { PresetsModel } from '../_models'

type Props = {
	presets: PresetsModel
	label: string
	title: string
	description: string
}

const OptimizationPreview = ({
	presets,
	label,
	title,
	description,
}: Readonly<Props>) => {
	const [open, setOpen] = useState<boolean>(false)
	const isDesktop = useMediaQuery('(min-width: 640px)')

	if (isDesktop) {
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button type='button'>
						<SquareChartGantt className='mr-1 size-4' />
						{label}
					</Button>
				</SheetTrigger>
				<SheetContent className='sm:max-w-2xl'>
					<SheetHeader>
						<SheetTitle>{title}</SheetTitle>
						<SheetDescription>{description}</SheetDescription>
					</SheetHeader>

					<section className='mt-2 flex flex-col gap-4'>
						<article className='font-secondary'>
							<h2 className='text-base font-semibold text-foreground'>
								Básicos
							</h2>

							<dl className='grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm text-muted-foreground'>
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
									<ul role='list'>
										{presets.basic.intermediates?.map(intermediate => (
											<li key={intermediate.placeId}>{intermediate.address}</li>
										))}
									</ul>
								</dd>

								<dt>Tipo de vehículo:</dt>
								<dd>{TRAVEL_MODES[presets.basic.travelMode as TravelMode]}</dd>

								<dt>Consideraciones de tráfico:</dt>
								<dd>
									{
										ROUTING_PREFERENCES[
											presets.basic.routingPreference as RoutingPreference
										]
									}
								</dd>

								<dt>Otras consideraciones:</dt>
								<dd>
									<ul role='list'>
										<li>
											Evitar peajes:{' '}
											{presets.basic.routeModifiers?.avoidTolls ? 'Sí' : 'No'}
										</li>
										<li>
											Evitar autopistas:{' '}
											{presets.basic.routeModifiers?.avoidHighways
												? 'Sí'
												: 'No'}
										</li>
										<li>
											Evitar transbordadores:{' '}
											{presets.basic.routeModifiers?.avoidFerries ? 'Sí' : 'No'}
										</li>
									</ul>
								</dd>
							</dl>
						</article>
					</section>
				</SheetContent>
			</Sheet>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button type='button'>
					<SquareChartGantt className='mr-1 size-4' />
					{label}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	)
}

export default OptimizationPreview
