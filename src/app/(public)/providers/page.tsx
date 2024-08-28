'use client'

import { validateToken } from '@/common/actions/auth.action'
import { Pathnames } from '@/common/enums'
import { SearchParams } from '@/common/types'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import RiseLoader from 'react-spinners/RiseLoader'

type Props = {
	searchParams: SearchParams
}

export default function ProvidersPage({ searchParams }: Readonly<Props>) {
	const token = searchParams['token']

	const router = useRouter()

	useEffect(() => {
		if (token) {
			validateToken(token)
				.then(() => {
					router.push(`/${Pathnames.HOME}`)
				})
				.catch(() => {
					router.push(`${Pathnames.LOGIN}`)
				})
		} else {
			router.push(`${Pathnames.LOGIN}`)
		}
	}, [router, token])

	return (
		<section className='flex justify-center items-center w-full min-h-screen bg-white'>
			<section className='flex justify-center items-center absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]'>
				<RiseLoader loading={true} />
			</section>
		</section>
	)
}
