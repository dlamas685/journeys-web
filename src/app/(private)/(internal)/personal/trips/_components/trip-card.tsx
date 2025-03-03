'use client'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import ResponsiveSheet from '@/common/components/ui/overlay/responsive-sheet'
import { UPDATE_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { CircleX, Pencil, Save, SquareChartGantt, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { forwardRef, Ref, type ReactNode } from 'react'
import Criteria from '../../optimization/_components/criteria'
import { TRIP_CONDITIONS } from '../_constants'
import { TripModel } from '../_models'
import { toPresets } from '../_utils'

type Props = {
	record: TripModel
	updaterForm: ReactNode
}

const TripCard = forwardRef(
	({ record, updaterForm }: Readonly<Props>, ref: Ref<HTMLDivElement>) => {
		const presets = toPresets(record.criteria)

		return (
			<Card
				ref={ref}
				className='flex flex-col gap-4 border-none p-4 shadow-bento'>
				<CardHeader className='flex flex-row items-center justify-between p-0'>
					<CardTitle className='font-secondary text-sm capitalize'>
						{record.code}
					</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-grow flex-col justify-between gap-5 p-0'>
					<dl className='text-sm text-muted-foreground'>
						<dt className='font-medium'>Origen</dt>
						<dd>{record.origin}</dd>

						<dt className='mt-2 font-medium'>Destino</dt>
						<dd>{record.destination}</dd>

						<dt className='mt-2 font-medium'>Fecha de salida</dt>
						<dd>{format(record.departureTime, 'PPP', { locale: es })}</dd>

						<dt className='mt-2 font-medium'>Hora de salida</dt>
						<dd>{format(record.departureTime, 'p', { locale: es })}</dd>

						<dt className='mt-2 font-medium'>Condición</dt>
						<dd className='mt-1'>
							<Badge
								className={
									TRIP_CONDITIONS[record.isArchived.toString()].className
								}>
								{record.isArchived ? 'Usado' : 'Listo para usar'}
							</Badge>
						</dd>
					</dl>

					<section className='flex flex-col gap-2'>
						{!record.isArchived ? (
							<Button variant='link' asChild>
								<Link href={`${Pathnames.TRIPS}/${record.id}`}>
									Guía de viaje
								</Link>
							</Button>
						) : (
							<Modal
								title={`Estadísticas de ${record.code}`}
								description='Visualiza las estadísticas generadas como resultado de haber completado el viaje.'
								triggerProps={{
									type: 'button',
									variant: 'link',
									'aria-label': `Estadísticas de la guía viaje ${record.code}`,
									'aria-disabled': false,
								}}
								triggerLabel='Estadísticas'
								isReadonly>
								<>
									Lorem ipsum dolor, sit amet consectetur adipisicing elit.
									Sint.
								</>
							</Modal>
						)}

						<ResponsiveSheet
							title='Criterios de optimización'
							description='Criterios que se han seleccionado y aplicado en la optimización.'
							label='Todos los criterios'
							icon={<SquareChartGantt className='size-4' />}
							triggerProps={{
								size: 'sm',
							}}>
							<Criteria presets={presets} />
						</ResponsiveSheet>
					</section>
				</CardContent>
				<CardFooter className='grid grid-cols-2 gap-2 p-0'>
					<Modal
						title='Editar Viaje'
						description='Modifica los datos del viaje.'
						triggerIcon={<Pencil className='mr-1 size-3.5' />}
						triggerProps={{
							type: 'button',
							variant: 'editing',
							'aria-label': `Editar el registro ${record.code}`,
							'aria-disabled': false,
						}}
						triggerLabel='Editar'
						submitLabel='Guardar'
						submitIcon={<Save className='mr-1 size-4' />}
						submitProps={{
							form: UPDATE_FORM_ID,
							'aria-label': `Guardar el registro ${record.code}`,
							'aria-disabled': false,
						}}>
						{updaterForm}
					</Modal>

					<RemovalAlert
						triggerLabel='Eliminar'
						triggerIcon={<Trash2 className='mr-1 size-3.5' />}
						triggerProps={{
							type: 'button',
							'aria-label': `Eliminar el registro ${record.code}`,
							'aria-disabled': false,
						}}
						cancelIcon={<CircleX className='mr-1 size-4' />}
						description={
							<>
								¿Estás seguro de que deseas eliminar el viaje{' '}
								<b className='capitalize'>{record.code}</b>? Esta acción no se
								puede deshacer.
							</>
						}
						eraserButton={({ setOpen }) => (
							<EraserButton
								recordId={record.id}
								endpoint={ApiEndpoints.ACTIVITY_TEMPLATES}
								setAlertOpen={setOpen}
								title='Viajes'
								description='Viaje eliminado correctamente.'
								aria-label={`Confirmar eliminación de ${record.code}`}
								aria-disabled={false}
								type='button'
							/>
						)}
					/>
				</CardFooter>
			</Card>
		)
	}
)

TripCard.displayName = 'TripCard'

export default motion.create(TripCard)
