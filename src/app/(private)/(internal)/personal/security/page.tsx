import { hasPassword } from '@/common/actions/options.action'
import { Separator } from '@/components/ui/separator'
import PasswordChangeForm from '../../_components/others/password-change-form'
import PasswordChangeInfo from '../../_components/others/password-change-info'
import PasswordSettingForm from '../../_components/others/password-setting-form'

export default async function SecurityPage() {
	const canChangePassword = await hasPassword()

	return (
		<section className='mx-auto flex w-full max-w-4xl flex-grow flex-col gap-3 p-0 sm:gap-8 sm:py-0.5'>
			<h1 className='mb-5 text-center font-primary text-xl font-semibold italic sm:static sm:mb-0 sm:inline-block sm:text-left sm:text-2xl'>
				Seguridad de la cuenta
			</h1>
			<section className='flex flex-col gap-2'>
				<h2 className='font-secondary text-lg font-semibold sm:text-xl'>
					Cambiar contraseña
				</h2>
				<section className='grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-8'>
					{canChangePassword ? <PasswordChangeForm /> : <PasswordSettingForm />}
					<Separator orientation='vertical' className='hidden sm:block' />
					<PasswordChangeInfo />
				</section>
			</section>

			{/* <section className='flex flex-col gap-2'>
				<h2 className='font-secondary text-xl font-semibold'>
					Activar autenticación de dos factores
				</h2>
				@TwoFactorAuthComponent
			</section> */}
		</section>
	)
}
