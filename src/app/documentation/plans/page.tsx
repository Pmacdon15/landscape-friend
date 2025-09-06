import FillFormContainer from "@/components/ui/containers/fill-form-container";
import FormContainer from "@/components/ui/containers/form-container";
import FormHeader from "@/components/ui/header/form-header";
import BackToDocsLink from "@/components/ui/links/back-to-docs-link";
import { PricingTable } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";


export default async function Page() {
    const { orgId } = await auth()
    return (
        <FormContainer>
            <FillFormContainer>
                <FormHeader text={'Plans'} />
                <div className=" flex flex-col items-center border rounded-sm gap-4 p-4">
                    <FormHeader text={'Personal Plans'} />
                    <PricingTable forOrganizations={false} />
                </div>
                <div className=" flex flex-col items-center border rounded-sm gap-4 p-4">
                    <FormHeader text={'Organization Plans'} />
                    {orgId ?
                        <>
                            <PricingTable forOrganizations={true} />
                        </>
                        : <p>Sign in and create and organizations to see plans</p>
                    }
                </div>
                <BackToDocsLink />
            </FillFormContainer>
        </FormContainer >
    );
}