import { DateTextBuilder } from "@/lib/date-text-builder";
import { NumberTextBuilder } from "@/lib/number-text-builder";
import { type Order } from "@/lib/order";
import { OrderTypeTextBuiler } from "@/lib/order-type";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import type { ProductStockEnter } from "@/lib/product-stock-enter";
import { supabase } from "@/lib/supabase";
import Modal from "@/modal/components/Modal/Modal";
import ModalHeader from "@/modal/components/ModalHeader/ModalHeader";
import MetricCard from "@/ui/components/MetricCard/MetricCard";
import Table from "@/ui/components/Table/Table";
import clsx from "clsx";
import Decimal from "decimal.js";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Props {
  id: number;
}

interface ProductOperation {
  date: Date;
  description: string;
  type: string;
  count: number | null;
  price: number | null;
  prev_stock: number | null;
  original_cost: number | null;
}

export default function ViewProductSells({ id }: Props) {
  const [orderLoading, setOrderLoading] = useState(true);
  const [entersLoading, setEntersLoading] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [enters, setEnters] = useState<ProductStockEnter[]>([]);

  useEffect(() => {
    setEntersLoading(true);

    supabase
      .from("product_stock_enters")
      .select(`*`)
      .eq("product_id", id)
      .order("date", { ascending: false })
      .then((res) => {
        if (res.data !== null) {
          const data = res.data as ProductStockEnter[];

          setEnters(data);
        }

        setEntersLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setOrderLoading(true);

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
                original_cost,
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
          `,
      )
      .order("sell_date", { ascending: false })
      .then((res) => {
        if (res.data !== null) {
          const data = res.data as Order[];

          setOrders(
            data.filter((o) => {
              return o.order_product.some((p) => p.product.id === id);
            }),
          );
        }

        setOrderLoading(false);
      });
  }, [id]);

  const totalSells = useMemo(() => {
    return orders.reduce((acc, o) => {
      const result = o.order_product.find((p) => p.product.id === id);
      return acc + (result ? result.count : 0);
    }, 0);
  }, [orders, id]);

  const totalEnters = useMemo(() => {
    return enters.reduce((acc, e) => acc + e.count, 0);
  }, [enters]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, o) => {
      const result = o.order_product.find((p) => p.product.id === id);

      return (
        acc +
        (result ? new Decimal(result.price).mul(result.count).toNumber() : 0)
      );
    }, 0);
  }, [orders, id]);

  const data: ProductOperation[] = useMemo(() => {
    return [
      ...orders.map((r) => {
        const result = r.order_product.find((p) => p.product.id === id);

        const count = result ? result.count : null;
        const prevStock = result ? result.prev_stock : null;
        const price = result ? result.price : null;

        return {
          date: new Date(r.sell_date),
          type: OrderTypeTextBuiler.execute(r.type),
          count: count,
          prev_stock: prevStock,
          description: r.description,
          price: price,
          original_cost: result ? result.original_cost : null,
        };
      }),
      ...enters.map((r) => {
        return {
          date: new Date(r.date),
          type: "Entrada",
          count: r.count,
          prev_stock: r.prev_stock,
          description: r.description,
          price: null,
          original_cost: null,
        };
      }),
    ];
  }, [orders, enters, id]);

  return (
    <Modal>
      <div
        className={clsx(
          "flex flex-col",
          "w-full max-w-[900px] max-h-full",
          "bg-white",
          "px-6 py-5",
          "shadow-lg",
          "overflow-auto",
          "animate-duration-500",
          "h-max",
          "rounded-lg",
        )}
      >
        <ModalHeader title="Ventas del producto" />

        <div className="grid grid-cols-3 gap-4 mb-4">
          <MetricCard
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            title="Ventas totales"
            value={NumberTextBuilder.execute(totalSells)}
          />
          <MetricCard
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            title="Entradas totales"
            value={NumberTextBuilder.execute(totalEnters)}
          />
          <MetricCard
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            title="Dinero ganado"
            value={PriceTextBuilder.build(totalRevenue)}
          />
        </div>

        <Table
          loading={entersLoading || orderLoading}
          data={data}
          columns={[
            {
              name: "Fecha de venta",
              cell: ({ row }) => DateTextBuilder.build(row.date),
            },
            { name: "Descripción", cell: ({ row }) => row.description },
            {
              name: "Tipo",
              cell: ({ row }) => row.type,
            },
            {
              name: "Cantidad",
              cell: ({ row }) => {
                return NumberTextBuilder.execute(row.count);
              },
            },
            {
              name: "Importe del producto",
              cell: ({ row }) => {
                return PriceTextBuilder.build(row.price);
              },
            },
            {
              name: "Cantidad previa",
              cell: ({ row }) => {
                return NumberTextBuilder.execute(row.prev_stock);
              },
            },
            {
              name: "Costo original",
              cell: ({ row }) => PriceTextBuilder.build(row.original_cost),
            },
          ]}
        />
      </div>
    </Modal>
  );
}
