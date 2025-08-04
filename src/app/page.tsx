
import ContentContainer from "@/components/ui/containers/content-container";
import FormContainer from "@/components/ui/containers/form-container";
import Link from "next/link";
import "@/app/animations/landing-page.css";


export default function Home() {
  return (
    <> 

    <div className="flex justify-center items-center mb-4 overflow-hidden width-100% md: overflow-visible">

      <div className="flex justify-right items-right logo-slide-in">
        <img
            src="/logo.png"
            alt="Lawn Buddy Logo"
            className="w-64 h-auto mx-auto mb-4 "
          />
        
      </div>

      <div className="flex-columns justify-top items-left h-16 bg-green-500 text-white logo-slide-in-reverse">
        <h1 className="text-3xl font-bold">Lawn Buddy</h1>
        <div className="fit bg-green-700">
          <h2 className="text-xl font-semibold">Your Lawn Care Companion</h2>
        </div>
        
      </div>

    </div>

    <div className="flex-row justify-center items-center logo-slide-in">
        <div className="mx-auto justify-center items-center max-w-md overflow-hidden md:max-w-6xl">
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-64 w-full object-cover md:h-full md:w-96"
              src="/landing-page/1.png"
              alt="Lawn Mower Mowing a Lawn"
            />
          </div>
          <div className="w-full md:ml-4 md:mt-0 mt-4">
            <FormContainer>
              <ContentContainer>
              
              <h1 className="text-3xl font-bold mb-6">Welcome to Lawn Buddy</h1>
              <p className="mb-4 indent-4">
                Thank you for choosing LawnBuddy! To learn more about how we work and protect your data, please review our{" "}
                <Link href="/terms-of-service" className="text-blue-600 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-blue-600 underline">
                  Privacy Policy
                </Link>.
              </p>

            </ContentContainer>
          </FormContainer>
          </div>
        </div>
      </div>
    </div>
    
    
    </>
  );
}
