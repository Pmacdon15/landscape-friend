import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../carousel";

interface ServicedImage {
    date: Date;
    imageurl: string;
}

export default function ServicedImageCarousel({ imageUrlList }: { imageUrlList: ServicedImage[] }) {
    return (
        <div className="p-8">
            <Carousel>
                <CarouselContent>
                    {imageUrlList.map((image, index) => (
                        <CarouselItem key={index}>
                            <Image width={500} height={500} src={image.imageurl} alt={`Serviced Image: ${index}`} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}