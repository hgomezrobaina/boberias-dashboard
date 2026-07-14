import { DateTextBuilder } from "@/lib/date-text-builder";
import type { Order } from "@/lib/order";
import { ORDER_TYPE, OrderTypeTextBuiler } from "@/lib/order-type";
import { PaymentMethodTextBuilder, PAYMENT_METHOD } from "@/lib/payment-method";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import type { AccumulateOrder } from "@/lib/order-list-service";
import IconButton from "@/ui/components/IconButton/IconButton";
import Table, {
  type ColumnDefinition,
  type PaginationProps,
} from "@/ui/components/Table/Table";
import { Eye, Trash } from "lucide-react";
import { DeleteOrderModalProps, ViewOrderModalProps } from "../../domain/modal";
import Decimal from "decimal.js";
import useModal from "@/modal/hooks/useModal";

interface Props {
  orders: Order[];
  loading: boolean;
  actions: boolean;
  /**
   * Fuente para calcular el acumulado. Cuando se pagina del lado del servidor,
   * `orders` solo contiene la página actual, por lo que el acumulado se calcula
   * a partir de este conjunto completo (ligero) de ventas.
   */
  accumulateSource?: AccumulateOrder[];
  pagination?: PaginationProps;
  exportExcel?: (
    columns: ColumnDefinition<Order>[],
    filename?: string,
  ) => void | Promise<void>;
}

const importeAmount = (order: Order) =>
  order.order_product.reduce((a, b) => a + b.price * b.count, 0);

const pagoText = (order: Order) => {
  const filter = (type: PAYMENT_METHOD) => ({
    type,
    amount: order.order_payment_method
      .filter((o) => o.method === type)
      .reduce((a, b) => a + b.amount, 0),
  });

  return [
    filter(PAYMENT_METHOD.CASH),
    filter(PAYMENT_METHOD.TRANSFER),
    filter(PAYMENT_METHOD.ONLINE),
  ]
    .filter((o) => o.amount > 0)
    .map((o) => {
      const type = PaymentMethodTextBuilder.execute(o.type);
      const amount = PriceTextBuilder.build(o.amount);

      return `${type} (${amount})`;
    })
    .join(", ");
};

const accumulateAmount = (orders: AccumulateOrder[], ref: Order) => {
  return orders
    .filter((o) => o.type === ORDER_TYPE.SELL)
    .filter(
      (o) =>
        new Date(ref.sell_date) >= new Date(o.sell_date) && o.id !== ref.id,
    )
    .reduce((a, b) => {
      const sum = b.order_payment_method.reduce(
        (c, d) => new Decimal(c).plus(d.amount).toNumber(),
        0,
      );

      return new Decimal(a).plus(sum).toNumber();
    }, 0);
};

export default function SellsTable({
  loading,
  orders,
  actions,
  accumulateSource,
  pagination,
  exportExcel,
}: Props) {
  const { handleOpenModal } = useModal();

  const accumulateData: AccumulateOrder[] = accumulateSource ?? orders;

  return (
    <>
      <Table
        loading={loading}
        data={orders}
        pagination={pagination}
        export={
          exportExcel && { onSubmit: exportExcel, filename: "ventas" }
        }
        columns={[
          {
            name: "Fecha de venta",
            cell: ({ row }) => DateTextBuilder.build(new Date(row.sell_date)),
            excel: (row) => DateTextBuilder.build(new Date(row.sell_date)),
          },
          {
            name: "Descripción",
            cell: ({ row }) => row.description,
            excel: (row) => row.description,
          },
          {
            name: "Tipo",
            cell: ({ row }) => OrderTypeTextBuiler.execute(row.type),
            excel: (row) => OrderTypeTextBuiler.execute(row.type),
          },
          {
            name: "Importe",
            cell: ({ row }) => PriceTextBuilder.build(importeAmount(row)),
            excel: (row) => PriceTextBuilder.build(importeAmount(row)),
          },
          {
            name: "Pago",
            cell: ({ row }) => pagoText(row),
            excel: (row) => pagoText(row),
          },
          {
            name: "Acumulado",
            cell: ({ row }) =>
              PriceTextBuilder.build(accumulateAmount(accumulateData, row)),
            excel: (row) =>
              PriceTextBuilder.build(accumulateAmount(accumulateData, row)),
          },
          {
            render: actions,
            name: "",
            cell: ({ row }) => (
              <div className="flex items-center gap-x-2">
                <IconButton
                  icon={<Eye className="w-6 h-6" />}
                  onClick={() =>
                    handleOpenModal(new ViewOrderModalProps(row))
                  }
                />
                <IconButton
                  icon={<Trash className="w-6 h-6" />}
                  onClick={() =>
                    handleOpenModal(new DeleteOrderModalProps(row))
                  }
                />
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
