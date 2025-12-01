import type { Order } from "@/lib/order";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import Card from "@/ui/components/Card/Card";
import LinealChart from "@/ui/components/Charts/components/LinealChart/LinealChart";
import {
  WeekAmountData,
  type DayAmountData,
  type MonthAmountData,
} from "../../domain/chart";
import {
  filterOrdersByDate,
  filterOrdersByMonth,
  filterOrdersByWeek,
  getDayNumbers,
  getWeeksFromMonth,
} from "../../domain/helpers";
import { useMemo, useState } from "react";
import Decimal from "decimal.js";
import { MONTH_DATA_SECTION } from "../../domain/month-data-section";
import MonthSections from "../../shared/components/MonthSections/MonthSections";
import { chartMonths } from "@/lib/months";

interface Props {
  orders: Order[];
  month: number;
  year: number;
}

export default function BalanceChart({ month, orders, year }: Props) {
  const [section, setSection] = useState(MONTH_DATA_SECTION.DAY);

  const balanceWeek = useMemo(() => {
    const result = [] as WeekAmountData[];

    const weeks = getWeeksFromMonth(year, month);

    for (const w of weeks) {
      let sum = 0;

      const filtered = filterOrdersByWeek(orders, w);

      for (const o of filtered) {
        const amount = o.order_product.reduce(
          (a, b) => new Decimal(b.price).mul(b.count).plus(a).toNumber(),
          0
        );

        sum = new Decimal(amount).plus(sum).toNumber();
      }

      result.push(new WeekAmountData(w, sum));
    }

    return result;
  }, [orders, year, month]);

  const balanceData = useMemo(() => {
    const result = [] as DayAmountData[];

    const days = getDayNumbers(year, month);

    for (const day of days) {
      let sum = 0;

      const filtered = filterOrdersByDate(orders, year, month, day);

      for (const o of filtered) {
        const amount = o.order_product.reduce(
          (a, b) => new Decimal(b.price).mul(b.count).plus(a).toNumber(),
          0
        );

        sum = new Decimal(amount).plus(sum).toNumber();
      }

      result.push({ day: day, amount: sum });
    }

    return result;
  }, [orders, month, year]);

  const balanceYear = useMemo(() => {
    const result = [] as MonthAmountData[];

    for (const month of chartMonths) {
      let sum = 0;

      const filtered = filterOrdersByMonth(orders, year, month.value);

      for (const o of filtered) {
        const amount = o.order_product.reduce(
          (a, b) => new Decimal(b.price).mul(b.count).plus(a).toNumber(),
          0
        );

        sum = new Decimal(amount).plus(sum).toNumber();
      }

      result.push({ month: month.label, amount: sum });
    }

    return result;
  }, [orders, year]);

  return (
    <Card
      className="mb-5"
      title="Ingresos"
      extra={
        <MonthSections
          onChange={setSection}
          section={section}
          year={year}
          month={month}
        />
      }
    >
      {section === MONTH_DATA_SECTION.YEAR && (
        <LinealChart
          data={[
            {
              label: "Ingresos",
              color: "oklch(0.145 0 0)",
              data: balanceYear.map((o) => {
                return { unit: o.month, value: o.amount };
              }),
            },
          ]}
          height={500}
          y={{ formatter: (v) => PriceTextBuilder.build(v) }}
        />
      )}

      {section === MONTH_DATA_SECTION.DAY && (
        <LinealChart
          data={[
            {
              label: "Ingresos",
              color: "oklch(0.145 0 0)",
              data: balanceData.map((o) => {
                return { unit: o.day.toString(), value: o.amount };
              }),
            },
          ]}
          height={500}
          y={{ formatter: (v) => PriceTextBuilder.build(v) }}
        />
      )}

      {section === MONTH_DATA_SECTION.WEEK && (
        <LinealChart
          data={[
            {
              label: "Ingresos",
              color: "oklch(0.145 0 0)",
              data: balanceWeek.map((o) => {
                return { unit: o.label, value: o.amount };
              }),
            },
          ]}
          height={500}
          y={{ formatter: (v) => PriceTextBuilder.build(v) }}
        />
      )}
    </Card>
  );
}
