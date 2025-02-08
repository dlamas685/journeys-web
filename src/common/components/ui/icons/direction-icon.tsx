import { Ref, SVGProps, forwardRef } from 'react'
const DirectionIcon = (
	props: SVGProps<SVGSVGElement>,
	ref: Ref<SVGSVGElement>
) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='1.1 1.1 21.8 21.8'
		width='1em'
		height='1em'
		ref={ref}
		{...props}>
		<path
			fill='currentColor'
			d='M12 3.515 3.515 12 12 20.485 20.485 12zm.707-2.122 9.9 9.9a1 1 0 0 1 0 1.414l-9.9 9.9a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 0-1.414l9.9-9.9a1 1 0 0 1 1.414 0M13 10V7.5l3.5 3.5-3.5 3.5V12h-3v3H8v-4a1 1 0 0 1 1-1z'
		/>
	</svg>
)
const ForwardRef = forwardRef(DirectionIcon)
export default ForwardRef
