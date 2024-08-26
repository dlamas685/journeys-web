import { getServerToken } from '@/common/actions/session.action'

export default async function HomePage() {
	const token = await getServerToken()

	console.log({ token })

	return (
		<div>
			<h1>Home Page</h1>
		</div>
	)
}
