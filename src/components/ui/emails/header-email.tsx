import { HeaderEmailProps } from "@/types/types";
import {
  Body,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";



export default function HeaderEmail({
  text,
  senderName,
  companyName,
  title,
}: HeaderEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Email from {companyName}</Preview>
        <Body className="bg-white text-black w-full m-0 p-0">
          {/* Full-width green header */}
          <div className="flex items-center align-middle bg-[#138b10] border border-black/30 w-full h-[100px] p-4 rounded-b-sm">

            <Img
              src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/Screenshot%20From%202025-07-28%2020-45-07.png"
              alt="Lawn Buddy Logo"
              className="w-[100px] h-[100px] rounded-md border"
            />

            <div className="text-2xl text-center md:text-4xl p-2 md:p-6">
              <span>Lawn Buddy</span>
            </div>
            <div className="w-[80px] h-[80px] rounded-md border">{" "}          </div>
          </div>

          {/* Main content container */}
          {/* <Container className="max-w-xl mx-auto px-6 py-6"> */}
          <Heading className="text-[#138b10] text-xl font-bold mb-4 ">
            {title}
          </Heading>

          <Text className="text-base leading-relaxed">{text}</Text>

          <Text className="text-sm mt-6 font-semibold">{senderName}</Text>
          {/* </Container> */}
        </Body>
      </Html>
    </Tailwind>
  );
}