import {
	Frame,
	FrameBody,
	FrameGadgets,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Skeleton } from '@/components/ui/skeleton'
import SkeletonGrid from './_components/skeleton-grid'

export default function Loading() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Direcciones Favoritas</FrameTitle>
				<FrameGadgets>
					<Skeleton className='h-9 w-24' />

					<Skeleton className='h-9 w-20' />

					<Skeleton className='h-9 w-20' />
				</FrameGadgets>
			</FrameHeader>
			<FrameBody>
				<SkeletonGrid />
			</FrameBody>
		</Frame>
	)
}
