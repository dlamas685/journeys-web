import { ReactNode } from 'react'

type Props = {
	children: ReactNode
}

export default function InternalLayout({ children }: Readonly<Props>) {
	return (
		<div>
			<h1>Hello Root Layout Internal</h1>
			{children}
		</div>
	)
}
