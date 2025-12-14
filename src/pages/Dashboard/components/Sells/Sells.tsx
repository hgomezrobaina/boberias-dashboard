import Card from "@/ui/components/Card/Card";
import Modals from "./components/Modals/Modals";
import Button from "@/ui/components/Button/Button";
import useModal from "@/modal/hooks/useModal";
import { InsertOrderModalProps } from "./domain/modal";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { type Order } from "@/lib/order";
import SellsTable from "./components/SellsTable/SellsTable";

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

    let request = supabase
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
      .order("sell_date", { ascending: false });

    if (year !== -1) {
      if (month !== -1) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

        request = request
          .gte("sell_date", startDate.toISOString())
          .lte("sell_date", endDate.toISOString());
      } else {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        request = request
          .gte("sell_date", startDate.toISOString())
          .lte("sell_date", endDate.toISOString());
      }
    }

    request.then((res) => {
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
        <SellsTable actions loading={loading} orders={orders} />
      </Card>
    </>
  );
}
