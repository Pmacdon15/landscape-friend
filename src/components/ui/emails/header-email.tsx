import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";


const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";


interface HeaderEmailProps {
  text: string;
  senderName: string;
  companyName: string;
  title: string;
}

export default function HeaderEmail({ text, senderName, companyName, title }: HeaderEmailProps) {
  return (
    <Tailwind>
      <Html className="bg-white font-sans">
        <Head />
        <Preview>Email From {companyName}</Preview>
        <Body className="bg-white">
          <Container className="p-3 mx-auto max-w-lg">
            <div className="flex justify-between items-center bg-gray-100 p-4 border-b border-gray-300">
              <div className="p-2 border border-gray-300 rounded bg-gray-100" style={{ backgroundImage: 'url(/lawn3.jpg)', backgroundPosition: '0% 50%' }}>
                <Img src={`${baseUrl}/lawn-mower.png`} height="50" width="50" alt="logo" />
              </div>
              <div className="text-2xl font-bold">
                <span>Lawn Buddy</span>
              </div>
            </div>
            <Heading className="text-2xl font-bold mt-10 mb-4">{title}</Heading>
            <Text className="text-sm mb-4">
              <p>{text}</p>
              <p>From: {senderName}</p>
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
};

