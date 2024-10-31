'use client'

import { DialogContext } from '@/common/contexts/dialog-context'
import { useMediaQuery } from '@/common/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { ComponentProps, ReactNode, useState } from 'react'

type Props = {
	children: ReactNode
	title: string
	description?: string
	triggerLabel?: string
	triggerIcon?: ReactNode
	triggerProps?: ComponentProps<typeof Button>
	submitIcon?: ReactNode
	submitLabel?: string
	submitProps?: ComponentProps<typeof Button>
}

const Modal = ({
	children,
	title,
	description,
	triggerProps,
	triggerLabel,
	triggerIcon,
	submitProps,
	submitLabel = 'Aceptar',
	submitIcon,
}: Readonly<Props>) => {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')

	if (isDesktop) {
		return (
			<DialogContext.Provider
				value={{
					open,
					setOpen,
				}}>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button {...triggerProps}>
							{triggerIcon}
							{triggerLabel}
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>{title}</DialogTitle>
							<DialogDescription>{description}</DialogDescription>
						</DialogHeader>
						{children}
						<DialogFooter>
							<Button type='submit' {...submitProps}>
								{submitIcon}
								{submitLabel}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</DialogContext.Provider>
		)
	}

	return (
		<DialogContext.Provider
			value={{
				open,
				setOpen,
			}}>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button {...triggerProps}>
						{triggerIcon}
						{triggerLabel}
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className='text-left'>
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{description}</DrawerDescription>
					</DrawerHeader>
					{children}
					<DrawerFooter className='sm:pt-2'>
						<Button type='submit' {...submitProps}>
							{submitIcon}
							{submitLabel}
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</DialogContext.Provider>
	)
}

export default Modal
