'use client'
import { update } from '@/common/actions/crud.action'
import { ApiError } from '@/common/classes/api-error.class'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import ResponsiveSheet from '@/common/components/ui/overlay/responsive-sheet'
import { REPLICATE_FORM_ID, UPDATE_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import {
	Archive,
	CheckCircle2,
	CircleCheck,
	CircleX,
	LoaderCircle,
	Pencil,
	Save,
	SquareChartGantt,
	Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { forwardRef, Ref, useState, type ReactNode } from 'react'
import Criteria from '../../optimization/_components/criteria'
import Results from '../[id]/_components/results'
import { TRIP_CONDITIONS } from '../_constants'
import { TripModel } from '../_models'
import { UpdateTripModel } from '../_models/update-trip.model'
import { toPresets } from '../_utils'
import ReplicationForm from './replication-form'

type Props = {
	record: TripModel
	updaterForm: ReactNode
}

const TripCard = forwardRef(
	({ record, updaterForm }: Readonly<Props>, ref: Ref<HTMLDivElement>) => {
		const presets = toPresets(record.criteria)
		const isLoading = useLoading(state => state.loading)
		const setLoading = useLoading(state => state.setLoading)
		const response = useResponse()
		const [open, setOpen] = useState<boolean>(false)
		const currentDate = new Date()
		const departureTime = new Date(record.departureTime)

		const handleToArchive = async () => {
			setLoading(true)

			await update<UpdateTripModel, TripModel>(ApiEndpoints.TRIPS, record.id, {
				isArchived: true,
			})
				.then(resp => {
					if ('error' in resp) {
						throw new ApiError(resp)
					}

					response.success({
						title: 'Viajes',
						description: 'Viaje marcado como usado correctamente.',
					})

					setOpen(false)
				})
				.catch(response.error)
				.finally(() => setLoading(false))
		}

		return (
			<Card
				ref={ref}
				className='flex flex-col gap-4 border-none p-4 shadow-bento'>
				<CardHeader className='flex flex-row items-center justify-between p-0'>
					<CardTitle className='font-secondary text-sm capitalize'>
						{record.code}
					</CardTitle>
					{!record.isArchived && currentDate > departureTime && (
						<AlertDialog open={open} onOpenChange={setOpen}>
							<AlertDialogTrigger asChild>
								<Archive className='size-4 cursor-pointer' />
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Confirmar cambio de condición
									</AlertDialogTitle>
									<AlertDialogDescription>
										¿Estás seguro de que deseas marcar como usado el viaje{' '}
										<b>{record.code}</b>? Una vez marcado como usado, no se
										podrá regresar a su condición anterior.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										<CircleX className='mr-1 size-4' />
										Cancelar
									</AlertDialogCancel>
									<Button onClick={handleToArchive}>
										{isLoading ? (
											<LoaderCircle className='mr-1 size-4 animate-spin' />
										) : (
											<CircleCheck className='mr-1 size-4' />
										)}
										Confirmar
									</Button>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</CardHeader>
				<CardContent className='flex flex-grow flex-col justify-between gap-5 p-0'>
					<dl className='text-sm text-muted-foreground'>
						<dt className='font-medium'>Origen</dt>
						<dd>{record.criteria.basicCriteria.origin.address}</dd>

						<dt className='mt-2 font-medium'>Destino</dt>
						<dd>{record.criteria.basicCriteria.destination.address}</dd>

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
						{record.isArchived &&
							(record.results ? (
								<>
									<Modal
										title={`Resultados de ${record.code}`}
										description='Visualiza los resultados de la guía de viaje.'
										triggerProps={{
											type: 'button',
											variant: 'link',
											'aria-label': `Resultados de la guía viaje ${record.code}`,
											'aria-disabled': false,
										}}
										triggerLabel='Resultados'
										isReadonly>
										<Results
											className='sm:overflow-[inherit] max-h-96 overflow-auto px-4 pb-2 sm:max-h-[inherit] sm:grid-cols-1 sm:px-0 sm:pb-0'
											criteria={record.criteria}
											routes={record.results}
										/>
									</Modal>
									<p className='text-center font-secondary text-sm text-muted-foreground'>
										Enhorabuena! Has completado el viaje y ahora puedes{' '}
										<Modal
											title={`Replica el viaje ${record.code}`}
											description='Establece  el alias y la nueva fecha de salida para replicar el viaje.'
											triggerProps={{
												type: 'button',
												variant: 'link',
												'aria-label': `Replica el viaje ${record.code}`,
												'aria-disabled': false,
												className: 'p-0',
											}}
											triggerLabel='replicarlo'
											submitLabel='Listo'
											submitIcon={<CheckCircle2 className='mr-1 size-4' />}
											submitProps={{
												form: REPLICATE_FORM_ID,
											}}>
											<ReplicationForm record={record} />
										</Modal>
									</p>
								</>
							) : (
								<p className='text-center font-secondary text-sm text-muted-foreground'>
									Oops! No hemos encontrado los resultados por algún motivo{' '}
									<Modal
										title={`Replica el viaje ${record.code}`}
										description='Establece  el alias y la nueva fecha de salida para replicar el viaje.'
										triggerProps={{
											type: 'button',
											variant: 'link',
											'aria-label': `Replica el viaje ${record.code}`,
											'aria-disabled': false,
											className: 'p-0',
										}}
										triggerLabel='replicar viaje'
										submitLabel='Listo'
										submitIcon={<CheckCircle2 className='mr-1 size-4' />}
										submitProps={{
											form: REPLICATE_FORM_ID,
										}}>
										<ReplicationForm record={record} />
									</Modal>
								</p>
							))}

						{!record.isArchived &&
							(currentDate > departureTime && !record.results ? (
								<p className='text-center font-secondary text-sm text-muted-foreground'>
									Oops! No hemos encontrado la guía por algún motivo{' '}
									<Modal
										title={`Replica el viaje ${record.code}`}
										description='Establece  el alias y la nueva fecha de salida para replicar el viaje.'
										triggerProps={{
											type: 'button',
											variant: 'link',
											'aria-label': `Replica el viaje ${record.code}`,
											'aria-disabled': false,
											className: 'p-0',
										}}
										triggerLabel='replicar viaje'
										submitLabel='Listo'
										submitIcon={<CheckCircle2 className='mr-1 size-4' />}
										submitProps={{
											form: REPLICATE_FORM_ID,
										}}>
										<ReplicationForm record={record} />
									</Modal>
								</p>
							) : currentDate <
							  new Date(departureTime.getTime() - 10 * 60 * 1000) ? (
								<p className='text-center font-secondary text-sm text-muted-foreground'>
									La guía de viaje estará disponible 10 minutos antes de la
									salida.
								</p>
							) : (
								<Button variant='link' asChild>
									<Link href={`${Pathnames.TRIPS}/${record.id}`}>
										Guía de viaje
									</Link>
								</Button>
							))}

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
								endpoint={ApiEndpoints.TRIPS}
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
