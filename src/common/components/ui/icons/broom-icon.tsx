import { Ref, SVGProps, forwardRef } from 'react'
const SvgComponent = (
	props: SVGProps<SVGSVGElement>,
	ref: Ref<SVGSVGElement>
) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='2.35 2.72 18.43 18.43'
		width='1em'
		height='1em'
		ref={ref}
		{...props}>
		<path
			fill='currentColor'
			d='m19.36 2.72 1.42 1.42-5.72 5.71c1.07 1.54 1.22 3.39.32 4.59L9.06 8.12c1.2-.9 3.05-.75 4.59.32zM5.93 17.57c-2.01-2.01-3.24-4.41-3.58-6.65l4.88-2.09 7.44 7.44-2.09 4.88c-2.24-.34-4.64-1.57-6.65-3.58'
		/>
	</svg>
)
const ForwardRef = forwardRef(SvgComponent)
export default ForwardRef
