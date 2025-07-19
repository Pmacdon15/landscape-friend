import { Button } from "@/components/ui/button";
import ContentContainer from "@/components/ui/containers/content-container";
import { InputField } from "@/components/ui/inputs/input";

export default function page() {
    return (
        <ContentContainer>
            <h1 className="text-2xl">Send a group email to your customers</h1>
            <form className="flex flex-col gap-4 w-full">
                <InputField id={"Title"} name={"title"} type={"text"} placeholder={"Title"} />
                <textarea className="border rounded sm p-2 bg-white" name="message" placeholder="Your message" />
                <div className="flex justify-center w-full">
                    <Button variant={"outline"}>Send</Button>
                </div>
            </form>
        </ContentContainer>
    );
}