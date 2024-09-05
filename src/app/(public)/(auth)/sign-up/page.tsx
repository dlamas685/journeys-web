import { Pathnames } from '@/common/enums'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Metadata } from 'next'
import AuthFrame from '../_components/auth-frame'
import CompanySignUpForm from '../_components/company-sign-up-form'
import PersonalSignUpForm from '../_components/personal-sign-up-form'

export const metadata: Metadata = {
	title: 'Journeys • Registrarse',
	description: 'Regístrate y empieza a disfrutar de todo lo que ofrecemos',
}

export default function SignUpPage() {
	return (
		<AuthFrame
			title='Crea tu Cuenta'
			description='Regístrate y empieza a disfrutar de todo lo que ofrecemos'
			redirectText='¿Ya tienes una cuenta?'
			redirectLabel='Iniciar sesión'
			redirectTo={`/${Pathnames.LOGIN}`}>
			<Tabs defaultValue='personal' className='w-[400px] mt-4'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='personal'>Personal</TabsTrigger>
					<TabsTrigger value='company'>Empresa</TabsTrigger>
				</TabsList>
				<TabsContent value='personal'>
					<PersonalSignUpForm />
				</TabsContent>
				<TabsContent value='company'>
					<CompanySignUpForm />
				</TabsContent>
			</Tabs>
		</AuthFrame>
	)
}
