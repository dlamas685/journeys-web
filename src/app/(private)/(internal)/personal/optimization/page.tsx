import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Separator } from '@/components/ui/separator'
import OptimizationContent from './_components/optimization-content'
import OptimizationControls from './_components/optimization-controls'
import OptimizationStepper from './_components/optimization-stepper'

export default async function OptimizationPage() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Optimización</FrameTitle>
			</FrameHeader>
			<FrameBody className='flex flex-col sm:grid sm:grid-cols-[auto_auto_1fr]'>
				<OptimizationStepper />
				<Separator className='hidden sm:block' orientation='vertical' />
				<section className='flex flex-grow flex-col gap-3 sm:flex-grow-0'>
					<OptimizationContent />
					<OptimizationControls />
				</section>
			</FrameBody>
		</Frame>
	)
}
