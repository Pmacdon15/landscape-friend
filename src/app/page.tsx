import { Suspense } from "react";
import ClientListAll from "../components/ui/client-list/client-list-all";
import ContentContainer from "../components/ui/containers/content-container";

export default function Home() {
  return (
    <>
      <ContentContainer>
        <h1 className="text-2xl">Client List</h1>
      </ContentContainer>
      <Suspense fallback={<ContentContainer>Loading...</ContentContainer>}>
        <ClientListAll />
      </Suspense>
    </>

  );
}
