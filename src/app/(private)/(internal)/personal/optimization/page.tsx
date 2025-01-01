'use client'
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
			<FrameBody className='grid grid-cols-[auto_auto_1fr]'>
				<OptimizationStepper />
				<Separator orientation='vertical' />
				<section className='flex flex-col gap-3'>
					<span className='flex-grow'>@FormComponent</span>
					<OptimizationControls />
				</section>
			</FrameBody>
		</Frame>
	)
}
