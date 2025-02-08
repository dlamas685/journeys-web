import { useMediaQuery } from '@/common/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { ComponentProps, ReactNode, useState } from 'react'

type Props = {
	children: ReactNode
	label: string
	title: string
	description: string
	icon: ReactNode
	triggerProps?: ComponentProps<typeof Button>
	triggerResponsiveProps?: ComponentProps<typeof Button>
}

const ResponsiveSheet = ({
	label,
	title,
	description,
	children,
	icon,
	triggerProps,
	triggerResponsiveProps,
}: Readonly<Props>) => {
	const [open, setOpen] = useState<boolean>(false)
	const isDesktop = useMediaQuery('(min-width: 640px)')

	if (isDesktop) {
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button type='button' variant='secondary' {...triggerProps}>
						{icon}
						<span className='ml-1'>{label}</span>
					</Button>
				</SheetTrigger>
				<SheetContent className='overflow-y-auto sm:max-w-2xl'>
					<SheetHeader>
						<SheetTitle>{title}</SheetTitle>
						<SheetDescription>{description}</SheetDescription>
					</SheetHeader>
					{children}
				</SheetContent>
			</Sheet>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button type='button' variant='secondary' {...triggerResponsiveProps}>
					{icon}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className='text-left'>
					<DrawerTitle>{title}</DrawerTitle>
					<DrawerDescription>{description}</DrawerDescription>
				</DrawerHeader>
				{children}
			</DrawerContent>
		</Drawer>
	)
}

export default ResponsiveSheet
