'use client'

import { useToggleSnowClient } from "@/mutations/mutations";

export default function SnowClientInput({ clientId, snowClient }: { clientId: number, snowClient: boolean }) {
  const { mutate } = useToggleSnowClient()
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