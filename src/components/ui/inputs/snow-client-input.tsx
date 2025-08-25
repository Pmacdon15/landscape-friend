'use client'
import { useAssignSnowClearing, useToggleSnowClient } from "@/lib/mutations/mutations";
import { use } from "react";
import PricePerUpdateInput from "../client-list/price-per-update-input";
import { Client } from "@/types/types-clients";
import { OrgMember } from "@/types/types-clerk";

export default function SnowClientInput({ client, orgMembersPromise }:
  { client: Client, orgMembersPromise?: Promise<OrgMember[]> }) {

  const { mutate: mutateToggleSnowClient } = useToggleSnowClient()
  const { mutate: mutateAssignSnowClearing } = useAssignSnowClearing()
  const orgMembers = use(orgMembersPromise ?? Promise.resolve([]));

  const defaultValue = client.assigned_to ? client.assigned_to.toString() : "not-assigned";

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <input
          type="checkbox"
          id={`snow-removal-${client.id}`}
          name="snow-removal"
          defaultChecked={client.snow_client}
          onClick={() => mutateToggleSnowClient({ clientId: client.id })}
        />
        <label htmlFor={`snow-removal-${client.id}`}>Snow Removal</label>
      </div>
      {client.snow_client &&
        <div className="flex flex-col gap-2 mb-2">
          < div className="flex">
            <p className="align-middle w-40">Assigned to : </p>
            <select
              className="  rounded-sm border md:w-2/6  w-3/6 p-1"
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

      }
    </div >
  );
}