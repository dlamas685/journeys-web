'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItem } from '../../_types/menu-item.type'

type Props = {
	items: MenuItem[]
}

const Navbar = ({ items }: Readonly<Props>) => {
	const pathname = usePathname()

	return (
		<nav className='hidden w-full justify-between sm:flex'>
			{items.map(item => (
				<Link
					key={item.id}
					aria-label={`Ir a ${item.label}`}
					href={item.href}
					prefetch
					className={cn(
						'flex max-w-20 flex-col items-center gap-1 font-secondary transition-all duration-300 hover:scale-105 hover:text-orange-500',
						pathname.includes(item.href)
							? 'scale-105 text-orange-500'
							: 'text-black'
					)}>
					{item.icon}
					<span className='text-center text-sm'>{item.label}</span>
				</Link>
			))}
		</nav>
	)
}

export default Navbar
