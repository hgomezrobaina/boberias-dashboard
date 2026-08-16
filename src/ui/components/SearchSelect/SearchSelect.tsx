import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  options: SelectOption[];
  placeholder?: string;
  value: { value: string | null; onChange: (v: string) => void };
  width?: number;
  criteria: (v: string, s: string) => number;
}

export default function SearchSelect({
  options,
  placeholder,
  value: ivalue,
  width,
  criteria,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          style={{ maxWidth: width ? `${width}px` : undefined }}
          className="w-full justify-between"
        >
          <span className="truncate text-left">
            {ivalue.value
              ? options.find((framework) => framework.value === ivalue.value)
                  ?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ maxWidth: width ? `${width}px` : undefined }}
        className="w-full p-0"
      >
        <Command
          filter={(value, search) => {
            return criteria(value, search);
          }}
        >
          <CommandInput placeholder="Buscar..." className="h-9" />
          <CommandList>
            <CommandEmpty>No existen opciones</CommandEmpty>
            <CommandGroup>
              {options.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    ivalue.onChange(
                      currentValue === ivalue.value ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      ivalue.value === framework.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
