'use client'
import Logout from '@/common/components/ui/misc/logout'
import { Button } from '@/components/ui/button'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronsRight, LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MenuItem } from '../../_types/menu-item.type'

type Props = {
	items: MenuItem[]
}

const Navbar = ({ items }: Readonly<Props>) => {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	return (
		<nav className='mx-auto w-full p-0 sm:max-w-sm md:max-w-3xl'>
			<Carousel className='hidden sm:block'>
				<CarouselContent className='justify-around gap-4'>
					{items.map(item => (
						<CarouselItem key={item.id} className='basis-auto'>
							<Link
								aria-label={`Ir a ${item.label}`}
								href={item.href}
								prefetch
								className={cn(
									'flex max-w-20 flex-col items-center gap-1 font-secondary transition-all duration-100 hover:text-orange-500',
									pathname.includes(item.href)
										? 'text-orange-500'
										: 'text-black'
								)}>
								{item.icon}
								<span className='text-center text-sm'>{item.label}</span>
							</Link>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
			</Carousel>

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
				<SheetContent className='flex w-[240px] flex-col' side='left'>
					<SheetHeader className='flex items-center gap-1'>
						<Image
							src='/brand/imagotype-v1.png'
							alt='Logo de la aplicación'
							width={250}
							height={250}
							className='size-28'
							priority
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						/>
					</SheetHeader>

					<nav className='flex flex-grow flex-col gap-3'>
						{items.map(item => (
							<Button
								key={item.id}
								asChild
								variant={pathname === item.href ? 'default' : 'ghost'}
								className='items-center justify-start gap-2'
								onClick={() => {
									setOpen(false)
								}}>
								<Link
									aria-label={`Ir a ${item.label}`}
									href={item.href}
									prefetch>
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
		</nav>
	)
}

export default Navbar
