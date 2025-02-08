import { Ref, SVGProps, forwardRef } from 'react'
const SegmentIcon = (
	props: SVGProps<SVGSVGElement>,
	ref: Ref<SVGSVGElement>
) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='3 8 18 8'
		width='1em'
		height='1em'
		ref={ref}
		{...props}>
		<path
			fill='none'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='m17 9 3 3-3 3m-3-3h6M7 9l-3 3 3 3m-3-3h6'
		/>
	</svg>
)
const ForwardRef = forwardRef(SegmentIcon)
export default ForwardRef
