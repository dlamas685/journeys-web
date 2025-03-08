import { findOne } from '@/common/actions/crud.action'
import { getServerUser } from '@/common/actions/session.action'
import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import DependenciesProvider from '@/common/providers/DependenciesProvider'
import { Params } from '@/common/types'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { capitalCase } from 'change-case'
import { Metadata } from 'next'
import { findAllCostProfiles } from '../../optimization/_actions/roadmaps.action'
import Results from '../_components/results'
import { RoadmapModel } from '../_models'

type Props = {
	params: Promise<Params>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params
	const roadmapId = params['id']

	const roadmap = await findOne<RoadmapModel>(ApiEndpoints.ROADMAPS, roadmapId)

	return {
		title: `Journeys • Hoja de Ruta - ${capitalCase(roadmap.code)}`,
		description: `Inspecciona los detalles de la hoja de ruta: ${roadmap.code}.`,
	}
}

export default async function RoadmapPage(props: Readonly<Props>) {
	const params = await props.params
	const roadmapId = params['id']
	const user = await getServerUser()

	const roadmap = await findOne<Required<RoadmapModel>>(
		ApiEndpoints.ROADMAPS,
		roadmapId
	)

	const costProfiles = await findAllCostProfiles(Pathnames.ROADMAPS)

	return (
		<Frame className='gap-5 sm:gap-4'>
			<FrameHeader className='gap-2 sm:flex-col sm:gap-2'>
				<section className='flex flex-col gap-5 sm:gap-0'>
					<FrameTitle>Detalles</FrameTitle>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									href={`/${user?.userType?.toLocaleLowerCase()}/${Pathnames.ROADMAPS}`}>
									Hoja de Rutas
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{capitalCase(roadmap.code)}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</section>
			</FrameHeader>
			<FrameBody className='gap-0 sm:gap-6'>
				<DependenciesProvider
					dependencies={{
						costProfiles,
					}}>
					<Results setting={roadmap.setting} results={roadmap.results} />
				</DependenciesProvider>
			</FrameBody>
		</Frame>
	)
}
