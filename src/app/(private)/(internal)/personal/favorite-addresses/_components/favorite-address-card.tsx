import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { forwardRef, Ref } from 'react'
import { FavoriteAddressModel } from '../_models'

type Props = {
	record: FavoriteAddressModel
}

const FavoriteAddressCard = forwardRef(
	({ record }: Readonly<Props>, ref: Ref<HTMLDivElement>) => (
		<Card
			ref={ref}
			className='shadow-bento flex flex-col gap-4 border-none p-4'>
			<CardHeader className='p-0'>
				<CardTitle className='font-secondary text-sm capitalize'>
					{record.alias}
				</CardTitle>
			</CardHeader>
			<CardContent className='flex-grow p-0'>
				<p className='font-secondary text-sm text-gray-600'>{record.address}</p>
			</CardContent>
			<CardFooter className='grid grid-cols-2 gap-2 p-0'>
				<Button
					className='bg-orange-200 px-1 text-orange-700 hover:bg-orange-200/90'
					size='sm'>
					<Pencil className='mr-1 size-3.5' />
					Editar
				</Button>
				<Button
					className='bg-orange-700 px-1 text-orange-200 hover:bg-orange-700/90'
					size='sm'>
					<Trash2 className='mr-1 size-3.5' />
					Eliminar
				</Button>
			</CardFooter>
		</Card>
	)
)

FavoriteAddressCard.displayName = 'FavoriteAddressCard'

export default motion.create(FavoriteAddressCard)
