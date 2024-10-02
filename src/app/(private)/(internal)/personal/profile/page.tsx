import { findProfile } from '@/common/actions/options.action'
import ProfileForm from './_components/profile-form'
import ProfilePicture from './_components/profile-picture'

export default async function ProfilePage() {
	const user = await findProfile()
	const label =
		`${user.personalProfile?.firstName?.at(0) ?? ''}${user.personalProfile?.lastName.at(0) ?? ''}`.toUpperCase()

	return (
		<section className='flex w-full flex-grow flex-col items-center gap-3 p-0 sm:gap-5 sm:py-0.5'>
			<h1 className='mb-4 font-primary text-2xl font-bold italic sm:static sm:mb-0 sm:inline-block'>
				Mi perfil
			</h1>
			<ProfilePicture
				label={label}
				imageUrl={user.imageUrl}
				imageAlt={`${user.personalProfile?.firstName} ${user.personalProfile?.lastName}`}
			/>
			<ProfileForm user={user} />
		</section>
	)
}
