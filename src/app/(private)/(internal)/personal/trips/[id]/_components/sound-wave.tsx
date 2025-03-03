'use client'
import animationData from '@/lotties/sound-wave.json'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type Props = {
	loop: boolean
}

const SoundWave = ({ loop }: Readonly<Props>) => {
	return (
		<Lottie
			animationData={animationData}
			className='h-10'
			autoPlay={false}
			loop={loop}
			rendererSettings={{
				preserveAspectRatio: 'xMidYMid slice',
			}}
		/>
	)
}

export default SoundWave
