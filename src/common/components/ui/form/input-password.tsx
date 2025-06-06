'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, forwardRef, useState } from 'react'

type Props = ComponentProps<typeof Input> & {}

const InputPassword = forwardRef<HTMLDivElement, Props>(
	({ ...input }: Readonly<Props>, ref) => {
		const [show, setShow] = useState(false)

		const handleClick = (
			e: React.MouseEvent<HTMLButtonElement, MouseEvent>
		) => {
			setShow(!show)
			e.preventDefault()
		}

		return (
			<div ref={ref} className='relative'>
				<Input {...input} type={show ? 'text' : 'password'} />
				<Button
					className='absolute right-2 top-1/2 h-auto -translate-y-1/2 transform p-1'
					onClick={handleClick}
					variant='ghost'>
					{show ? <EyeOff size={14} /> : <Eye size={14} />}
				</Button>
			</div>
		)
	}
)

InputPassword.displayName = 'InputPassword'

export default InputPassword
