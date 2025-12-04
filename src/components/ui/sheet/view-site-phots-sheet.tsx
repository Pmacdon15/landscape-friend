import { Camera } from 'lucide-react'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { getServicedImagesUrls } from '@/lib/dal/clients-dal'
import { Button } from '../button'
import ServicedImageCarousel from '../client-list/serviced-image-carousel'
import FormHeader from '../header/form-header'
import SheetLogoHeader from '../header/sheet-logo-header'

export async function ViewSitePhotoSheet({ clientId }: { clientId: number }) {
	const imagesUrlsObjects = await getServicedImagesUrls(clientId)

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button
					className="mx-auto flex gap-2 text-blue-500 underline hover:cursor-pointer"
					type="button"
				>
					<Camera />
					View Site Service Photos
				</button>
			</SheetTrigger>
			<SheetContent className="overflow-y-scroll">
				<SheetLogoHeader />
				<SheetHeader>
					<SheetTitle>Site Serviced Photos</SheetTitle>
					<SheetDescription>
						View photos of the serviced sites.
					</SheetDescription>
				</SheetHeader>
				{imagesUrlsObjects.length > 0 ? (
					<ServicedImageCarousel imageUrlList={imagesUrlsObjects} />
				) : (
					<div className="m-2">
						<FormHeader>
							Add Images by marking yard serviced
						</FormHeader>
					</div>
				)}
				<SheetFooter>
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
