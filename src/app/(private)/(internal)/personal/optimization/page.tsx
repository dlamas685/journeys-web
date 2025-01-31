import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Separator } from '@/components/ui/separator'
import { Metadata } from 'next'
import OptimizationContent from './_components/optimization-content'
import OptimizationControls from './_components/optimization-controls'
import OptimizationStepper from './_components/optimization-stepper'

export const metadata: Metadata = {
	title: 'Journeys • Optimización',
	description: 'Optimiza tus viajes de acuerdo a diferentes criterios',
}

export default async function OptimizationPage() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Optimización</FrameTitle>
			</FrameHeader>
			<FrameBody className='flex flex-col sm:grid sm:grid-cols-[auto_auto_1fr]'>
				<OptimizationStepper />
				<Separator className='hidden sm:block' orientation='vertical' />
				<section className='flex flex-grow flex-col gap-4 sm:flex-grow-0 sm:gap-6'>
					<OptimizationContent />
					<OptimizationControls />
				</section>
			</FrameBody>
		</Frame>
	)
}
