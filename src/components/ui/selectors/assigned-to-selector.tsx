'use client'

import { useSearchParam } from "@/lib/hooks/hooks";
import { OrgMember } from "@/types/clerk-types";
import { use } from "react";

export function AssignedToSelector({ orgMembersPromise }: { orgMembersPromise: Promise<OrgMember[]>; }) {
    const orgMembers = use(orgMembersPromise);
    const { currentValue, setParam } = useSearchParam("assigned", "");

    return (
        <div className="flex gap-1  ">
            {/* <label className="flex items-center">Assigned To </label> */}
            <select
                name={"assigned_to"}
                className="w-fit border rounded-sm text-center py-2"
                value={currentValue}
                onChange={(e) => setParam(e.target.value)}
            >
                <option value="">Assigned To</option>
                {orgMembers.map((orgMember) => (
                    <option key={orgMember.userId} value={orgMember.userName || ""}>
                        {orgMember.userName}
                    </option>
                ))}
            </select>
        </div>
    );
}