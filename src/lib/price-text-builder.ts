import { NullTextBuilder } from "./null-text-builder";

export class PriceTextBuilder {
  static build(
    value: number | null,
    type: "positive" | "negative" = "positive"
  ): string {
    if (value === null) {
      return NullTextBuilder.build();
    }

    let result: string;

    if (value === 0) {
      return `$0`;
    }

    const rvalue = value.toLocaleString("en-US");

    if (Number.isInteger(value)) {
      result = `$${rvalue}`;
    } else {
      result = `$${rvalue}`;
    }

    if (value < 0) {
      return result;
    }

    return type === "positive" ? result : `-${result}`;
  }
}
