import FormContainer from "../containers/form-container";
import FormHeader from "../header/form-header";
import { InputField } from "../inputs/input";
const data = [
    { id: 1, name: "Jenny", email: "jenny@example.com" },
    { id: 2, name: "John", email: "john@example.com" },
    { id: 3, name: "Jane", email: "jane@example.com" },
]

export default function SendIndividualEmail() {
    return (
        <FormContainer >
            <FormHeader text={`Send an Email to a client`} />
            <form className="flex flex-col gap-4 w-full">
                <select>
                    {data.map((item) => (
                        <option key={item.id} value={item.email}>
                            {item.name} ({item.email})
                        </option>
                    ))}
                </select>
                <InputField id={"title"} name={"title"} type={"text"} placeholder={"Title"} required />
                <textarea
                    className="border rounded sm p-2 bg-white"
                    id={"message"}
                    name="message"
                    placeholder="Your message"
                    required
                />
                <div className="flex justify-center w-full">
                    {/* button */}
                </div>
            </form>
        </FormContainer>
    );
}