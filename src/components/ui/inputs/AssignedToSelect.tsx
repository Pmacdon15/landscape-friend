'use client'
import { useAssignGrassCutting, useAssignSnowClearing } from "@/lib/mutations/mutations";
import { use } from "react";
import { Client } from "@/types/clients-types";
import { OrgMember } from "@/types/clerk-types";

export default function AssignedTo({ client, orgMembersPromise, snow = false, cuttingWeek, cuttingDay }: { client: Client, orgMembersPromise?: Promise<OrgMember[]>, snow?: boolean, cuttingWeek?: number, cuttingDay?: string }) {

  const { mutate: mutateAssignSnowClearing } = useAssignSnowClearing()
  const { mutate: mutateAssignGrassCutting } = useAssignGrassCutting()


  const orgMembers = use(orgMembersPromise ?? Promise.resolve([]));

  const defaultValue = snow ? (client.snow_assigned_to ? client.snow_assigned_to.toString() : "not-assigned") : (client.grass_assigned_to ? client.grass_assigned_to.toString() : "not-assigned");
  
  return (
    < div className="flex gap-2 justify-center mb-2">
      <p className=" my-auto ">Assigned to {snow ? "snow" : "grass"}: </p>
      <select
        className="rounded-sm border md:w-3/6  w-3/6 p-1"
        defaultValue={defaultValue}
        onChange={(e) => {
          const selectedUserId = e.target.value;
          if (snow) {
            mutateAssignSnowClearing({ clientId: client.id, assignedTo: selectedUserId });
          } else {
            mutateAssignGrassCutting({ clientId: client.id, assignedTo: selectedUserId, cuttingWeek: client.cutting_week, cuttingDay: client.cutting_day });
          }
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