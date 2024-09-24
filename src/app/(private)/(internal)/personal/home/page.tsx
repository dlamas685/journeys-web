import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Journeys • Inicio',
	description: 'Bienvenido a Journeys, disfruta de tu estancia',
}

export default async function HomePage() {
	return (
		<div>
			<h1>Hello Home Page</h1>
		</div>
	)
}
