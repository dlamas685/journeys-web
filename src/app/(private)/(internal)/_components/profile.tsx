'use client'
import { logOut } from '@/common/actions/auth.action'
import { Pathnames, UserTypes } from '@/common/enums'
import { UserModel } from '@/common/models'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreditCard, LogOut, UserRoundPen } from 'lucide-react'
import Link from 'next/link'

type Props = {
	user: UserModel
	className?: string
}

const Profile = ({ user, className }: Readonly<Props>) => {
	const name =
		user.userType === UserTypes.PERSONAL
			? `${user.personalProfile?.firstName} ${user.personalProfile?.lastName}`
			: `${user.companyProfile?.name}`

	const [firstName, lastName] = name.split(' ')

	const pathRoot = user.userType?.toLowerCase()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={className}>
				<Avatar className='size-11 rounded-xl'>
					<AvatarImage src={user.imageUrl ?? ''} alt={user.email} />
					<AvatarFallback className='h-11 w-11 rounded-xl'>{`${firstName?.at(0)}${lastName?.at(0)}`}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='flex flex-col gap-1' align='end'>
				<DropdownMenuLabel>
					<h3 className='font-secondary text-base font-semibold'>{name}</h3>
					<p className='font-secondary text-sm font-normal'>{user.email}</p>
				</DropdownMenuLabel>
				<DropdownMenuItem className='cursor-pointer gap-1' asChild>
					<Link href={`/${pathRoot}/${Pathnames.PROFILE}`}>
						<UserRoundPen className='size-4' />
						Mi perfil
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className='cursor-pointer gap-1' asChild>
					<Link href={`/${pathRoot}/${Pathnames.PAYMENTS}`}>
						<CreditCard className='size-4' />
						Formas de pago
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
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
