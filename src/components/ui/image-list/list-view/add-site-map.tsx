import SetViewMapButton from '../../buttons/set-view-map-button'
import ImageUploader from '../../image-uploader/image-uploader'
import ListViewHeader from './list-view-header'
import ListViewWrapper from './list-view-warapper'

export default function AddSiteMap({
	addressId,
	setView,
	pagePromise,
}: {
	addressId: number
	setView: React.Dispatch<React.SetStateAction<string>>
	pagePromise: Promise<number>
}) {
	return (
		<ListViewWrapper>
			<ListViewHeader text={'Save a Site Map Here'} />
			<div className="flex flex-row justify-center gap-4 rounded-sm bg-white/30 py-4">
				<SetViewMapButton functionText="map" setFunction={setView}>
					<div className="text-6xl">🗺️</div>
					<div>Capture from Maps</div>
				</SetViewMapButton>
				<ImageUploader
					addressId={addressId}
					pagePromise={pagePromise}
					setView={setView}
				/>
			</div>
		</ListViewWrapper>
	)
}
