import type { Product } from "./product";
import type { ProductListable } from "./product-listable";
import { ProductStockService } from "./product-stock-service";
import { supabase } from "./supabase";

/**
 * Obtiene todos los productos activos y devuelve una lista de `ProductListable`,
 * calculando el stock de cada producto a partir de sus entradas y operaciones.
 */
export class ProductListService {
  static async getAll(): Promise<ProductListable[]> {
    const res = await supabase
      .from("product")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: false });

    if (!res.data) {
      return [];
    }

    const data = res.data as Product[];

    return Promise.all(
      data.map(async (p) => ({
        ...p,
        stock: await ProductStockService.calculate(p.id),
      })),
    );
  }

  /**
   * Obtiene una página de productos activos (con su stock calculado) aplicando
   * un filtro de búsqueda opcional por código o nombre. Devuelve los datos de
   * la página y el total de registros que cumplen el filtro.
   */
  static async getPage({
    from,
    to,
    search,
  }: {
    from: number;
    to: number;
    search: string;
  }): Promise<{ data: ProductListable[]; count: number }> {
    let query = supabase
      .from("product")
      .select("*", { count: "exact" })
      .eq("active", true);

    if (search) {
      query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const res = await query.order("id", { ascending: false }).range(from, to);

    if (!res.data) {
      return { data: [], count: 0 };
    }

    const data = res.data as Product[];

    const listables = await Promise.all(
      data.map(async (p) => ({
        ...p,
        stock: await ProductStockService.calculate(p.id),
      })),
    );

    return { data: listables, count: res.count ?? 0 };
  }
}
