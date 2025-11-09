import Card from "@/ui/components/Card/Card";
import Modals from "./components/Modals/Modals";
import Button from "@/ui/components/Button/Button";
import useModal from "@/modal/hooks/useModal";
import {
  DeleteOrderModalProps,
  EditOrderModalProps,
  InsertOrderModalProps,
} from "./domain/modal";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Table from "@/ui/components/Table/Table";
import { type Order } from "@/lib/order";
import { DateTextBuilder } from "@/lib/date-text-builder";
import { OrderTypeTextBuiler } from "@/lib/order-type";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import IconButton from "@/ui/components/IconButton/IconButton";
import { Edit, Trash } from "lucide-react";
import { PAYMENT_METHOD, PaymentMethodTextBuilder } from "@/lib/payment-method";

interface Props {
  month: number;
  year: number;
}

export default function Sells({ month, year }: Props) {
  const { handleOpenModal } = useModal();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const refetch = useCallback(() => {
    setLoading(true);

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 1);

    supabase
      .from("order")
      .select(
        `
        *, 
        order_product (
            product_id,
            count,
            price,
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
      .gte("sell_date", startDate.toISOString())
      .lt("sell_date", endDate.toISOString())
      .order("sell_date", { ascending: false })
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
        }

        setLoading(false);
      });
  }, [year, month]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Modals refetch={refetch} />

      <Card
        title="Ventas"
        description="Historial detallado de transacciones"
        extra={
          <>
            <Button
              onClick={() => handleOpenModal(new InsertOrderModalProps())}
            >
              Insertar
            </Button>
          </>
        }
      >
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
              name: "",
              cell: ({ row }) => (
                <div className="flex items-center gap-x-2">
                  <IconButton
                    icon={<Edit className="w-6 h-6" />}
                    onClick={() =>
                      handleOpenModal(new EditOrderModalProps(row))
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
      </Card>
    </>
  );
}
