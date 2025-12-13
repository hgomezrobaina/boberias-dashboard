import type { Order, OrderPayment } from "@/lib/order";
import { useMemo } from "react";
import { filterOrdersByMonth } from "../../domain/helpers";
import { PAYMENT_METHOD } from "@/lib/payment-method";
import Card from "@/ui/components/Card/Card";
import Table from "@/ui/components/Table/Table";
import { DateTextBuilder } from "@/lib/date-text-builder";
import { PriceTextBuilder } from "@/lib/price-text-builder";

interface Props {
  orders: Order[];
  year: number;
  month: number;
}

interface TransferData {
  payment: OrderPayment;
  order: Order;
}

export default function TransfersTable({ orders, month, year }: Props) {
  const data = useMemo(() => {
    const result = [] as TransferData[];

    const filtered = filterOrdersByMonth(orders, year, month);

    for (const o of filtered) {
      for (const p of o.order_payment_method) {
        if (p.method === PAYMENT_METHOD.TRANSFER) {
          result.push({ payment: p, order: o });
        }
      }
    }

    return result;
  }, [orders, year, month]);

  return (
    <Card className="mb-5" title="Transferencia">
      <Table
        loading={false}
        columns={[
          {
            name: "Fecha de venta",
            cell: ({ row }) =>
              DateTextBuilder.build(new Date(row.order.sell_date)),
          },
          {
            name: "Cantidad",
            cell: ({ row }) => PriceTextBuilder.build(row.payment.amount),
          },
        ]}
        data={data}
      />
    </Card>
  );
}
