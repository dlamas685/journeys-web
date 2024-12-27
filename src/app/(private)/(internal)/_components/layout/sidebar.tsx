'use client'
import Logout from '@/common/components/ui/misc/logout'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { ChevronsRight, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MenuItem } from '../../_types/menu-item.type'

type Props = {
	items: MenuItem[]
}

const Sidebar = ({ items }: Readonly<Props>) => {
	const pathname = usePathname()

	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button
					type='button'
					aria-label='Abrir menú de navegación'
					aria-disabled='false'
					className='absolute sm:hidden'
					variant='outline'
					size='icon'
					onClick={() => {
						setOpen(!open)
					}}>
					<ChevronsRight />
				</Button>
			</SheetTrigger>
			<SheetContent className='flex w-72 flex-col' side='left'>
				<SheetHeader className='flex items-center gap-1'>
					<SheetTitle></SheetTitle>
					<SheetDescription></SheetDescription>
					<Link href='/' onClick={() => setOpen(false)}>
						<Image
							src='/brand/imagotype-v1.png'
							alt='Logo de la aplicación'
							width={250}
							height={250}
							className='size-28'
							priority
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						/>
					</Link>
				</SheetHeader>

				<nav className='flex flex-grow flex-col gap-3'>
					{items.map(item => (
						<Button
							key={item.id}
							asChild
							variant={pathname.includes(item.href) ? 'default' : 'ghost'}
							className='items-center justify-start gap-2'
							onClick={() => {
								setOpen(false)
							}}>
							<Link aria-label={`Ir a ${item.label}`} href={item.href} prefetch>
								{item.icon}
								<span>{item.label}</span>
							</Link>
						</Button>
					))}
				</nav>
				<SheetFooter>
					<Logout
						variant='ghost'
						className='justify-start'
						aria-label='Cerrar Sesión'
						aria-disabled='false'>
						<LogOut />
						<span className='ml-1'>Cerrar sesión</span>
					</Logout>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

export default Sidebar
