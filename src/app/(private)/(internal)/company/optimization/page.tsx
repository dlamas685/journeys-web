import { findAll } from '@/common/actions/crud.action'
import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import DependenciesProvider from '@/common/providers/DependenciesProvider'
import { Separator } from '@/components/ui/separator'
import { Metadata } from 'next'
import { DriverModel } from '../drivers/_models'
import { FleetModel } from '../fleets/_models'
import { VehicleModel } from '../vehicles/_models'
import { findAllCostProfiles } from './_actions/roadmaps.action'
import OptimizationContent from './_components/optimization-content'
import OptimizationControls from './_components/optimization-controls'
import OptimizationStepper from './_components/optimization-stepper'

export const metadata: Metadata = {
	title: 'Journeys • Optimización',
	description:
		'Configura y crea tus hojas de rutas incorporando datos que te permitan optimizar tus servicios.',
}

export default async function RoadmapsPage() {
	const costProfiles = await findAllCostProfiles(Pathnames.ROADMAPS)

	const fleets = await findAll<FleetModel>(
		ApiEndpoints.FLEETS,
		{},
		Pathnames.ROADMAPS
	).then(response => response.data)

	const drivers = await findAll<DriverModel>(
		ApiEndpoints.DRIVERS,
		{},
		Pathnames.ROADMAPS
	).then(response => response.data)

	const vehicles = await findAll<VehicleModel>(
		ApiEndpoints.VEHICLES,
		{},
		Pathnames.ROADMAPS
	).then(response => response.data)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Optimización</FrameTitle>
			</FrameHeader>
			<FrameBody className='flex flex-col sm:grid sm:grid-cols-[auto_auto_1fr]'>
				<OptimizationStepper />
				<Separator className='hidden sm:block' orientation='vertical' />
				<DependenciesProvider
					dependencies={{
						costProfiles,
						fleets,
						drivers,
						vehicles,
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
