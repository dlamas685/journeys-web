import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Metadata } from 'next'

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
			<FrameBody>@Components</FrameBody>
		</Frame>
	)
}
