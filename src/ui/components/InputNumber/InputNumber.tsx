import { Input as LibInput } from "@/components/ui/input";

interface Props {
  value?: { value: number; onChange: (v: number) => void };
  min?: number;
  max?: number;
}

export default function InputNumber({ value, max, min }: Props) {
  return (
    <LibInput
      min={min}
      max={max}
      type="number"
      className="w-full"
      value={value?.value}
      onChange={(e) => value?.onChange(Number(e.target.value))}
    />
  );
}
