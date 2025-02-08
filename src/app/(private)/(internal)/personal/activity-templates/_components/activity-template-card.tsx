'use client'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import { UPSERT_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import type { ActivityTemplateModel } from '@/common/models'
import { calculateTotalTime, formatTime } from '@/common/utils'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CircleX, ListChecks, Pencil, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
	forwardRef,
	Ref,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react'

type Props = {
	record: ActivityTemplateModel
	updaterForm: ReactNode
	visibleActivitiesCount?: number
}

const ActivitiesTemplateCard = forwardRef(
	(
		{ record, updaterForm, visibleActivitiesCount = 5 }: Readonly<Props>,
		ref: Ref<HTMLDivElement>
	) => {
		const [seeMore, setSeeMore] = useState<boolean>(false)

		const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
		const descriptionRef = useRef<HTMLSpanElement>(null)

		const toggleSeeMore = () => setSeeMore(!seeMore)

		useEffect(() => {
			if (descriptionRef.current) {
				const isOverflow =
					descriptionRef.current.scrollHeight >
					descriptionRef.current.offsetHeight
				setIsOverflowing(isOverflow)
			}
		}, [record.description])

		return (
			<Card
				ref={ref}
				className='flex flex-col gap-4 border-none p-4 shadow-bento'>
				<CardHeader className='p-0'>
					<CardTitle className='font-secondary text-sm capitalize'>
						{record.name}
					</CardTitle>
				</CardHeader>
				<CardContent className='flex flex-grow flex-col gap-2 p-0'>
					<p className='font-secondary text-sm text-muted-foreground'>
						<span
							ref={descriptionRef}
							className={cn('overflow-hidden', {
								'line-clamp-3': !seeMore,
								'line-clamp-none': seeMore,
							})}>
							{record.description}
						</span>
						{isOverflowing && (
							<span
								className='cursor-pointer text-xs text-orange-500'
								onClick={toggleSeeMore}>
								{seeMore ? 'Ver menos' : 'Ver más'}
							</span>
						)}
					</p>
					{/* <h3 className='font-secondary text-sm font-semibold text-muted-foreground'>
						Actividades:
					</h3> */}

					{record.activities && record.activities.length > 0 ? (
						<ul
							role='list'
							className='flex-grow list-image-checkmark space-y-2 pl-5 font-secondary text-muted-foreground'>
							{record.activities
								.slice(0, visibleActivitiesCount)
								.map((activity, index) => (
									<li key={index}>
										<p className='flex justify-between gap-4'>
											<span className='font-secondary text-sm capitalize'>
												{activity.name}
											</span>
											<span className='font-secondary text-sm'>
												{activity.duration
													? formatTime(activity.duration)
													: '-'}
											</span>
										</p>
									</li>
								))}
						</ul>
					) : (
						<div className='flex flex-grow items-center justify-center text-center font-secondary text-sm text-muted-foreground/60'>
							No hay actividades definidas en esta plantilla
						</div>
					)}
					<Button variant='link' asChild>
						<Link
							aria-label={`Gestionar actividades de la plantilla ${record.name}`}
							href={`${Pathnames.ACTIVITY_TEMPLATES}/${record.id}/${Pathnames.ACTIVITY_MANAGER}`}>
							Gestor de actividades
						</Link>
					</Button>
					{record.activities && (
						<Modal
							title={`Actividades de ${record.name}`}
							description={
								<>
									Puedes agregar o quitar actividades de la plantilla desde el{' '}
									<b>gestor de actividades.</b>
								</>
							}
							triggerIcon={<ListChecks className='mr-1 size-3.5' />}
							triggerProps={{
								type: 'button',
								variant: 'secondary',
								className: 'flex',
								'aria-label': `Ver todas las actividades de la plantilla ${record.name}`,
								'aria-disabled': false,
							}}
							triggerLabel='Todas las actividades'
							isReadonly>
							<section className='flex flex-col gap-3 px-4 pb-3 sm:px-0 sm:pb-0'>
								<ul
									role='list'
									className='flex-grow list-image-checkmark space-y-2 pl-5 font-secondary text-muted-foreground'>
									{record.activities.map((activity, index) => (
										<li key={index}>
											<p className='flex justify-between gap-4'>
												<span className='font-secondary text-sm capitalize'>
													{activity.name}
												</span>
												<span className='font-secondary text-sm'>
													{activity.duration
														? formatTime(activity.duration)
														: '-'}
												</span>
											</p>
										</li>
									))}
								</ul>
								<p className='text-xs text-muted-foreground'>
									{calculateTotalTime(record.activities)}
									<br />
									{record.activities.length} actividades
								</p>
							</section>
						</Modal>
					)}
				</CardContent>
				<CardFooter className='grid grid-cols-2 gap-2 p-0'>
					<Modal
						title='Editar Plantilla de Actividades'
						description='Modifica los datos de la plantilla de actividades. Ten en cuenta que todos los campos son obligatorios.'
						triggerIcon={<Pencil className='mr-1 size-3.5' />}
						triggerProps={{
							type: 'button',
							variant: 'editing',
							'aria-label': `Editar el registro ${record.name}`,
							'aria-disabled': false,
						}}
						triggerLabel='Editar'
						submitLabel='Guardar'
						submitIcon={<Save className='mr-1 size-4' />}
						submitProps={{
							form: UPSERT_FORM_ID,
							'aria-label': `Guardar el registro ${record.name}`,
							'aria-disabled': false,
						}}>
						{updaterForm}
					</Modal>

					<RemovalAlert
						triggerLabel='Eliminar'
						triggerIcon={<Trash2 className='mr-1 size-3.5' />}
						triggerProps={{
							type: 'button',
							'aria-label': `Eliminar el registro ${record.name}`,
							'aria-disabled': false,
						}}
						cancelIcon={<CircleX className='mr-1 size-4' />}
						description={
							<>
								¿Estás seguro de que deseas eliminar la plantilla de actividades{' '}
								<b className='capitalize'>{record.name}</b>? Esta acción no se
								puede deshacer.
							</>
						}
						eraserButton={({ setOpen }) => (
							<EraserButton
								recordId={record.id}
								endpoint={ApiEndpoints.ACTIVITY_TEMPLATES}
								setAlertOpen={setOpen}
								title='Plantilla de Actividades'
								description='Plantilla de actividades eliminada correctamente.'
								aria-label={`Confirmar eliminación de ${record.name}`}
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

ActivitiesTemplateCard.displayName = 'ActivitiesTemplateCard'

export default motion.create(ActivitiesTemplateCard)
