'use client'
import { ApiError } from '@/common/classes/api-error.class'
import EraserButton from '@/common/components/ui/misc/eraser-button'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import { useDataTableContext } from '@/common/hooks/use-data-table-context'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { CircleX, Unlink2 } from 'lucide-react'
import { DriverModel } from '../../../../drivers/_models'
import { relateDriversToFleet } from '../../../_actions/fleets.action'
import { RelationOperations } from '../../../_enums/relation-operations.enum'

type Props = {
	fleetId: string
}

const VehicleUnlink = ({ fleetId }: Readonly<Props>) => {
	const { table } = useDataTableContext<DriverModel>()

	const rows = table.getFilteredSelectedRowModel().rows

	const setLoading = useLoading(state => state.setLoading)

	const response = useResponse()

	const handleRemove = async () => {
		const driverIds = rows.map(row => row.original.id)

		await relateDriversToFleet(fleetId, {
			driverIds,
			operation: RelationOperations.UNLINK,
		})
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				response.success({
					title: 'Flotas',
					description: 'Conductores desvinculados correctamente',
				})

				table.resetRowSelection()
			})
			.catch(response.error)
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<RemovalAlert
			triggerLabel='Desvincular'
			triggerIcon={<Unlink2 className='mr-1 size-3.5' />}
			triggerProps={{
				variant: 'outline',
				disabled: rows.length === 0,
			}}
			cancelIcon={<CircleX className='mr-1 size-4' />}
			title={
				rows.length === 1 ? 'Desvincular conductor' : 'Desvincular conductores'
			}
			description={
				<>
					{rows.length === 1 ? (
						<>
							¿Estás seguro de que deseas desvincular al conductor{' '}
							<b>{rows[0].original.name}</b> de esta flota? Esta acción no se
							puede deshacer.
						</>
					) : (
						<span className='flex flex-col gap-2 font-secondary'>
							<span>
								¿Estás seguro de que deseas desvincular a los conductores
								seleccionados de esta flota? Esta acción no se puede deshacer.
							</span>
							<ul
								role='list'
								className='list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-orange-500'>
								{rows.map(row => (
									<li key={row.original.id}>
										{row.original.name} - {row.original.licenseNumber}
									</li>
								))}
							</ul>
						</span>
					)}
				</>
			}
			eraserButton={({ setOpen }) => (
				<EraserButton onRemove={handleRemove} setAlertOpen={setOpen} />
			)}
		/>
	)
}

export default VehicleUnlink
