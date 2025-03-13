import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { WEBSOCKET_EVENTS } from '../constants'
import { NotificationModel } from '../models'

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL

export const useNotifications = (
	recipientId: string | null,
	data: NotificationModel[] = []
) => {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [notifications, setNotifications] = useState<NotificationModel[]>(data)

	useEffect(() => {
		if (!recipientId) return

		const socket = io(`${SOCKET_URL}/notifications`, {
			query: { recipientId },
			transports: ['websocket'],
		})

		socket.on('connect', () => {
			console.log(`Conectado al WebSocket con ID ${socket.id}`)
		})

		socket.on('disconnect', () => {
			console.log('Desconectado del WebSocket')
		})

		socket.on(
			WEBSOCKET_EVENTS.NEW_NOTIFICATION,
			(notification: NotificationModel) => {
				setNotifications(prev => [notification, ...prev])
				// toast.info(notification.subject, {
				// 	description: notification.message,
				// 	duration: 1500,
				// })
			}
		)

		socket.on(
			WEBSOCKET_EVENTS.NOTIFICATION_READ,
			(notifications: NotificationModel[]) => {
				setNotifications(notifications)
			}
		)

		socket.on(
			WEBSOCKET_EVENTS.NOTIFICATION_DELETED,
			(notifications: NotificationModel[]) => {
				setNotifications(notifications)
			}
		)

		setSocket(socket)

		return () => {
			socket.disconnect()
		}
	}, [recipientId])

	return { socket, notifications }
}
