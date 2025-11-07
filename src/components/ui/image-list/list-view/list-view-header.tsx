export default function ListViewHeader({ text }: { text: string }) {
	return (
		<div className="my-3 w-full text-center font-bold text-white text-xl">
			{text}
		</div>
	)
}
