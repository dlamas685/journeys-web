import { hasPassword } from '@/common/actions/options.action'
import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { Separator } from '@/components/ui/separator'
import PasswordChangeForm from '../../_components/others/password-change-form'
import PasswordChangeInfo from '../../_components/others/password-change-info'
import PasswordSettingForm from '../../_components/others/password-setting-form'

export default async function SecurityPage() {
	const canChangePassword = await hasPassword()

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Seguridad de la cuenta</FrameTitle>
			</FrameHeader>
			<FrameBody>
				<section className='flex flex-col gap-2'>
					<h2 className='font-secondary text-lg font-semibold sm:text-xl'>
						Cambiar contraseña
					</h2>
					<section className='grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-8'>
						{canChangePassword ? (
							<PasswordChangeForm />
						) : (
							<PasswordSettingForm />
						)}
						<Separator orientation='vertical' className='hidden sm:block' />
						<PasswordChangeInfo />
					</section>
				</section>
			</FrameBody>
		</Frame>
	)
}
