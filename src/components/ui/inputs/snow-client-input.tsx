'use client'
import { useAssignSnowClearing, useToggleSnowClient } from "@/mutations/mutations";
import { OrgMember } from "@/types/types";
import { use } from "react";


export default function SnowClientInput({ clientId, snowClient, orgMembersPromise }:
  { clientId: number, snowClient: boolean, orgMembersPromise?: Promise<OrgMember[]> }) {

  const { mutate: mutateToggleSnowClient } = useToggleSnowClient()
  const { mutate: mutateAssignSnowClearing } = useAssignSnowClearing()
  const orgMembers = use(orgMembersPromise ?? Promise.resolve([]));

  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <input
          type="checkbox"
          id={`snow-removal-${clientId}`}
          name="snow-removal"
          defaultChecked={snowClient}
          onClick={() => mutateToggleSnowClient({ clientId })}
        />
        <label htmlFor={`snow-removal-${snowClient}`}>Snow Removal</label>
      </div>
      {snowClient &&
        <div className="flex gap-2 mb-2">
          <p className="align-middle w-28">Assigned to : </p>
          <select 
            className="  rounded-sm border md:w-2/6  w-3/6 p-1"
            defaultValue={"not-assigned"}
            onChange={(e) => {
              const selectedUserId = e.target.value;
              mutateAssignSnowClearing({ clientId, assignedTo: selectedUserId });
            }}
          >
            <option value="not-assigned">Not Assigned</option>
            {orgMembers && orgMembers.map(member => (
              <option key={member.userId} value={member.userId}>
                {member.userName}
              </option>
            ))}
          </select>
        </div>
      }
    </div>
  );
} 