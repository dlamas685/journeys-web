import { NotificationType } from '../enums'

export interface NotificationModel {
	id: string

	recipientId: string

	type: NotificationType

	subject: string

	message: string | null

	readAt: string | null

	createdAt: string

	updatedAt: string | null
}
