'use client'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import { UPSERT_FORM_ID } from '@/common/constants'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CircleX, Pencil, Save, Trash2 } from 'lucide-react'
import { forwardRef, ReactNode, Ref } from 'react'
import { FavoriteAddressModel } from '../_models'
import EraserButton from './eraser-button'

type Props = {
	record: FavoriteAddressModel
	updaterForm: ReactNode
}

const FavoriteAddressCard = forwardRef(
	({ record, updaterForm }: Readonly<Props>, ref: Ref<HTMLDivElement>) => (
		<Card
			ref={ref}
			className='flex flex-col gap-4 border-none p-4 shadow-bento'>
			<CardHeader className='p-0'>
				<CardTitle className='font-secondary text-sm capitalize'>
					{record.alias}
				</CardTitle>
			</CardHeader>
			<CardContent className='flex-grow p-0'>
				<p className='font-secondary text-sm text-gray-600'>{record.address}</p>
			</CardContent>
			<CardFooter className='grid grid-cols-2 gap-2 p-0'>
				<Modal
					title='Editar Dirección Favorita'
					description='Modifica los datos de la dirección favorita. Los campos a los que no ingreses un valor, no serán modificados.'
					triggerIcon={<Pencil className='mr-1 size-3.5' />}
					triggerProps={{
						size: 'sm',
						variant: 'editing',
					}}
					triggerLabel='Editar'
					submitLabel='Guardar'
					submitIcon={<Save className='mr-1 size-4' />}
					submitProps={{
						form: UPSERT_FORM_ID,
					}}>
					{updaterForm}
				</Modal>

				<RemovalAlert
					triggerLabel='Eliminar'
					triggerIcon={<Trash2 className='mr-1 size-3.5' />}
					cancelIcon={<CircleX className='mr-1 size-4' />}
					description={
						<>
							¿Estás seguro de que deseas eliminar la dirección favorita{' '}
							<b className='capitalize'>{record.alias}</b>? Esta acción no se
							puede deshacer.
						</>
					}
					eraserButton={({ setOpen }) => (
						<EraserButton recordId={record.id} setAlertOpen={setOpen} />
					)}
				/>
			</CardFooter>
		</Card>
	)
)

FavoriteAddressCard.displayName = 'FavoriteAddressCard'

export default motion.create(FavoriteAddressCard)
