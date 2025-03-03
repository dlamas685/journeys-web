'use client'
import { ApiError } from '@/common/classes/api-error.class'
import { ApiEndpoints } from '@/common/enums'
import useResponse from '@/common/hooks/use-response'
import { useLoading } from '@/common/stores/loading.store'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { CircleX, LoaderCircle, Mic, MicOff, PlayCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
	createRealTimeSession,
	negotiateSDP,
} from '../_actions/assistant.action'
import { Microphone } from './microphone'
import SoundWave from './sound-wave'

type PermissionState = 'granted' | 'denied'

type Props = {
	tripId: string
}

export default function WebRTCAudio({ tripId }: Props) {
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null)

	const audioRef = useRef<HTMLAudioElement | null>(null)

	const response = useResponse()

	const [currentTime, setCurrentTime] = useState(0)

	const [devices, setDevices] = useState<MediaDeviceInfo[]>([])

	const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)

	const [isMuted, setIsMuted] = useState<boolean>(false)

	const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default')

	const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

	const [isAssistantSpeaking, setIsAssistantSpeaking] = useState<boolean>(false)

	const setLoading = useLoading(state => state.setLoading)

	const isLoading = useLoading(state => state.loading)

	const [permission, setPermission] = useState<PermissionState | null>(null)

	const handleCreateSession = async () => {
		setLoading(true)

		return await createRealTimeSession(ApiEndpoints.ASSISTANT_SESSION, {
			tripId,
		})
			.then(resp => {
				if ('error' in resp) {
					throw new ApiError(resp)
				}

				return resp
			})
			.catch(error => {
				response.error(error)
				setLoading(false)
				return null
			})
	}

	const handleSetConnection = async (clientSecret: string) => {
		if (!mediaStream) return

		const config: RTCConfiguration = {
			iceServers: [
				{ urls: 'stun:stun.l.google.com:19302' },
				{ urls: 'stun:stun1.l.google.com:19302' },
				{ urls: 'stun:stun2.l.google.com:19302' },
			],
			iceTransportPolicy: 'all',
		}

		const peerConnection = new RTCPeerConnection(config)

		peerConnection.ontrack = e => {
			if (audioRef.current) {
				audioRef.current.srcObject = e.streams[0]
			}

			detectAssistantSpeaking(e.streams[0])
		}

		peerConnection.addTrack(mediaStream.getTracks()[0])

		const dataChannel = peerConnection.createDataChannel('oai-events')

		dataChannel.addEventListener('message', e => {
			console.log(e)
		})

		const offer = await peerConnection.createOffer()

		await peerConnection.setLocalDescription(offer)

		const sdp = await negotiateSDP(clientSecret, offer.sdp)

		const answer: RTCSessionDescriptionInit = {
			type: 'answer',
			sdp,
		}

		await peerConnection.setRemoteDescription(answer)

		peerConnectionRef.current = peerConnection

		setLoading(false)

		handlePlay()
	}

	const handleStartSession = async () => {
		const realTimeSession = await handleCreateSession()

		if (!realTimeSession) return

		await handleSetConnection(realTimeSession.clientSecret)
	}

	const handleCloseConnection = () => {
		if (peerConnectionRef.current) {
			handlePause()
			peerConnectionRef.current.close()
			peerConnectionRef.current = null
		}
	}

	const handleValueChange = async (value: string) => {
		await navigator.mediaDevices
			.getUserMedia({
				audio: {
					deviceId: { exact: value },
				},
			})
			.then(stream => {
				setMediaStream(stream)
				setSelectedDeviceId(value)
			})
	}

	const handleMicrophone = async () => {
		const audioTrack = mediaStream?.getAudioTracks()[0]

		if (audioTrack) {
			audioTrack.enabled = !audioTrack.enabled
			setIsMuted(!audioTrack.enabled)
		}
	}

	const handleFormatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
	}

	const handlePlay = () => {
		if (audioRef.current) {
			audioRef.current.play()
		}
	}

	const handlePause = () => {
		if (audioRef.current) {
			audioRef.current.pause()
		}
	}

	const detectAssistantSpeaking = (stream: MediaStream) => {
		const audioContext = new AudioContext()
		const analyser = audioContext.createAnalyser()
		const source = audioContext.createMediaStreamSource(stream)

		analyser.fftSize = 512
		const dataArray = new Uint8Array(analyser.frequencyBinCount)

		source.connect(analyser)

		let animationFrameId: number

		const detectAudio = () => {
			analyser.getByteFrequencyData(dataArray)
			const volume =
				dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length

			setIsAssistantSpeaking(volume > 10)

			animationFrameId = requestAnimationFrame(detectAudio)
		}

		detectAudio()

		return () => {
			cancelAnimationFrame(animationFrameId)
			analyser.disconnect()
			source.disconnect()
			audioContext.close()
		}
	}

	useEffect(() => {
		if (!mediaStream) return

		const audioContext = new AudioContext()
		const analyser = audioContext.createAnalyser()
		const microphone = audioContext.createMediaStreamSource(mediaStream)

		analyser.fftSize = 512
		const dataArray = new Uint8Array(analyser.frequencyBinCount)

		microphone.connect(analyser)

		let animationFrameId: number

		const detectNoise = () => {
			analyser.getByteFrequencyData(dataArray)
			const volume =
				dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length

			setIsSpeaking(volume > 10)

			animationFrameId = requestAnimationFrame(detectNoise)
		}

		detectNoise()

		return () => {
			cancelAnimationFrame(animationFrameId)
			analyser.disconnect()
			microphone.disconnect()
			audioContext.close()
		}
	}, [mediaStream])

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(mediaStream => {
				setMediaStream(mediaStream)
				setPermission('granted')

				return navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
					const audioDevices = mediaDevices.filter(
						device => device.kind === 'audioinput'
					)

					setDevices(audioDevices)
				})
			})
			.catch(error => {
				setPermission('denied')
			})
	}, [])

	useEffect(() => {
		const audio = audioRef.current

		if (!audio) return

		const updateTime = () => {
			setCurrentTime(audio.currentTime)
		}

		audio.addEventListener('timeupdate', updateTime)

		return () => {
			audio.removeEventListener('timeupdate', updateTime)
		}
	}, [audioRef])

	return (
		<section className='flex flex-grow flex-col items-center justify-center gap-5'>
			<h2 className='text-lg font-semibold'>Asistente Inteligente</h2>

			{permission === 'granted' && (
				<>
					{peerConnectionRef.current && (
						<>
							<Microphone loop={isSpeaking} />
							<SoundWave loop={isAssistantSpeaking} />
						</>
					)}

					<section className='flex flex-col items-center gap-4 rounded-md sm:grid sm:grid-cols-[auto_1fr_auto] sm:p-2 sm:shadow-bento'>
						{!peerConnectionRef.current && (
							<>
								<Button
									className='h-10'
									onClick={handleStartSession}
									disabled={isLoading}>
									{isLoading ? (
										<LoaderCircle className='mr-1 size-5 animate-spin' />
									) : (
										<PlayCircle className='mr-1 size-5' />
									)}
									Iniciar sesión
								</Button>

								<Select
									value={selectedDeviceId ?? undefined}
									onValueChange={handleValueChange}>
									<SelectTrigger className='max-w-64 whitespace-pre-wrap text-left sm:max-w-xs'>
										<SelectValue placeholder='Selecciona un dispositivo' />
									</SelectTrigger>
									<SelectContent className='max-w-64 sm:max-w-none'>
										<SelectGroup>
											<SelectLabel>Entrada de voz</SelectLabel>
											{devices.map(device => (
												<SelectItem
													key={device.deviceId}
													value={device.deviceId}>
													{device.label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</>
						)}

						<Button
							variant='ghost'
							className='size-10'
							size='icon'
							onClick={handleMicrophone}>
							{isMuted ? (
								<MicOff className='size-5' />
							) : (
								<Mic className='size-5' />
							)}
						</Button>

						<audio ref={audioRef} className='hidden' />

						{peerConnectionRef.current && (
							<>
								<div className='flex items-center justify-between gap-2 px-4'>
									<span className='font-secondary font-medium text-muted-foreground'>
										{handleFormatTime(currentTime)}
									</span>
								</div>
								<Button variant='ghost' onClick={handleCloseConnection}>
									<CircleX className='mr-1 size-5' />
									Cerrar sesión
								</Button>
							</>
						)}
					</section>
				</>
			)}

			{permission !== 'granted' && (
				<p className='font-secondary text-base text-muted-foreground'>
					{permission === 'denied'
						? 'Oops! No se ha podido acceder a la entrada de voz. Revisa los permisos de tu navegador.'
						: 'Obteniendo permisos de entrada de voz...'}
				</p>
			)}
		</section>
	)
}
