import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Pathnames } from '@/common/enums'
import DependenciesProvider from '@/common/providers/DependenciesProvider'
import { Separator } from '@/components/ui/separator'
import { Metadata } from 'next'
import { findAllCostProfiles } from './_actions/roadmaps.action'
import OptimizationContent from './_components/optimization-content'
import OptimizationControls from './_components/optimization-controls'
import OptimizationStepper from './_components/optimization-stepper'

export const metadata: Metadata = {
	title: 'Journeys • Hojas de ruta',
	description:
		'Crea y configura tus hojas de rutas incorporando datos que te permitan optimizar tus servicios.',
}

export default async function RoadmapsPage() {
	const costProfiles = await findAllCostProfiles(Pathnames.ROADMAPS)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Hojas de Rutas</FrameTitle>
			</FrameHeader>
			<FrameBody className='flex flex-col sm:grid sm:grid-cols-[auto_auto_1fr]'>
				<OptimizationStepper />
				<Separator className='hidden sm:block' orientation='vertical' />
				<DependenciesProvider
					dependencies={{
						costProfiles,
					}}>
					<section className='flex flex-grow flex-col gap-4 sm:flex-grow-0 sm:gap-6'>
						<OptimizationContent />
						<OptimizationControls />
					</section>
				</DependenciesProvider>
			</FrameBody>
		</Frame>
	)
}
