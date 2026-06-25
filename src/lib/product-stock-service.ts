import Decimal from "decimal.js";
import { supabase } from "./supabase";

/**
 * Calcula el stock real de un producto a partir de sus entradas y de todas
 * las operaciones de venta/traslado/merma asociadas.
 *
 * stock = (suma de entradas) - (suma de operaciones de salida)
 *
 * Todas las operaciones registradas en `order_product` (ventas, traslados y
 * mermas) descuentan inventario, por lo que se restan sin distinguir el tipo.
 */
export class ProductStockService {
  static async calculate(productId: number): Promise<number> {
    const [entersRes, ordersRes] = await Promise.all([
      supabase
        .from("product_stock_enters")
        .select("count")
        .eq("product_id", productId),
      supabase
        .from("order_product")
        .select("count")
        .eq("product_id", productId),
    ]);

    const totalEnters = (entersRes.data ?? []).reduce(
      (acc, e) => acc.add(e.count ?? 0),
      new Decimal(0),
    );

    const totalOut = (ordersRes.data ?? []).reduce(
      (acc, o) => acc.add(o.count ?? 0),
      new Decimal(0),
    );

    return totalEnters.minus(totalOut).toNumber();
  }
}
