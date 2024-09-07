import Logout from '@/common/components/ui/misc/logout'
import { LogOut } from 'lucide-react'

export default function HomePage() {
	return (
		<div>
			<h1>Home Page</h1>
			<Logout variant='outline'>
				<LogOut size={15} />
				<span className='ml-1'>Cerrar sesión</span>
			</Logout>
		</div>
	)
}
