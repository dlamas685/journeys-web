import { findProfile } from '@/common/actions/options.action'
import {
	Frame,
	FrameBody,
	FrameHeader,
	FrameTitle,
} from '@/common/components/layout/frame'
import { getNameInitials } from '@/common/utils'
import ProfilePicture from '../../_components/others/profile-picture'
import ProfileForm from './_components/profile-form'

export default async function ProfilePage() {
	const user = await findProfile()

	const name = `${user.personalProfile?.firstName} ${user.personalProfile?.lastName}`

	const nameInitials = getNameInitials(name)

	return (
		<Frame>
			<FrameHeader>
				<FrameTitle>Mi perfil</FrameTitle>
			</FrameHeader>
			<FrameBody>
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
