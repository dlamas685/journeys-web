import { CarTaxiFront, Layers, Route, Server } from 'lucide-react'
import { ReactElement } from 'react'
import { NotificationType } from '../enums'

export const NOTIFICATIONS_ICON: Record<
	NotificationType,
	ReactElement | undefined
> = {
	[NotificationType.SYSTEM]: <Server />,
	[NotificationType.OPTIMIZATION]: <Route />,
	[NotificationType.TRIPS]: <CarTaxiFront />,
	[NotificationType.ROADMAPS]: <Layers />,
	[NotificationType.FLEETS]: undefined,
	[NotificationType.VEHICLES]: undefined,
	[NotificationType.DRIVERS]: undefined,
}
