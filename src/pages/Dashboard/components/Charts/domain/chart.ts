import { DateTextBuilder } from "@/lib/date-text-builder";

export interface DayAmountData {
  day: number;
  amount: number;
}

export interface MonthAmountData {
  month: string;
  amount: number;
}

export interface Week {
  startDate: Date;
  endDate: Date;
}

export class WeekAmountData {
  constructor(private readonly week: Week, readonly amount: number) {}

  get label(): string {
    return `${DateTextBuilder.build(
      this.week.startDate
    )} - ${DateTextBuilder.build(this.week.endDate)}`;
  }
}
