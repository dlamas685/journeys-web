'use client'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import { useState } from 'react'
import { VehicleModel } from '../_models'

type Props = {
	vehicle: VehicleModel
}

const Detail = ({ vehicle }: Readonly<Props>) => {
	const [seeMore, setSeeMore] = useState<boolean>(false)

	const toggleSeeMore = () => setSeeMore(!seeMore)

	return (
		<article className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 sm:max-h-[inherit] sm:grid-cols-[auto_1fr] sm:gap-4'>
			<Image
				src={vehicle.imageUrl ?? '/photos/car-placeholder.png'}
				alt={`Imagen del vehículo con placa ${vehicle.licensePlate}`}
				width={210}
				height={210}
				className='size-96 object-cover sm:size-52'
			/>

			<section className='flex flex-wrap gap-4 sm:flex-col'>
				<p className='font-secondary text-sm'>
					<b>Placa:</b> {vehicle.licensePlate}
				</p>
				<p className='font-secondary text-sm'>
					<b>Marca:</b> {vehicle.make ?? 'N/D'}
				</p>
				<p className='font-secondary text-sm'>
					<b>Modelo:</b> {vehicle.model ?? 'N/D'}
				</p>
				<p className='font-secondary text-sm'>
					<b>Año:</b> {vehicle.year ?? 'N/D'}
				</p>
				<p className='font-secondary text-sm'>
					<b>VIN:</b> {vehicle.vin ?? 'N/D'}
				</p>

				<p className='font-secondary text-sm'>
					<b>Flota:</b> {vehicle.fleet?.name ?? 'N/D'}
				</p>
			</section>

			<p className='col-span-full text-sm'>
				<b>Notas</b>
				<br />
				<span
					className={cn({
						'line-clamp-3': !seeMore,
						'line-clamp-none': seeMore,
					})}>
					{vehicle.notes}
				</span>
				<span
					className='cursor-pointer text-orange-500'
					onClick={toggleSeeMore}>
					{seeMore ? 'Ver menos' : 'Ver más'}
				</span>
			</p>

			<section className='flex flex-col gap-1'>
				<p className='font-secondary text-xs text-muted-foreground'>
					Creado: {format(vehicle.createdAt, 'dd/MM/yyyy')}
				</p>
				<p className='font-secondary text-xs text-muted-foreground'>
					Actualizado:
					{vehicle.updatedAt ? format(vehicle.updatedAt, 'dd/MM/yyyy') : 'N/D'}
				</p>
			</section>
		</article>
	)
}

export default Detail
