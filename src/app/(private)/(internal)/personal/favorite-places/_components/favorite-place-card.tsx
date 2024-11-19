'use client'

import EraserButton from '@/common/components/ui/misc/eraser-button'
import Modal from '@/common/components/ui/overlay/modal'
import RemovalAlert from '@/common/components/ui/overlay/removal-alert'
import { UPSERT_FORM_ID } from '@/common/constants'
import { ApiEndpoints } from '@/common/enums'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CircleX, Pencil, Save, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { forwardRef, ReactNode, Ref } from 'react'
import { FavoritePlaceModel } from '../_models'

type Props = {
	record: FavoritePlaceModel
	updaterForm: ReactNode
}

const FavoritePlaceCard = forwardRef(
	({ record, updaterForm }: Readonly<Props>, ref: Ref<HTMLDivElement>) => (
		<Card
			ref={ref}
			className='flex flex-col gap-4 border-none p-4 shadow-bento'>
			<CardHeader className='flex flex-row items-center justify-between p-0'>
				<CardTitle className='font-secondary text-sm capitalize'>
					{record.name}
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-grow flex-col gap-3 p-0'>
				<p className='font-secondary text-sm' title={record.address}>
					{record.address}
				</p>

				<section className='flex flex-wrap items-baseline gap-2'>
					{record.types.slice(0, 2).map((type, index) => (
						<Badge key={index} variant='secondary' className='flex-shrink-0'>
							{type}
						</Badge>
					))}

					{record.types.length > 2 && (
						<Badge variant='secondary' className='flex-shrink-0'>
							+{record.types.length - 2} más
						</Badge>
					)}
				</section>

				<Image
					className='col-span-2 mt-auto'
					src='/google/desktop/google_on_white_hdpi.png'
					alt='Google'
					width={50}
					height={20}
					sizes='(max-width: 640px) 100vw, 150px'
				/>
			</CardContent>
			<CardFooter className='grid grid-cols-2 gap-2 p-0'>
				<Modal
					title='Editar Lugar Favorito'
					description='Modifica los datos del lugar favorito. Los campos a los que no ingreses un valor, no serán modificados.'
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
							¿Estás seguro de que deseas eliminar{' '}
							<b className='capitalize'>{record.name}</b> de lugares favoritos?
							Esta acción no se puede deshacer.
						</>
					}
					eraserButton={({ setOpen }) => (
						<EraserButton
							recordId={record.id}
							endpoint={ApiEndpoints.FAVORITE_PLACES}
							setAlertOpen={setOpen}
							title='Lugares Favoritos'
							description='Lugar eliminado correctamente.'
						/>
					)}
				/>
			</CardFooter>
		</Card>
	)
)

FavoritePlaceCard.displayName = 'FavoritePlaceCard'

export default motion.create(FavoritePlaceCard)
