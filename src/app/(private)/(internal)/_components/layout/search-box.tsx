'use client'

import { UserTypes } from '@/common/enums'
import { UserModel } from '@/common/models'
import { Button } from '@/components/ui/button'
import {
	CommandDialog,
	CommandEmpty,
	CommandInput,
	CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Search } from 'lucide-react'
import { ComponentProps, useEffect, useState } from 'react'

type Props = ComponentProps<typeof Button> & {
	placeholder?: string
	user: UserModel
}

const SearchBox = ({
	className,
	placeholder,
	user,
	...rest
}: Readonly<Props>) => {
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(open => !open)
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	const runCommand = (command: () => unknown) => {
		setOpen(false)
		command()
	}

	return (
		<>
			<Button
				type='button'
				aria-label={
					user.userType === UserTypes.PERSONAL
						? 'Buscar publicaciones'
						: 'Buscar hojas de ruta'
				}
				aria-disabled='false'
				variant='outline'
				className={cn(
					'h-10 w-full items-center justify-start gap-2 border-none bg-muted px-4 font-secondary text-sm font-normal text-muted-foreground shadow-none hover:bg-muted-foreground/15 hover:text-accent-foreground md:max-w-sm',
					className
				)}
				onClick={() => setOpen(true)}
				{...rest}>
				<Search className='h-4 w-4' />
				<span className='inline-flex flex-grow'>
					{user.userType === UserTypes.PERSONAL
						? 'Buscar publicaciones'
						: 'Buscar hojas de ruta'}
				</span>
				<kbd className='pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-secondary text-[10px] font-medium opacity-100 sm:flex'>
					<span className='text-xs'>⌘</span>K
				</kbd>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogTitle></DialogTitle>
				<CommandInput
					placeholder={
						user.userType === UserTypes.PERSONAL
							? 'Escribe una dirección'
							: 'Escribe el alias de una hoja de ruta'
					}
				/>
				<CommandList>
					<CommandEmpty>No se encontraron resultados</CommandEmpty>
				</CommandList>
			</CommandDialog>
		</>
	)
}

export default SearchBox
