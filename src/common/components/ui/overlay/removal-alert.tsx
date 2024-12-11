'use client'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	type ComponentProps,
	type ReactNode,
	Dispatch,
	SetStateAction,
	useState,
} from 'react'

type EraserButtonProps = {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}

type Props = {
	title?: string
	description?: ReactNode
	triggerLabel?: string
	triggerIcon?: ReactNode
	triggerProps?: ComponentProps<typeof Button>
	cancelLabel?: string
	cancelIcon?: ReactNode
	eraserButton?: ({ open, setOpen }: EraserButtonProps) => JSX.Element
}

const RemovalAlert = ({
	title = 'Confirmar eliminación',
	description = '¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.',
	triggerLabel,
	triggerIcon,
	triggerProps,
	cancelLabel = 'Cancelar',
	cancelIcon,
	eraserButton,
}: Readonly<Props>) => {
	const [open, setOpen] = useState(false)

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant='erased' {...triggerProps}>
					{triggerIcon}
					{triggerLabel}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						{cancelIcon}
						{cancelLabel}
					</AlertDialogCancel>
					{eraserButton && eraserButton({ open, setOpen })}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default RemovalAlert
