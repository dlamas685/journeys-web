import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Metadata } from 'next'
import { Chart01 } from './_components/chart-01'

export const metadata: Metadata = {
	title: 'Journeys • Inicio',
	description: 'Bienvenido a Journeys, disfruta de tu estancia',
}

export default async function HomePage() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Inicio</FrameTitle>
			</FrameHeader>
			<FrameBody className='grid grid-cols-2'>
				<Chart01 />
			</FrameBody>
		</Frame>
	)
}
