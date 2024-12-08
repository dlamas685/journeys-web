'use client'
import { logOut } from '@/common/actions/auth.action'
import { Pathnames, UserTypes } from '@/common/enums'
import { UserModel } from '@/common/models'
import { getNameInitials } from '@/common/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { CreditCard, LogOut, ShieldCheck, UserRoundPen } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
	user: UserModel
	className?: string
}

const Profile = ({ user, className }: Readonly<Props>) => {
	const pathname = usePathname()

	const name =
		user.userType === UserTypes.PERSONAL
			? `${user.personalProfile?.firstName} ${user.personalProfile?.lastName}`
			: `${user.companyProfile?.name}`

	const nameInitials = getNameInitials(name)

	const pathRoot = user.userType?.toLowerCase()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={className}>
				<Avatar className='size-11 rounded-xl'>
					<AvatarImage src={user.imageUrl ?? ''} alt={user.email} />
					<AvatarFallback className='size-11 rounded-xl bg-orange-500/10 font-secondary text-orange-500'>
						{nameInitials}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='flex flex-col gap-1' align='end'>
				<DropdownMenuLabel>
					<h3 className='font-secondary text-base font-semibold'>{name}</h3>
					<p className='font-secondary text-sm font-normal'>{user.email}</p>
				</DropdownMenuLabel>
				<DropdownMenuItem className='cursor-pointer gap-1' asChild>
					<Link
						aria-label='Ir a mi perfil'
						href={`/${pathRoot}/${Pathnames.PROFILE}`}
						prefetch
						className={cn(
							pathname.includes(Pathnames.PROFILE)
								? 'text-orange-500'
								: 'text-black'
						)}>
						<UserRoundPen className='size-4' />
						Mi perfil
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className='cursor-pointer gap-1' asChild>
					<Link
						aria-label='Ir a la configuración de seguridad'
						href={`/${pathRoot}/${Pathnames.SECURITY}`}
						prefetch
						className={cn(
							pathname.includes(Pathnames.SECURITY)
								? 'text-orange-500'
								: 'text-black'
						)}>
						<ShieldCheck className='size-4' />
						Seguridad
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className='cursor-pointer gap-1' asChild>
					<Link
						aria-label='Ir a las formas de pago'
						href={`/${pathRoot}/${Pathnames.PAYMENTS}`}
						prefetch
						className={cn(
							pathname.includes(Pathnames.PAYMENTS)
								? 'text-orange-500'
								: 'text-black'
						)}>
						<CreditCard className='size-4' />
						Formas de pago
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					aria-label='Cerrar sesión'
					aria-disabled='false'
					className='cursor-pointer gap-1'
					onClick={async () => {
						await logOut()
					}}>
					<LogOut className='size-4' />
					<span>Cerrar sesión</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default Profile
