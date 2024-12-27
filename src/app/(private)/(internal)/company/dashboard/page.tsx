import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'

export default function DashboardPage() {
	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Panel de Control</FrameTitle>
			</FrameHeader>
			<FrameBody>@Components</FrameBody>
		</Frame>
	)
}
