export default function SnowClientInput({ clientId, snowClient }: { clientId: number, snowClient: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={`snow-removal-${clientId}`}
        name="snow-removal"
        defaultChecked={snowClient}
      />
      <label htmlFor={`snow-removal-${snowClient}`}>Snow Removal</label>
    </div>
  );
} 