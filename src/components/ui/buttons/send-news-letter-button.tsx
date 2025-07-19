import { useSendNewsLetter } from "@/mutations/mutations";
import { Button } from "../button";

export default function SendNewsLetterButton() {
    const { mutate } = useSendNewsLetter()
    return (
        <Button formAction={mutate} variant={"outline"}>Send</Button>
    );
}