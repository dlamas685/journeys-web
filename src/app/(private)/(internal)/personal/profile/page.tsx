import { findProfile } from '@/common/actions/options.action'
import ProfilePicture from '@/common/components/ui/misc/profile-picture'
import { getNameInitials } from '@/common/utils'
import ProfileForm from './_components/profile-form'

export default async function ProfilePage() {
	const user = await findProfile()

	const name = `${user.personalProfile?.firstName} ${user.personalProfile?.lastName}`

	const nameInitials = getNameInitials(name)

	return (
		<section className='flex w-full flex-grow flex-col items-center gap-3 p-0 sm:gap-5 sm:py-0.5'>
			<h1 className='mb-4 font-primary text-2xl font-bold italic sm:static sm:mb-0 sm:inline-block'>
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
