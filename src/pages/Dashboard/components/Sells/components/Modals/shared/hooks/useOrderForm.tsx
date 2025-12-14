import {
  type OrderPayment,
  type OrderProduct,
  type Order,
  type OrderForm,
} from "@/lib/order";
import { ORDER_TYPE } from "@/lib/order-type";
import { PAYMENT_METHOD } from "@/lib/payment-method";
import { type Product } from "@/lib/product";
import { supabase } from "@/lib/supabase";
import Decimal from "decimal.js";
import { useEffect, useMemo, useState } from "react";

interface Props {
  order?: Order;
}

export default function useOrderForm({ order }: Props): OrderForm {
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const [sellDate, setSellDate] = useState(
    order ? new Date(order.sell_date) : new Date()
  );
  const [description, setDescription] = useState(
    order ? order.description : ""
  );
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>(
    order
      ? order.order_product.map((o) => {
          return {
            count: o.count,
            price: o.price,
            product: o.product,
            prev_stock: o.prev_stock,
          };
        })
      : []
  );
  const [payments, setPayments] = useState<OrderPayment[]>(
    order
      ? order.order_payment_method.map((o) => {
          return { amount: o.amount, method: o.method };
        })
      : []
  );
  const [type, setType] = useState(order ? order.type : ORDER_TYPE.SELL);

  useEffect(() => {
    setProductsLoading(true);

    supabase
      .from("product")
      .select("*")
      .eq("active", true)
      .gt("stock", 0)
      .order("id", { ascending: false })
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }

        setProductsLoading(false);
      });
  }, []);

  const availableProducts = useMemo(() => {
    return products.filter(
      (p) => !orderProducts.some((o) => o.product.id === p.id)
    );
  }, [products, orderProducts]);

  function handleAddProduct() {
    const first = availableProducts[0];

    if (first) {
      setOrderProducts((prev) => [
        ...prev,
        {
          product: first,
          count: 1,
          price: first.sell_price,
          prev_stock: first.stock,
        },
      ]);
    }
  }

  function handleChangeProduct(index: number, id: number) {
    const found = products.find((p) => p.id === id);
    const exists = orderProducts.some((o) => o.product.id === id);

    if (found && !exists) {
      setOrderProducts((prev) => {
        return prev.map((p, i) => {
          if (i === index) {
            return {
              count: 1,
              price: found.sell_price,
              product: found,
              prev_stock: found.stock,
            };
          }

          return p;
        });
      });
    }
  }

  function handleDeleteProduct(id: number) {
    setOrderProducts((prev) => prev.filter((o) => o.product.id !== id));
  }

  function handleChangeProductPrice(id: number, v: number) {
    setOrderProducts((prev) => {
      return prev.map((p) => {
        if (p.product.id === id) {
          return { ...p, price: v };
        }

        return p;
      });
    });
  }

  function handleChangeProductCount(id: number, v: number) {
    setOrderProducts((prev) => {
      return prev.map((p) => {
        if (p.product.id === id) {
          return { ...p, count: v };
        }

        return p;
      });
    });
  }

  function handleChangePaymentMethod(index: number, v: PAYMENT_METHOD) {
    setPayments((prev) => {
      return prev.map((p, i) => {
        if (index === i) {
          return { ...p, method: v };
        }

        return p;
      });
    });
  }

  function handleChangePaymentAmount(index: number, v: number) {
    setPayments((prev) => {
      return prev.map((p, i) => {
        if (index === i) {
          return { ...p, amount: v };
        }

        return p;
      });
    });
  }

  function handleDeletePayment(index: number) {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddPayment() {
    setPayments((prev) => [
      ...prev,
      { amount: 1, method: PAYMENT_METHOD.CASH },
    ]);
  }

  const sumProducts = useMemo(
    () =>
      orderProducts.reduce(
        (a, b) => new Decimal(b.price).mul(b.count).plus(a).toNumber(),
        0
      ),
    [orderProducts]
  );
  const sumPayments = useMemo(
    () =>
      payments.reduce((a, b) => new Decimal(b.amount).plus(a).toNumber(), 0),
    [payments]
  );

  return {
    products: {
      value: products,
      available: availableProducts,
      loading: productsLoading,
    },
    description: { value: description, onChange: setDescription },
    sellDate: { value: sellDate, onChange: setSellDate },
    payments: {
      value: payments,
      onChangeAmount: handleChangePaymentAmount,
      onChangeMethod: handleChangePaymentMethod,
      onDelete: handleDeletePayment,
      onAdd: handleAddPayment,
    },
    orderProducts: {
      value: orderProducts,
      onChangePrice: handleChangeProductPrice,
      onChangeCount: handleChangeProductCount,
      onChangeProduct: handleChangeProduct,
      onDeleteProduct: handleDeleteProduct,
      onAdd: handleAddProduct,
    },
    type: { value: type, onChange: setType },
    sumPayments: sumPayments,
    sumProducts,
  };
}
