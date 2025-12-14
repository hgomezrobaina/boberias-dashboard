import type { ORDER_TYPE } from "./order-type";
import type { PAYMENT_METHOD } from "./payment-method";
import type { Product } from "./product";

export interface Order {
  amount: number;
  id: number;
  created_at: string;
  type: ORDER_TYPE;
  sell_date: string;
  description: string;
  order_product: OrderProduct[];
  order_payment_method: OrderPayment[];
}

export interface OrderProduct {
  price: number;
  count: number;
  product: Product;
  prev_stock: number | null;
}

export interface OrderPayment {
  method: PAYMENT_METHOD;
  amount: number;
}

export interface OrderForm {
  products: { value: Product[]; available: Product[]; loading: boolean };
  description: { value: string; onChange: (v: string) => void };
  sellDate: { value: Date; onChange: (v: Date) => void };
  type: { value: ORDER_TYPE; onChange: (v: ORDER_TYPE) => void };
  payments: {
    value: OrderPayment[];
    onAdd(): void;
    onChangeAmount: (index: number, v: number) => void;
    onChangeMethod: (index: number, v: PAYMENT_METHOD) => void;
    onDelete: (index: number) => void;
  };
  orderProducts: {
    value: OrderProduct[];
    onChangePrice: (index: number, v: number) => void;
    onChangeCount: (index: number, v: number) => void;
    onChangeProduct: (index: number, v: number) => void;
    onDeleteProduct: (index: number) => void;
    onAdd: () => void;
  };
  sumProducts: number;
  sumPayments: number;
}
