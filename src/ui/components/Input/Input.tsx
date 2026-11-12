import { Input as LibInput } from "@/components/ui/input";

interface Props {
  value?: { value: string; onChange: (v: string) => void };
  type?: "password" | "text";
  placeholder?: string;
}

export default function Input({ value, placeholder, type }: Props) {
  return (
    <LibInput
      placeholder={placeholder}
      type={type}
      className="w-full"
      value={value?.value}
      onChange={(e) => value?.onChange(e.target.value)}
    />
  );
}
