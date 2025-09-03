'use client'
import { useAssignGrassCutting, useAssignSnowClearing } from "@/lib/mutations/mutations";
import { use } from "react";
import PricePerUpdateInput from "../client-list/price-per-update-input";
import { Client } from "@/types/clients-types";
import { OrgMember } from "@/types/clerk-types";

export default function AssignedTo({ client, orgMembersPromise, snow = false }: { client: Client, orgMembersPromise?: Promise<OrgMember[]>, snow?: boolean }) {

  const { mutate: mutateAssignSnowClearing } = useAssignSnowClearing()
  const { mutate: mutateAssignGrassCutting } = useAssignGrassCutting()

  let mutate
  { snow ? mutate = mutateAssignSnowClearing : mutate = mutateAssignGrassCutting }

  const orgMembers = use(orgMembersPromise ?? Promise.resolve([]));

  const defaultValue = client.assigned_to ? client.assigned_to.toString() : "not-assigned";

  return (
    < div className="flex gap-2 justify-center mb-2">
      <p className="align-middle ">Assigned to {snow ? "snow" : "grass"}: </p>
      <select
        className="rounded-sm border md:w-3/6  w-3/6 p-1"
        defaultValue={defaultValue}
        onChange={(e) => {
          const selectedUserId = e.target.value;
          mutate({ clientId: client.id, assignedTo: selectedUserId });
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
  );
}