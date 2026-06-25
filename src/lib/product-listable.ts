import type { Product } from "./product";

export interface ProductListable extends Product {
  stock: number;
}
