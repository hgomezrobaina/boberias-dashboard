import { months } from "@/lib/months";
import { years } from "@/lib/years";
import Select from "@/ui/components/Select/Select";

interface Props {
  month: { value: number; onChange: (v: number) => void };
  year: { value: number; onChange: (v: number) => void };
}

export default function Header({ month, year }: Props) {
  return (
    <header className="flex flex-col-reverse md:flex-row md:items-center items-end justify-between gap-x-5 gap-y-5 w-full mt-10 mb-10">
      <div className="w-full">
        <h1 className="font-bold text-3xl sm:text-4xl mb-1">
          Bienvenido de vuelta
        </h1>
        <p className="text-base text-gray-500">
          Gestión de inventario y ventas en tiempo real
        </p>
      </div>

      <div className="flex items-center gap-x-3">
        <Select
          width={120}
          options={months}
          placeholder="Enero"
          value={{
            onChange: (v) => month.onChange(Number(v)),
            value: month.value.toString(),
          }}
        />

        <Select
          width={100}
          options={years}
          placeholder="2025"
          value={{
            onChange: (v) => year.onChange(Number(v)),
            value: year.value.toString(),
          }}
        />
      </div>
    </header>
  );
}
