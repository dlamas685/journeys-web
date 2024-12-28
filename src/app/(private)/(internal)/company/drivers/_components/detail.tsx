'use client'
import SeeMore from '@/common/components/ui/misc/see-more'
import { format } from 'date-fns'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { type DriverModel } from '../_models'

type Props = {
	record: DriverModel
}

const Detail = ({ record }: Readonly<Props>) => {
	const [seeMore, setSeeMore] = useState<boolean>(false)
	const [isOverflowing, setIsOverflowing] = useState<boolean>(false)
	const notesRef = useRef<HTMLSpanElement>(null)

	const toggleSeeMore = () => setSeeMore(!seeMore)

	useEffect(() => {
		if (notesRef.current) {
			const isOverflow =
				notesRef.current.scrollHeight > notesRef.current.offsetHeight
			setIsOverflowing(isOverflow)
		}
	}, [record.notes])

	return (
		<article className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 sm:max-h-[inherit] sm:grid-cols-[auto_1fr] sm:gap-4 sm:overflow-y-hidden sm:px-1'>
			<Image
				src={record.imageUrl ?? '/photos/young-man-placeholder.png'}
				alt={`Imagen de ${record.name}`}
				width={210}
				height={210}
				className='size-96 object-contain sm:size-52'
			/>

			<section className='flex flex-wrap gap-4 sm:flex-col'>
				<p className='font-secondary text-sm'>
					<b>Nombre:</b> {record.name}
				</p>
				<p className='font-secondary text-sm'>
					<b>N° Licencia:</b> {record.licenseNumber}
				</p>

				<p className='font-secondary text-sm'>
					<b>Flota:</b> {record.fleet?.name ?? 'N/D'}
				</p>
			</section>

			<div className='col-span-full text-sm'>
				<b>Notas</b>
				<br />
				{record.notes ? <SeeMore lines={3}>{record.notes}</SeeMore> : 'N/D'}
			</div>

			<section className='flex flex-col gap-1'>
				<p className='font-secondary text-xs text-muted-foreground'>
					Creado: {format(record.createdAt, 'dd/MM/yyyy')}
				</p>
				<p className='font-secondary text-xs text-muted-foreground'>
					Actualizado:
					{record.updatedAt ? format(record.updatedAt, 'dd/MM/yyyy') : 'N/D'}
				</p>
			</section>
		</article>
	)
}

export default Detail
