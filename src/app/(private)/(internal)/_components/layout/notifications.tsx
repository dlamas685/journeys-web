'use client'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
	Bell,
	CarTaxiFront,
	CheckCheck,
	Newspaper,
	TicketPercent,
} from 'lucide-react'
import { ReactNode, useState } from 'react'

interface Notification {
	id: number
	title: string
	message: string
	icon: ReactNode
	read: boolean
}

type Props = {
	className?: string
}

const Notifications = ({ className }: Readonly<Props>) => {
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: 1,
			title: 'Viajes',
			message: 'To próximo viaje está a punto de comenzar',
			icon: <CarTaxiFront className='size-5' />,
			read: false,
		},
		{
			id: 2,
			title: 'Publicaciones',
			message: 'Han realizado un encargo en tu publicación',
			icon: <Newspaper className='size-5' />,
			read: false,
		},
		{
			id: 3,
			title: 'Viajes',
			message: 'La ruta de tu viaje ha sido actualizada',
			icon: <CarTaxiFront className='size-5' />,
			read: true,
		},
		{
			id: 4,
			title: 'Publicaciones',
			message: 'Tu publicación ha sido completada',
			icon: <Newspaper className='size-5' />,
			read: false,
		},
		{
			id: 5,
			title: 'Suscripciones',
			message:
				'Adquiere tu membresía premium con un 50% de descuento por tiempo limitado',
			icon: <TicketPercent className='size-5' />,
			read: true,
		},
	])

	const unreadCount = notifications.filter(n => !n.read).length

	const markAsRead = (id: number) => {
		setNotifications(
			notifications.map(n => (n.id === id ? { ...n, read: true } : n))
		)
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
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
			<PopoverContent className='w-80' align='end'>
				<ScrollArea className='h-[300px] overflow-y-auto'>
					<section className='pr-3'>
						{notifications.map(notification => (
							<div
								key={notification.id}
								className={`mb-2 grid cursor-pointer grid-cols-[auto_1fr] items-center gap-1 rounded-lg p-3 ${notification.read ? 'bg-muted' : 'bg-orange-50'}`}
								onClick={() => markAsRead(notification.id)}>
								{notification.icon}
								<h4 className='font-secondary text-sm font-semibold'>
									{notification.title}
								</h4>
								<p className='col-span-full font-secondary text-sm text-gray-600'>
									{notification.message}
								</p>
								<span
									className={cn(
										'col-span-full flex items-center gap-1 justify-self-end font-secondary text-xs',
										notification.read
											? 'text-orange-500'
											: 'text-muted-foreground'
									)}>
									{notification.read ? 'Leído' : 'No leído'}
									<CheckCheck className='size-4' />
								</span>
							</div>
						))}
					</section>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	)
}

export default Notifications
