import { findProfile } from '@/common/actions/options.action'
import ProfilePicture from '@/common/components/ui/misc/profile-picture'
import { getNameInitials } from '@/common/utils'
import ProfileForm from './_components/profile-form'

export default async function ProfilePage() {
	const user = await findProfile()
	const name = user.companyProfile?.name ?? ''
	const nameInitials = getNameInitials(name)

	return (
		<section className='mx-auto flex w-full max-w-4xl flex-grow flex-col gap-3 p-0 sm:gap-8 sm:py-0.5'>
			<h1 className='mb-5 text-center font-primary text-2xl font-semibold italic sm:static sm:mb-0 sm:inline-block sm:text-left'>
				Mi perfil
			</h1>
			<ProfilePicture
				label={nameInitials}
				imageUrl={user.imageUrl}
				imageAlt={name}
			/>
			<ProfileForm user={user} />
		</section>
	)
}
