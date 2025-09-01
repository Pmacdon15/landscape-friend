import { getServicedImagesUrls } from "@/lib/DB/db-get-images";
import { Client } from "@/types/types-clients";
import Image from "next/image";

export default async function ListServices({ client }: { client: Client }) {
  const imagesUrls = await getServicedImagesUrls(client.id);

  console.log(imagesUrls);
  return (
    <>
    <div className="flex flex-col items-center justify-center mt-2 w-full lg:w-4/6  mx-auto min-h-[300px] overflow-y-auto bg-background rounded-md p-2">
        <h1 className="text-white font-bold">{`Last Service: ${imagesUrls[0].date.toDateString()}`}</h1>
        <Image
          alt="Image"
          src={imagesUrls[0].image_url}
          width={400}
          height={400}
        />
      </div>
    </>
  );
}
