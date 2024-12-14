'use client'
import { ActivityTemplateModel } from '@/common/models'
import { useState } from 'react'

type Props = {
	record: ActivityTemplateModel
}

const Detail = ({ record }: Readonly<Props>) => {
	const [seeMore, setSeeMore] = useState<boolean>(false)

	const toggleSeeMore = () => setSeeMore(!seeMore)

	return (
		<article className='grid max-h-96 grid-cols-1 gap-3 overflow-y-auto px-4 sm:max-h-[inherit] sm:grid-cols-[auto_1fr] sm:gap-4'></article>
	)
}

export default Detail
