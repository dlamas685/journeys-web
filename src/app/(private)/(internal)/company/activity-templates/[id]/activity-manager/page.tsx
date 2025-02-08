import { findOne } from '@/common/actions/crud.action'
import { getServerUser } from '@/common/actions/session.action'
import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import SeeMore from '@/common/components/ui/misc/see-more'
import Modal from '@/common/components/ui/overlay/modal'
import { UPSERT_FORM_ID } from '@/common/constants'
import { ApiEndpoints, Pathnames } from '@/common/enums'
import type { ActivityTemplateModel } from '@/common/models'
import type { Params } from '@/common/types'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { capitalCase } from 'change-case'
import { CheckCircle2, ClipboardCheck } from 'lucide-react'
import { type Metadata } from 'next'
import DraggableTable from './_components/draggable-table'
import RebootAlert from './_components/reboot-alert'
import SaveChangesButton from './_components/save-changes-button'
import UpsertForm from './_components/upsert-form'
import { COLUMNS } from './_constants/columns.constants'
import DraggableTableProvider from './_providers/draggable-table.provider'

type Props = {
	params: Promise<Params>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params
	const activityTemplateId = params['id']

	const activityTemplate = await findOne<ActivityTemplateModel>(
		ApiEndpoints.ACTIVITY_TEMPLATES,
		activityTemplateId
	)

	return {
		title: `Journeys • Actividades de ${capitalCase(activityTemplate.name)}`,
		description: `Agrega y elimina actividades de la plantilla ${activityTemplate.name}.`,
	}
}

export default async function ActivityManagerPage(props: Readonly<Props>) {
	const params = await props.params
	const activityTemplateId = params['id']

	const user = await getServerUser()

	const activityTemplate = await findOne<ActivityTemplateModel>(
		ApiEndpoints.ACTIVITY_TEMPLATES,
		activityTemplateId
	)

	console.log(activityTemplate)

	return (
		<Frame className='gap-5 sm:gap-4'>
			<FrameHeader className='gap-2 sm:flex-col sm:gap-2'>
				<section className='flex flex-col gap-5 sm:gap-0'>
					<FrameTitle>Actividades</FrameTitle>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									href={`/${user?.userType?.toLocaleLowerCase()}/${Pathnames.ACTIVITY_TEMPLATES}`}>
									Plantillas de Actividades
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>
									{capitalCase(activityTemplate.name)}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</section>

				<SeeMore
					lines={2}
					className='font-secondary text-sm text-muted-foreground sm:text-base'>
					{activityTemplate.description}
				</SeeMore>
			</FrameHeader>
			<FrameBody className='gap-0 sm:gap-4'>
				<DraggableTableProvider
					columns={COLUMNS}
					initialValue={activityTemplate.activities ?? []}>
					<section className='flex justify-between gap-2'>
						<Modal
							title='Nueva actividad'
							description='Agrega una nueva actividad para usar en tus hojas de ruta. Ten en cuenta que algunos campos son opcionales.'
							triggerIcon={<ClipboardCheck className='mr-1 size-4' />}
							triggerProps={{
								'aria-label': 'Crear nueva actividad',
								'aria-disabled': false,
							}}
							triggerLabel='Agregar'
							submitLabel='Listo'
							submitIcon={<CheckCircle2 className='mr-1 size-4' />}
							submitProps={{
								form: UPSERT_FORM_ID,
							}}>
							<UpsertForm activityTemplateId={activityTemplateId} />
						</Modal>

						<section className='grid grid-cols-2 gap-1'>
							<SaveChangesButton activityTemplateId={activityTemplateId} />
							<RebootAlert records={activityTemplate.activities ?? []} />
						</section>
					</section>
					<DraggableTable />
				</DraggableTableProvider>
			</FrameBody>
		</Frame>
	)
}
