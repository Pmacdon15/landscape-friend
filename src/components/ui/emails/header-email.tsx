import {
	Body,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Tailwind,
	Text,
} from '@react-email/components'
import type { HeaderEmailProps } from '@/types/resend-types'

export default function HeaderEmail({
	text,
	senderName,
	companyName,
	title,
}: HeaderEmailProps) {
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>Email from {companyName}</Preview>
				<Body className="m-0 w-full bg-white p-0 text-black">
					{/* Image header */}
					<Img
						alt="Landscape Friend Logo"
						className="h-auto w-full"
						src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/email-header-Jz4uQWzokbCXtDz6I8i45CcrTdx6sj"
					/>

					{/* Main content container */}
					<div className="mx-auto max-w-xl px-6 py-6">
						<Heading className="mb-4 font-bold text-[#138b10] text-xl">
							{title}
						</Heading>

						<Text className="text-base leading-relaxed">
							{text}
						</Text>

						<Text className="mt-6 font-semibold text-sm">
							{senderName}
						</Text>
					</div>
				</Body>
			</Html>
		</Tailwind>
	)
}
