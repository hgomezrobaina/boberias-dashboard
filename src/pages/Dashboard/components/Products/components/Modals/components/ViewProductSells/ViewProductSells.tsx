import { DateTextBuilder } from "@/lib/date-text-builder";
import { NullTextBuilder } from "@/lib/null-text-builder";
import { NumberTextBuilder } from "@/lib/number-text-builder";
import { type Order } from "@/lib/order";
import { OrderTypeTextBuiler } from "@/lib/order-type";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import { supabase } from "@/lib/supabase";
import Modal from "@/modal/components/Modal/Modal";
import ModalHeader from "@/modal/components/ModalHeader/ModalHeader";
import Table from "@/ui/components/Table/Table";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface Props {
  id: number;
}

export default function ViewProductSells({ id }: Props) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setLoading(true);

    supabase
      .from("order")
      .select(
        `
            *, 
            order_product (
                product_id,
                count,
                price,
                prev_stock,
                product (
                  id,
                  name,
                  description,
                  stock,
                  cost_price,
                  sell_price,
                  created_at,
                  active,
                  arrive_date,
                  expiration_date,
                  code
                )
            ),
            order_payment_method (
              method,
              amount
            )
          `
      )
      .order("sell_date", { ascending: false })
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
        }

        setLoading(false);
      });
  }, []);

  return (
    <Modal>
      <div
        className={clsx(
          "flex flex-col",
          "w-full max-w-[700px] max-h-full",
          "bg-white",
          "px-6 py-5",
          "shadow-lg",
          "overflow-auto",
          "animate-duration-500",
          "h-max",
          "rounded-lg"
        )}
      >
        <ModalHeader title="Ventas del producto" />

        <Table
          loading={loading}
          data={orders.filter((o) => {
            return o.order_product.some((p) => p.product.id === id);
          })}
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
              name: "Cantidad vendida",
              cell: ({ row }) => {
                const result = row.order_product.find(
                  (p) => p.product.id === id
                );

                return result
                  ? NumberTextBuilder.execute(result.count)
                  : NullTextBuilder.build();
              },
            },
            {
              name: "Importe del producto",
              cell: ({ row }) => {
                const result = row.order_product.find(
                  (p) => p.product.id === id
                );

                return result
                  ? PriceTextBuilder.build(result.price)
                  : NullTextBuilder.build();
              },
            },
            {
              name: "Cantidad previa",
              cell: ({ row }) => {
                const result = row.order_product.find(
                  (p) => p.product.id === id
                );

                return result
                  ? NumberTextBuilder.execute(result.prev_stock)
                  : NullTextBuilder.build();
              },
            },
          ]}
        />
      </div>
    </Modal>
  );
}
