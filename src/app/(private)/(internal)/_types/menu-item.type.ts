import { UserTypes } from '@/common/enums'
import { ReactNode } from 'react'

export type MenuItem = {
	id: string
	icon: ReactNode
	label: string
	href: string
	responsive?: boolean
	userType?: UserTypes
}
