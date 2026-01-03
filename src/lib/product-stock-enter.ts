export interface ProductStockEnter {
  id: number;
  created_at: string;
  date: string;
  count: number;
  description: string;
  prev_stock: number | null;
}
