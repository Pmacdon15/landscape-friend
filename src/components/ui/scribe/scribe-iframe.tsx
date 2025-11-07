export default function ScribeIframe({ url }: { url: string }) {
	return (
		<iframe
			allow="fullscreen"
			className="aspect-square max-h-[600px] min-h-[400px] w-full max-w-full rounded-sm border-0"
			src={url}
			title="Docs"
		/>
	)
}
