import { format } from "date-fns";
import { NullTextBuilder } from "./null-text-builder";
import { es } from "date-fns/locale";

export class DateTextBuilder {
  static build(date: Date | null, mode?: "number" | "style"): string {
    if (date === null) {
      return NullTextBuilder.build();
    }

    if (mode === "number") {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    const result = format(date, "MMM dd, yyyy", { locale: es });

    return result.charAt(0).toUpperCase() + result.slice(1);
  }
}
