import type { Order } from "./order";
import { ORDER_TYPE } from "./order-type";
import { supabase } from "./supabase";

/**
 * Subconjunto ligero de una orden necesario para calcular el acumulado de
 * ventas (sin traer los productos ni el resto de relaciones pesadas).
 */
export interface AccumulateOrder {
  id: number;
  type: ORDER_TYPE;
  sell_date: string;
  order_payment_method: { amount: number }[];
}

interface DateFilter {
  year: number;
  month: number;
}

const ORDER_SELECT = `
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
`;

// El tipo del query builder de supabase-js cambia al encadenar, por eso se
// usa un cast a `any` puntual dentro de la función.
function applyDateFilter<T>(query: T, { year, month }: DateFilter): T {
  if (year === -1) {
    return query;
  }

  const startDate =
    month === -1 ? new Date(year, 0, 1) : new Date(year, month, 1);
  const endDate =
    month === -1
      ? new Date(year, 11, 31, 23, 59, 59, 999)
      : new Date(year, month + 1, 0, 23, 59, 59, 999);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (query as any)
    .gte("sell_date", startDate.toISOString())
    .lte("sell_date", endDate.toISOString());
}

export class OrderListService {
  /**
   * Obtiene una página de órdenes con todos sus detalles, filtrando por
   * mes/año. Devuelve los datos de la página y el total de registros.
   */
  static async getPage({
    from,
    to,
    year,
    month,
  }: {
    from: number;
    to: number;
  } & DateFilter): Promise<{ data: Order[]; count: number }> {
    let query = supabase
      .from("order")
      .select(ORDER_SELECT, { count: "exact" })
      .order("sell_date", { ascending: false });

    query = applyDateFilter(query, { year, month });

    const res = await query.range(from, to);

    return {
      data: (res.data as Order[] | null) ?? [],
      count: res.count ?? 0,
    };
  }

  /**
   * Obtiene la fuente ligera (solo fecha e importes) de todas las ventas del
   * rango filtrado, para calcular la columna de acumulado sin paginación.
   */
  static async getAccumulateSource({
    year,
    month,
  }: DateFilter): Promise<AccumulateOrder[]> {
    let query = supabase
      .from("order")
      .select("id, type, sell_date, order_payment_method ( amount )")
      .eq("type", ORDER_TYPE.SELL);

    query = applyDateFilter(query, { year, month });

    const res = await query;

    return (res.data as AccumulateOrder[] | null) ?? [];
  }
}
