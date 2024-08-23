import { Hind_Madurai, Lora } from 'next/font/google'

export const primaryFont = Lora({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	style: ['italic', 'normal'],
	variable: '--font-lora',
})

export const secondaryFont = Hind_Madurai({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	style: ['normal'],
	variable: '--font-hind-madurai',
})
