'use client'
import { useToggleSnowClient } from "@/mutations/mutations";
import { OrgMember } from "@/types/types";
import { use } from "react";


export default function SnowClientInput({ clientId, snowClient, orgMembersPromise }:
  { clientId: number, snowClient: boolean, orgMembersPromise?: Promise<OrgMember[] | undefined> }) {
  const { mutate } = useToggleSnowClient()

  const orgMembers = use(orgMembersPromise ?? Promise.resolve([]));
  console.log("OrgMembers: ", orgMembers)
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={`snow-removal-${clientId}`}
        name="snow-removal"
        defaultChecked={snowClient}
        onClick={() => mutate({ clientId })}
      />
      <label htmlFor={`snow-removal-${snowClient}`}>Snow Removal</label>
    </div>
  );
} 