import ContentContainer from "../containers/content-container";

const clients = [
    {
        id: 1,
        name: "Emily",
        fullName: "Emily Chen",
        emailAddress: "emily.chen@example.com",
        address: "1455 Market St, San Francisco, CA 94103"
    },
    {
        id: 2,
        name: "Ethan",
        fullName: "Ethan Patel",
        emailAddress: "ethan.patel@example.com",
        address: "350 5th Ave, New York, NY 10118"
    },
    {
        id: 3,
        name: "Lily",
        fullName: "Lily Tran",
        emailAddress: "lily.tran@example.com",
        address: "123 Main St, Austin, TX 78701"
    },
    {
        id: 4,
        name: "Noah",
        fullName: "Noah Lee",
        emailAddress: "noah.lee@example.com",
        address: "100 University Ave, Toronto, ON M5J 2H6"
    },
    {
        id: 5,
        name: "Ava",
        fullName: "Ava Kim",
        emailAddress: "ava.kim@example.com",
        address: "520 King St W, Toronto, ON M5V 1K4"
    }
];

export default function ClientListAll() {
    return (
        <ContentContainer>            
            <ul className="flex flex-col gap-4 p-4 rounded-sm">
                {clients.map(client => (
                    <li 
                    className="border p-4 rounded-sm"
                    key={client.id}>
                        <p>Name: {client.fullName}</p>
                        <p>Email: {client.emailAddress}</p>
                        <p>Address: {client.address}</p>
                    </li>
                ))}
            </ul>
        </ContentContainer>
    );

}
