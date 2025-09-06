import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../button"
import { Client } from "@/types/clients-types"
import { getServicedImagesUrls } from "@/lib/DB/db-get-images"
import Image from "next/image";



export async function ViewSitePhotoSheet({client}:{client:Client}) {

    const imagesUrls = await getServicedImagesUrls(client.id);
    console.log(`imagesUrls`)
    console.log(imagesUrls)

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="text-blue-500 underline w-full ">View Site Service Photos</button>
            </SheetTrigger>
            <SheetContent className="overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>Site Serviced Photos</SheetTitle>
                    <SheetDescription>
                        View photos of the serviced sites.
                    </SheetDescription>
                </SheetHeader>
                {imagesUrls.map((imageUrl)=>(
                    <div className="my-2" key={imageUrl.imageurl}>
                        <Image height={400} width={400} src={imageUrl.imageurl} alt="photoServiced"/>
                    </div>

                ))}
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
