import SendClientEmailButton from "../buttons/send-client-email-button";
import SendNewsLetterButton from "../buttons/send-news-letter-button";
import ContentContainer from "../containers/content-container";
import { InputField } from "../inputs/input";

export default function SendEmailComponent({ clientEmail, clientName }: { clientEmail?: string, clientName?: string }) {
    
    return (
        <ContentContainer>
            {!clientName ? <h1 className="text-2xl">Send a group email to your clients</h1> : <h1 className="text-2xl">Send an Email to {clientName}</h1>}
            <form className="flex flex-col gap-4 w-full">
                <InputField id={"title"} name={"title"} type={"text"} placeholder={"Title"} />
                <textarea className="border rounded sm p-2 bg-white" id={"message"} name="message" placeholder="Your message" />
                <div className="flex justify-center w-full">
                    {clientEmail === undefined ? <SendNewsLetterButton /> : <SendClientEmailButton clientEmail={clientEmail} />}
                </div>
            </form>
        </ContentContainer>
    );
}