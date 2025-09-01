interface ReusableNumberInputProps {
  className?: string;
  name: string;
  defaultValue: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function ReusableNumberInput({
  className = "md:w-2/6 w-1/6 border rounded-sm  p-1",
  name,
  defaultValue,
  onChange,
  disabled = false,
}: ReusableNumberInputProps) {
  return (
    <input
      className={className}
      name={name}
      type="number"
      defaultValue={defaultValue}
      onChange={(event) => onChange(Number(event.target.value))}
      disabled={disabled}
    />
  );
}