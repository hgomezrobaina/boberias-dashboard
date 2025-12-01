import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MONTH_DATA_SECTION } from "../../../domain/month-data-section";

interface Props {
  section: MONTH_DATA_SECTION;
  onChange: (v: MONTH_DATA_SECTION) => void;
  month: number;
  year: number;
}

export default function MonthSections({ onChange, section, year }: Props) {
  return (
    <Tabs value={section}>
      <TabsList className="">
        {year !== -1 && (
          <TabsTrigger
            onClick={() => onChange(MONTH_DATA_SECTION.DAY)}
            value={MONTH_DATA_SECTION.DAY}
          >
            Días
          </TabsTrigger>
        )}

        {year !== -1 && (
          <TabsTrigger
            onClick={() => onChange(MONTH_DATA_SECTION.WEEK)}
            value={MONTH_DATA_SECTION.WEEK}
          >
            Semanas
          </TabsTrigger>
        )}

        <TabsTrigger
          onClick={() => onChange(MONTH_DATA_SECTION.YEAR)}
          value={MONTH_DATA_SECTION.YEAR}
        >
          Año
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
