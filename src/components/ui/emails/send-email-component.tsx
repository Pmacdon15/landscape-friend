import { Button } from "../button";
import SendClientEmailButton from "../buttons/send-client-email-button";
import SendNewsLetterButton from "../buttons/send-news-letter-button";
import ContentContainer from "../containers/content-container";
import { InputField } from "../inputs/input";

export default function SendEmailComponent({
  clientEmail,
  clientName,
  popover,
  onEmailSent,
}: {
  clientEmail?: string;
  clientName?: string;
  popover?: boolean;
  onEmailSent?: (success?: boolean) => void;
}) {
  return (
    <ContentContainer popover={popover}>
      {!clientName ? (
        <h1 className="text-2xl">Send a group email to your clients</h1>
      ) : (
        <h1 className="text-2xl">Send an Email to {clientName}</h1>
      )}
      <form className="flex flex-col gap-4 w-full">
        <InputField id={"title"} name={"title"} type={"text"} placeholder={"Title"} required />
        <textarea
          className="border rounded sm p-2 bg-white"
          id={"message"}
          name="message"
          placeholder="Your message"
          required
        />
        <div className="flex justify-center w-full">
          {clientEmail === undefined ?
            <SendNewsLetterButton />
            :
            <SendClientEmailButton clientEmail={clientEmail} onEmailSent={onEmailSent} />
          }
        </div>
      </form>
      <div className="w-full flex justify-center">
        {popover && <Button type="button" onClick={() => onEmailSent?.(false)}>Cancel</Button>}
      </div>
    </ContentContainer>
  );
}