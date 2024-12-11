'use client'

import { logOut } from '@/common/actions/auth.action'
import { Button } from '@/components/ui/button'
import { type ComponentProps, forwardRef } from 'react'

type Props = ComponentProps<typeof Button> & {
	onAfterLogout?: () => void
	onBeforeLogout?: () => void
}

const Logout = forwardRef<HTMLButtonElement, Props>(
	({ children, onAfterLogout, onBeforeLogout, ...props }, ref) => {
		const handleClick = async () => {
			if (onBeforeLogout) {
				onBeforeLogout()
			}

			await logOut()

			if (onAfterLogout) {
				onAfterLogout()
			}
		}

		return (
			<Button ref={ref} onClick={handleClick} {...props}>
				{children}
			</Button>
		)
	}
)

Logout.displayName = 'Logout'

export default Logout
