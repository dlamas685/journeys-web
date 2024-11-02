import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import {
	Fieldset,
	FieldsetContent,
	FieldsetLegend,
} from '@/common/components/ui/form/field-set'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Mi perfil</FrameTitle>
			</FrameHeader>
			<FrameBody className='max-w-xl'>
				<section className='grid grid-cols-1 items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-3.5'>
					<Skeleton className='size-28 place-self-center rounded-3xl' />

					<section className='flex w-full flex-col gap-1.5 sm:w-auto sm:flex-grow'>
						<Skeleton className='h-5 w-1/3' />

						<section className='flex w-full items-center gap-2'>
							<Skeleton className='h-10 flex-grow' />

							<Skeleton className='h-9 w-16' />
						</section>

						<Skeleton className='h-5 w-full' />
					</section>
				</section>
				<section className='grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-6'>
					<Fieldset>
						<FieldsetLegend>
							<Skeleton className='h-5 w-1/2' />
						</FieldsetLegend>
						<FieldsetContent className='grid-cols-2 gap-2 sm:gap-3'>
							<section className='col-span-full space-y-2'>
								<Skeleton className='h-5 w-1/3' />
								<Skeleton className='h-10 w-full' />
							</section>

							<section className='space-y-2'>
								<Skeleton className='h-5 w-1/3' />
								<Skeleton className='h-10 w-full' />
							</section>

							<section className='space-y-2'>
								<Skeleton className='h-5 w-1/3' />
								<Skeleton className='h-10 w-full' />
							</section>

							<section className='space-y-2'>
								<Skeleton className='h-5 w-1/3' />
								<Skeleton className='h-10 w-full' />
							</section>

							<section className='space-y-2'>
								<Skeleton className='h-5 w-1/3' />
								<Skeleton className='h-10 w-full' />
							</section>
						</FieldsetContent>
					</Fieldset>

					<Separator orientation='vertical' />

					<Fieldset>
						<FieldsetLegend>
							<Skeleton className='h-5 w-1/2' />
						</FieldsetLegend>
						<FieldsetContent className='flex flex-col gap-2 sm:gap-3'>
							<section className='space-y-2'>
								<Skeleton className='h-5 w-1/3' />
								<Skeleton className='h-10 w-full' />
							</section>

							<section className='space-y-2'>
								<Skeleton className='h-5 w-1/3' />
								<Skeleton className='h-10 w-full' />
							</section>

							<section className='space-y-2'>
								<Skeleton className='h-5 w-1/3' />
								<Skeleton className='h-10 w-full' />
							</section>
						</FieldsetContent>
					</Fieldset>
					<Skeleton className='col-span-full mt-2 h-10 w-full justify-self-start sm:mt-4 sm:w-28' />
				</section>
			</FrameBody>
		</Frame>
	)
}
