export default function ScribeIframe({ url }: { url: string }) {
	return (
		<iframe
			allow="fullscreen"
			className="aspect-square border-0 rounded-sm min-h-[400px] max-h-[600px] max-w-full w-full"
			src={url}
			title="Docs"
		/>
	)
}
