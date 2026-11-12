import {
  Select as LibSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  options: SelectOption[];
  placeholder?: string;
  value?: { value: string | null; onChange: (v: string) => void };
  width?: number;
}

export default function Select({ options, placeholder, value, width }: Props) {
  return (
    <LibSelect
      value={value?.value ? value.value : undefined}
      onValueChange={value?.onChange}
    >
      <SelectTrigger
        className="w-full"
        style={{ maxWidth: width ? `${width}px` : undefined }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((v, index) => (
          <SelectItem value={v.value} key={index}>
            {v.label}
          </SelectItem>
        ))}
      </SelectContent>
    </LibSelect>
  );
}
