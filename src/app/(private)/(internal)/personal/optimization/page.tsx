import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Separator } from '@/components/ui/separator'
import OptimizationControls from './_examples/optimization-controls'
import OptimizationStepper from './_examples/optimization-stepper'

export default function OptimizationPage() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Optimización</FrameTitle>
			</FrameHeader>
			<FrameBody className='flex flex-col sm:grid sm:grid-cols-[auto_auto_1fr]'>
				<OptimizationStepper />
				<Separator className='hidden sm:block' orientation='vertical' />
				<section className='flex flex-grow flex-col gap-3 sm:flex-grow-0'>
					<span className='flex-grow'>@FormComponent</span>
					<OptimizationControls />
				</section>
			</FrameBody>
		</Frame>
	)
}
