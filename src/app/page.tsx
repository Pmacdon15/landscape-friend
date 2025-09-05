'use client'
import FormContainer from "@/components/ui/containers/form-container";
import Link from "next/link";
import "@/animations/landing-page.css";
import Image from "next/image";
import FillFormContainer from "@/components/ui/containers/fill-form-container";
// import TestAddStripeWebHook from "@/components/ui/test/test-add-stripe-webhook";

export default function Home() {

  return (
    <>
      <div className="flex justify-center items-center mb-4 overflow-hidden width-100% md:overflow-visible">
        <div className="flex justify-right items-right logo-slide-in">
          <Image
            width={800}
            height={800}
            src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/logo.png"
            alt="Landscape Friend Logo"
            className="w-64 h-auto mx-auto mb-4 z-[-50] "
          />
        </div>

        <div className="flex-columns justify-top items-left h-16 bg-green-500 text-white logo-slide-in-reverse">
          <h1 className="text-3xl font-bold">Landscape Friend</h1>
          <div className="fit bg-green-700">
            <h2 className="text-xl font-semibold">Your Lawn Care Companion</h2>
          </div>
        </div>
      </div>

      <div className="flex-row justify-center items-center">
        <div className="mx-auto justify-center items-center max-w-md overflow-hidden md:max-w-6xl">
          <div className="md:flex">
            <div className="md:shrink-0 logo-slide-in">
              <Image
                width={800}
                height={800}
                className="h-64 w-full object-cover md:h-full md:w-96"
                src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/lawnmowerstock.jpg"
                alt="Lawn Mower Mowing a Lawn"
              />
            </div>
            <div className="w-full md:ml-4 md:mt-0 mt-4 logo-slide-in-reverse">
              <FormContainer popover={true}>
                <FillFormContainer>
                  <h1 className="text-3xl font-bold mb-6">Welcome to Landscape Friend</h1>
                  <p className="mb-4 indent-4">
                    Thank you for choosing Landscape Friend! To learn more about how we work and protect your data, please review our{" "}
                    <Link href="/terms-of-service" className="text-blue-600 underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-blue-600 underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </FillFormContainer>
              </FormContainer>
              {/* <TestAddStripeWebHook /> */}
            </div>
          </div>
        </div>
      </div>


      <div className="flex-row justify-center items-center">
        <div className="mx-auto justify-center items-center max-w-md overflow-hidden md:max-w-6xl">
          <div className="md:flex">
            <div className="w-full md:mr-4 md:mt-0 mt-4 logo-slide-in sm:mb-4 ">
              <FormContainer popover={true}>
                <FillFormContainer>
                  <h1 className="text-3xl font-bold mb-6">Why choose Landscape Friend?</h1>
                  <p className="mb-4 indent-4">
                    Landscape Friend is your all-in-one solution for lawn care management. Whether you&apos;re a homeowner or a professional landscaper, our platform offers tools to help you schedule services, track maintenance, and manage your lawn care tasks efficiently.
                  </p>
                  <h2 className="text-2xl font-semibold mb-4">What we Provide:</h2>
                  <ul className="list-disc list-inside mb-4">
                    <li>A secure end-to-end platform for managing clients for landscaping related work</li>
                    <li>Easy payments and invoicing integrated through Stripe&apos;s platform</li>
                    <li>Send out updates and newsletters to all of your clients with ease</li>
                  </ul>
                  <p className="mb-4">
                    Join Landscape Friend today and take the first step towards your landscaping career!
                  </p>
                </FillFormContainer>
              </FormContainer>
            </div>
            <div className="md:shrink-0 logo-slide-in-reverse  mt-4 md:mt-0 pb-4">
              <Image
                width={800}
                height={800}
                className="h-64 w-full object-cover md:h-full md:w-96"
                src="https://ugojuoyfyrxkjqju.public.blob.vercel-storage.com/lawnmowerstock.jpg"
                alt="Lawn Mower Mowing a Lawn"
              />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
