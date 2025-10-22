import SetViewMapButton from '../../buttons/set-view-map-button'
import ImageUploader from '../../image-uploader/image-uploader'
import ListViewHeader from './list-view-header'
import ListViewWrapper from './list-view-warapper'

export default function AddSiteMap({
	clientId,
	setView,
}: {
	clientId: number
	setView: React.Dispatch<React.SetStateAction<string>>
}) {
	return (
		<ListViewWrapper>
			<ListViewHeader text={'Save a Site Map Here'} />
			<div className="flex flex-row gap-4 justify-center bg-white/30 py-4 rounded-sm">
				<SetViewMapButton setFunction={setView} functionText="map">
					<div className="text-6xl">🗺️</div>
					<div>Capture from Maps</div>
				</SetViewMapButton>
				<ImageUploader clientId={clientId} setView={setView} />
			</div>
		</ListViewWrapper>
	)
}
