'use client'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import type { ActivityModel } from '@/common/models'
import { Ban, CircleX } from 'lucide-react'
import { toast } from 'sonner'
import { useDraggableTableContext } from '../_hooks/use-draggable-table-context'

type Props = {
	records: ActivityModel[]
}

const RebootAlert = ({ records }: Readonly<Props>) => {
	const { setActivities, setWasOrdered, wasOrdered } =
		useDraggableTableContext()

	const handleReboot = async () => {
		setActivities(records)
		setWasOrdered(false)
		toast.success('Actividades', {
			description: 'Cambios descartados correctamente.',
			position: 'top-right',
		})
	}

	return (
		<RemovalAlert
			triggerLabel='Descartar'
			triggerIcon={<Ban className='mr-1 size-4' />}
			triggerProps={{
				variant: 'destructive',
				'aria-label': 'Descartar cambios',
				'aria-disabled': 'false',
				disabled: !wasOrdered,
			}}
			cancelIcon={<CircleX className='mr-1 size-4' />}
			title='Descartar cambios'
			description={
				<>
					¿Estás seguro de que deseas descartar los cambios? El orden de las
					actividades se perderá.
				</>
			}
			eraserButton={({ setOpen }) => (
				<EraserButton
					setAlertOpen={setOpen}
					onRemove={handleReboot}
					title='Actividades'
					description='Actividad eliminada correctamente.'
				/>
			)}
		/>
	)
}

export default RebootAlert
