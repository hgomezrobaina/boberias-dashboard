import { DateTextBuilder } from "@/lib/date-text-builder";
import type { Order } from "@/lib/order";
import { ORDER_TYPE, OrderTypeTextBuiler } from "@/lib/order-type";
import { PaymentMethodTextBuilder, PAYMENT_METHOD } from "@/lib/payment-method";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import IconButton from "@/ui/components/IconButton/IconButton";
import Table from "@/ui/components/Table/Table";
import { Edit, Trash } from "lucide-react";
import { DeleteOrderModalProps, EditOrderModalProps } from "../../domain/modal";
import Decimal from "decimal.js";
import useModal from "@/modal/hooks/useModal";

interface Props {
  orders: Order[];
  loading: boolean;
  actions: boolean;
}

const accumulateAmount = (orders: Order[], ref: Order) => {
  return orders
    .filter((o) => o.type === ORDER_TYPE.SELL)
    .filter(
      (o) => new Date(ref.sell_date) >= new Date(o.sell_date) && o.id !== ref.id
    )
    .reduce((a, b) => {
      const sum = b.order_payment_method.reduce(
        (c, d) => new Decimal(c).plus(d.amount).toNumber(),
        0
      );

      return new Decimal(a).plus(sum).toNumber();
    }, 0);
};

export default function SellsTable({ loading, orders, actions }: Props) {
  const { handleOpenModal } = useModal();

  return (
    <>
      <Table
        loading={loading}
        data={orders}
        columns={[
          {
            name: "Fecha de venta",
            cell: ({ row }) => DateTextBuilder.build(new Date(row.sell_date)),
          },
          { name: "Descripción", cell: ({ row }) => row.description },
          {
            name: "Tipo",
            cell: ({ row }) => OrderTypeTextBuiler.execute(row.type),
          },
          {
            name: "Importe",
            cell: ({ row }) => {
              return PriceTextBuilder.build(
                row.order_product.reduce((a, b) => a + b.price * b.count, 0)
              );
            },
          },
          {
            name: "Pago",
            cell: ({ row }) => {
              const filter = (type: PAYMENT_METHOD) => {
                return {
                  type: type,
                  amount: row.order_payment_method
                    .filter((o) => o.method === type)
                    .reduce((a, b) => a + b.amount, 0),
                };
              };

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
            },
          },
          {
            name: "Acumulado",
            cell: ({ row }) =>
              PriceTextBuilder.build(accumulateAmount(orders, row)),
          },
          {
            render: actions,
            name: "",
            cell: ({ row }) => (
              <div className="flex items-center gap-x-2">
                <IconButton
                  icon={<Edit className="w-6 h-6" />}
                  onClick={() => handleOpenModal(new EditOrderModalProps(row))}
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
