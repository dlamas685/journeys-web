import { Ref, SVGProps, forwardRef } from 'react'
const TaskErrorIcon = (
	props: SVGProps<SVGSVGElement>,
	ref: Ref<SVGSVGElement>
) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='3 1 20.24 22.24'
		width='1em'
		height='1em'
		ref={ref}
		{...props}>
		<path
			fill='currentColor'
			d='M7 1h10v2h4v9h-2V5h-2v2H7V5H5v16h7v2H3V3h4zm2 4h6V3H9zm7.172 9.757L19 17.586l2.828-2.829 1.415 1.415L20.414 19l2.829 2.828-1.415 1.415L19 20.414l-2.828 2.829-1.415-1.415L17.586 19l-2.829-2.828z'
		/>
	</svg>
)
const ForwardRef = forwardRef(TaskErrorIcon)
export default ForwardRef
