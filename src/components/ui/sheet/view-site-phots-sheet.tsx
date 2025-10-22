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
import { Button } from '../button'
import { getServicedImagesUrls } from '@/lib/DB/db-get-images'
import ServicedImageCarousel from '../client-list/serviced-image-carousel'
import SheetLogoHeader from '../header/sheet-logo-header'
import FormHeader from '../header/form-header'

export async function ViewSitePhotoSheet({ clientId }: { clientId: number }) {
	//TODO: this is a db function put it behind a dal
	const imagesUrlsObjects = await getServicedImagesUrls(clientId)

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button className="text-blue-500 underline w-full ">
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
