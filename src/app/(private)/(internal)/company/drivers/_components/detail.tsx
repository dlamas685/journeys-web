'use client'
import { cn } from '@/lib/utils'
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
		<article className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 sm:max-h-[inherit] sm:grid-cols-[auto_1fr] sm:gap-4 sm:px-1'>
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
				{/* <p className='font-secondary text-sm'>
					<b>DNI:</b> {record.dni ?? 'N/D'}
				</p>
				<p className='font-secondary text-sm'>
					<b>Genero:</b> {record.genre ?? 'N/D'}
				</p>
				<p className='font-secondary text-sm'>
					<b>Edad:</b> {record.age ?? 'N/D'}
				</p> */}

				<p className='font-secondary text-sm'>
					<b>Flota:</b> {record.fleet?.name ?? 'N/D'}
				</p>
			</section>

			<p className='col-span-full text-sm'>
				<b>Notas</b>
				<br />
				<span
					className={cn('overflow-hidden', {
						'line-clamp-3': !seeMore,
						'line-clamp-none': seeMore,
					})}>
					{record.notes}
				</span>
				{isOverflowing && (
					<span
						className='cursor-pointer text-orange-500'
						onClick={toggleSeeMore}>
						{seeMore ? 'Ver menos' : 'Ver más'}
					</span>
				)}
			</p>

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
