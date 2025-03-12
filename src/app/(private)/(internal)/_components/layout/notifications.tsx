'use client'
import { remove } from '@/common/actions/crud.action'
import { markAsRead } from '@/common/actions/notificationts.action'
import { ApiError } from '@/common/classes/api-error.class'
import { NOTIFICATIONS_ICON } from '@/common/constants'
import { ApiEndpoints } from '@/common/enums'
import { useNotifications } from '@/common/hooks/use-notificationts'
import useResponse from '@/common/hooks/use-response'
import { MarkAsReadModel, NotificationModel } from '@/common/models'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Bell, CheckCheck, MailCheck, MailWarning, Trash2 } from 'lucide-react'
import { cloneElement, ReactElement, ReactNode, useMemo } from 'react'

interface Notification {
	id: number
	title: string
	message: string
	icon: ReactNode
	read: boolean
}

type Props = {
	recipientId: string
	data: NotificationModel[]
	className?: string
}

const Notifications = ({ className, data, recipientId }: Readonly<Props>) => {
	const { notifications } = useNotifications(recipientId, data)

	const unreadCount = useMemo(
		() => notifications.filter(notification => !notification.readAt).length,
		[notifications]
	)

	const response = useResponse()

	const handleMarkAsRead = async (id: string) => {
		const notification = notifications.find(
			notification => notification.id === id
		)

		if (!notification || notification.readAt) return

		const markAsReadModel: MarkAsReadModel = {
			ids: [id],
			markAll: false,
		}

		await markAsRead(markAsReadModel)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}
			})
			.catch(response.error)
	}

	const handleAllMarkAsRead = async () => {
		const markAsReadModel: MarkAsReadModel = {
			ids: notifications.map(notification => notification.id),
			markAll: true,
		}

		await markAsRead(markAsReadModel)
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}
			})
			.catch(response.error)
	}

	const handleRemove = async (id: string) => {
		const notification = notifications.find(
			notification => notification.id === id
		)

		if (!notification) return

		await remove(ApiEndpoints.NOTIFICATIONS, id)
			.then(resp => {
				if (typeof resp !== 'boolean') {
					throw new ApiError(resp)
				}
				response.success({
					title: 'Notificaciones',
					description: 'La notificación fue eliminada correctamente.',
				})
			})
			.catch(response.error)
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type='button'
					aria-label='Abrir panel de notificaciones'
					aria-disabled='false'
					variant='ghost'
					size='icon'
					className={cn('relative', className)}>
					<Bell className='size-5' />
					{unreadCount > 0 && (
						<span className='absolute right-2 top-2 inline-flex size-5 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border-2 border-white bg-orange-500 text-xs font-bold leading-none text-red-100'>
							{unreadCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='flex w-80 flex-col items-center justify-center gap-4'
				align='end'>
				<ScrollArea className='max-h-[350px] overflow-y-auto'>
					<ul className='pr-3' role='list'>
						{notifications.map(notification => (
							<li
								key={notification.id}
								role='listitem'
								className={cn(
									'mb-2 grid grid-cols-[auto_1fr_auto] items-center gap-1 rounded-lg p-3',
									notification.readAt
										? 'bg-muted'
										: 'cursor-pointer bg-orange-50'
								)}
								onClick={() => handleMarkAsRead(notification.id)}>
								{NOTIFICATIONS_ICON[notification.type]
									? cloneElement(
											NOTIFICATIONS_ICON[notification.type] as ReactElement,
											{
												className: 'size-4',
											}
										)
									: null}
								<h4 className='font-secondary text-sm font-semibold'>
									{notification.subject}
								</h4>
								<Button
									className='p-0 text-foreground'
									variant='link'
									onClick={() => handleRemove(notification.id)}>
									<Trash2 className='size-4' />
								</Button>
								<p className='col-span-full font-secondary text-sm text-gray-600'>
									{notification.message}
								</p>
								<span
									className={cn(
										'col-span-full flex items-center gap-1 justify-self-end font-secondary text-xs',
										notification.readAt
											? 'text-orange-500'
											: 'text-muted-foreground'
									)}>
									{notification.readAt ? 'Leído' : 'No leído'}
									{notification.readAt ? (
										<MailCheck className='size-4' />
									) : (
										<MailWarning className='size-4' />
									)}
								</span>
							</li>
						))}
					</ul>
				</ScrollArea>

				{unreadCount > 0 && (
					<Button
						className='p-0 hover:no-underline'
						variant='link'
						onClick={handleAllMarkAsRead}>
						<CheckCheck className='mr-1 size-4' />
						Marcar todas como leídas
					</Button>
				)}
			</PopoverContent>
		</Popover>
	)
}

export default Notifications
