import Image from 'next/image'
import ListViewHeader from './list-view-header'
import ListViewWrapper from './list-view-warapper'

export default function NonAdminPlaceHolder() {
	return (
		<ListViewWrapper>
			<ListViewHeader text={'No Site Map uploaded'} />
			<div className="flex flex-row gap-4 justify-center bg-white/30 py-4 rounded-sm h-55 ">
				<Image
					alt="Placeholder image"
					className="p-2"
					height={400}
					src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/placeholdermap_padded_green.png"
					width={400}
				/>
			</div>
		</ListViewWrapper>
	)
}
