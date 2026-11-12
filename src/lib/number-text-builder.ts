import { NullTextBuilder } from "./null-text-builder";

export class NumberTextBuilder {
  static execute(value: number | null): string {
    return value === null
      ? NullTextBuilder.build()
      : value.toLocaleString("en-US");
  }
}
