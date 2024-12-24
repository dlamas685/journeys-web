import { findProfile } from '@/common/actions/options.action'
import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { getNameInitials } from '@/common/utils'
import { Metadata } from 'next'
import ProfilePicture from '../../_components/others/profile-picture'
import ProfileForm from './_components/profile-form'

export const metadata: Metadata = {
	title: 'Journeys • Mi perfil',
	description: 'Administra tu perfil de usuario.',
}

export default async function ProfilePage() {
	const user = await findProfile()

	const name = `${user.personalProfile?.firstName} ${user.personalProfile?.lastName}`

	const nameInitials = getNameInitials(name)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Mi perfil</FrameTitle>
			</FrameHeader>
			<FrameBody className='max-w-2xl'>
				<ProfilePicture
					label={nameInitials}
					imageUrl={user.imageUrl}
					imageAlt={name}
				/>
				<ProfileForm user={user} />
			</FrameBody>
		</Frame>
	)
}
