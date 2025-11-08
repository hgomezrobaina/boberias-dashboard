import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface Props {
  value?: { value: Date | null; onChange: (v: Date) => void };
}

export default function DatePicker({ value }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value?.value}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
        >
          <CalendarIcon />
          {value?.value ? (
            format(value.value, "PPP")
          ) : (
            <span>Selecciona una fecha</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          required
          selected={
            value ? (value.value === null ? undefined : value.value) : undefined
          }
          onSelect={value?.onChange}
        />
      </PopoverContent>
    </Popover>
  );
}
