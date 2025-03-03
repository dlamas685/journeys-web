'use client'
import animationData from '@/lotties/microphone.json'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type Props = {
	loop: boolean
}

export const Microphone = ({ loop }: Readonly<Props>) => {
	return (
		<Lottie
			animationData={animationData}
			className='size-40'
			loop={loop}
			autoPlay={false}
			rendererSettings={{
				preserveAspectRatio: 'xMidYMid slice',
			}}
		/>
	)
}
