import type { Order } from "@/lib/order";
import type { Week } from "./chart";
import { ORDER_TYPE } from "@/lib/order-type";

export const getDayNumbers = (year: number, month: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

export const filterOrdersByWeek = (orders: Order[], week: Week) => {
  const result = orders.filter((o) => o.type === ORDER_TYPE.SELL);

  return result.filter(
    (o) =>
      new Date(o.sell_date) <= week.endDate &&
      new Date(o.sell_date) >= week.startDate
  );
};

export const filterOrdersByYear = (orders: Order[], year: number) => {
  return orders
    .filter((o) => o.type === ORDER_TYPE.SELL)
    .filter((o) => {
      return (
        new Date(o.sell_date).getFullYear() ===
        (year === -1 ? new Date().getFullYear() : year)
      );
    });
};

export const filterOrdersByMonth = (
  orders: Order[],
  year: number,
  month: number
) => {
  return orders
    .filter((o) => o.type === ORDER_TYPE.SELL)
    .filter((o) => {
      return (
        new Date(o.sell_date).getMonth() === month &&
        new Date(o.sell_date).getFullYear() ===
          (year === -1 ? new Date().getFullYear() : year)
      );
    });
};

export const filterOrdersByDate = (
  orders: Order[],
  year: number,
  month: number,
  day: number
) => {
  return orders
    .filter((o) => o.type === ORDER_TYPE.SELL)
    .filter((o) => {
      return (
        new Date(o.sell_date).getMonth() === month &&
        new Date(o.sell_date).getFullYear() === year &&
        new Date(o.sell_date).getDate() === day
      );
    });
};

export function getWeeksFromMonth(
  year: number,
  month: number,
  weekStartDay: number = 1
): Week[] {
  // Create date for the first day of the month
  const firstDayOfMonth = new Date(year, month, 1);

  // Create date for the last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Find the start of the first week
  const weekStart = new Date(firstDayOfMonth);
  const currentDay = weekStart.getDay();
  const difference = (currentDay - weekStartDay + 7) % 7;
  weekStart.setDate(weekStart.getDate() - difference);

  const weeks: Week[] = [];

  // Iterate while the week start is before or equal to the last day of the month
  while (weekStart <= lastDayOfMonth) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    weeks.push({
      startDate: new Date(weekStart),
      endDate: new Date(weekEnd),
    });

    // Move to the next week start
    weekStart.setDate(weekStart.getDate() + 7);
  }

  return weeks;
}
