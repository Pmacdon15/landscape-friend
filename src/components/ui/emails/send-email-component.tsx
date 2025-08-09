import { Button } from "../button";
import SendClientEmailButton from "../buttons/send-client-email-button";
import SendNewsLetterButton from "../buttons/send-news-letter-button";
import FormContainer from "../containers/form-container";
import FormHeader from "../header/form-header";

import SendEmailInputs from "./send-email-inputs";

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
    <FormContainer popover={popover}>
      {!clientName ?
        <FormHeader text={`Send a group email to your clients`} />
        :
        <FormHeader text={`Send an Email to ${clientName}`} />
      }      
      <form className="flex flex-col gap-4 w-full">
      <SendEmailInputs />
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
    </FormContainer>
  );
}