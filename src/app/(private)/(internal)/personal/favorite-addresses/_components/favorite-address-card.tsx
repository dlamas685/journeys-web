import Modal from '@/common/components/ui/overlay/modal'
import { UPSERT_FORM_ID } from '@/common/constants'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Pencil, Save, Trash2 } from 'lucide-react'
import { forwardRef, ReactNode, Ref } from 'react'
import { FavoriteAddressModel } from '../_models'

type Props = {
	record: FavoriteAddressModel
	updaterForm: ReactNode
}

const FavoriteAddressCard = forwardRef(
	({ record, updaterForm }: Readonly<Props>, ref: Ref<HTMLDivElement>) => {
		return (
			<Card
				ref={ref}
				className='flex flex-col gap-4 border-none p-4 shadow-bento'>
				<CardHeader className='p-0'>
					<CardTitle className='font-secondary text-sm capitalize'>
						{record.alias}
					</CardTitle>
				</CardHeader>
				<CardContent className='flex-grow p-0'>
					<p className='font-secondary text-sm text-gray-600'>
						{record.address}
					</p>
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

					<Button variant='erased' size='sm'>
						<Trash2 className='mr-1 size-3.5' />
						Eliminar
					</Button>
				</CardFooter>
			</Card>
		)
	}
)

FavoriteAddressCard.displayName = 'FavoriteAddressCard'

export default motion.create(FavoriteAddressCard)
