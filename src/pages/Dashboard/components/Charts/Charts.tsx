import type { Order } from "@/lib/order";
import type { Product } from "@/lib/product";
import { supabase } from "@/lib/supabase";
import Card from "@/ui/components/Card/Card";
import BarChart from "@/ui/components/Charts/components/BarChart/BarChart";
import Decimal from "decimal.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import CashChart from "./components/CashChart/CashChart";
import BalanceChart from "./components/BalanceChart/BalanceChart";
import { ORDER_TYPE } from "@/lib/order-type";
import { filterOrdersByYear } from "./domain/helpers";
import MetricCard from "@/ui/components/MetricCard/MetricCard";
import { DollarSign } from "lucide-react";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import TransfersTable from "./components/TransfersTable/TransfersTable";

interface Props {
  month: number;
  year: number;
}

interface TopProduct {
  product: Product;
  count: number;
}

export default function Charts({ month, year }: Props) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const topProducts = useMemo(() => {
    const products = [] as TopProduct[];

    for (const order of orders) {
      for (const p of order.order_product) {
        const found = products.find((o) => o.product.id === p.product.id);

        if (!found) {
          const count = orders
            .filter((o) => o.type === ORDER_TYPE.SELL)
            .reduce((a, b) => {
              const inorder = b.order_product.reduce((c, d) => {
                if (d.product.id === p.product.id) {
                  return c + d.count;
                }

                return c;
              }, 0);

              return new Decimal(a).plus(inorder).toNumber();
            }, 0);

          products.push({ product: p.product, count: count });
        }
      }
    }

    return products.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [orders]);

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

  const totalSells = useMemo(() => {
    let sum = 0;

    const filtered = filterOrdersByYear(orders, year);

    for (const o of filtered) {
      const amount = o.order_payment_method.reduce(
        (a, b) => new Decimal(b.amount).plus(a).toNumber(),
        0
      );

      sum = new Decimal(amount).plus(sum).toNumber();
    }

    return sum;
  }, [orders, year]);

  return (
    <>
      <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-4 mb-5">
        <MetricCard
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          title="Ventas en el año"
          value={PriceTextBuilder.build(totalSells)}
        />
      </div>

      <CashChart month={month} orders={orders} year={year} />

      <BalanceChart month={month} orders={orders} year={year} />

      {topProducts.length > 0 && (
        <Card title="Productos más vendidos" className="mb-5">
          <BarChart
            height={500}
            data={topProducts}
            name={(v) => v.product.name}
            bars={[
              {
                fill: "oklch(0.145 0 0)",
                name: "Cantidad de ventas",
                value: (v) => v.count,
              },
            ]}
            loading={loading}
          />
        </Card>
      )}

      <TransfersTable month={month} orders={orders} year={year} />
    </>
  );
}
