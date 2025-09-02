'use client'
import { useAssignSnowClearing } from "@/lib/mutations/mutations";
import { use } from "react";
import PricePerUpdateInput from "../client-list/price-per-update-input";
import { Client } from "@/types/types-clients";
import { OrgMember } from "@/types/types-clerk";

export default function SnowClientInput({ client, orgMembersPromise }: { client: Client, orgMembersPromise?: Promise<OrgMember[]> }) {

  const { mutate: mutateAssignSnowClearing } = useAssignSnowClearing()
  const orgMembers = use(orgMembersPromise ?? Promise.resolve([]));

  const defaultValue = client.assigned_to ? client.assigned_to.toString() : "not-assigned";

  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-center">
      <div className="flex lg:flex-row flex-col gap-2 mb-2 items-center ">
        < div className="flex gap-2">
          <p className="align-middle ">Assigned to : </p>
          <select
            className="rounded-sm border md:w-3/6  w-3/6 p-1"
            defaultValue={defaultValue}
            onChange={(e) => {
              const selectedUserId = e.target.value;
              mutateAssignSnowClearing({ clientId: client.id, assignedTo: selectedUserId });
            }}
          >
            <option value="not-assigned">Not Assigned</option>
            {orgMembers && orgMembers.map(member => (
              <option key={member.userId} value={member.userId.toString()}>
                {member.userName}
              </option>
            ))}
          </select>
        </div>
        <PricePerUpdateInput client={client} snow={true} />
      </div>
    </div >
  );
}