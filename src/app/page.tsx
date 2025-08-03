
import ContentContainer from "@/components/ui/containers/content-container";
import FormContainer from "@/components/ui/containers/form-container";
import Link from "next/link";

export default function Home() {
  return (
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
  );
}
