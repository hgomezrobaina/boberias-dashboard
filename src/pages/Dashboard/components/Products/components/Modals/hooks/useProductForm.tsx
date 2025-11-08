import type { Product } from "@/lib/product";
import { useState } from "react";

interface Props {
  product?: Product;
}

export default function useProductForm({ product }: Props) {
  const [name, setName] = useState(product ? product.name : "");
  const [costPrice, setCostPrice] = useState(product ? product.cost_price : 1);
  const [sellPrice, setSellPrice] = useState(product ? product.sell_price : 1);
  const [arriveDate, setArriveDate] = useState(
    product ? new Date(product.arrive_date) : new Date()
  );
  const [stock, setStock] = useState(product ? product.stock : 1);
  const [code, setCode] = useState(product ? product.code : "");
  const [expirationDate, setExpirationDate] = useState(
    product
      ? product.expiration_date
        ? new Date(product.expiration_date)
        : null
      : null
  );

  return {
    name,
    setName,
    costPrice,
    setCostPrice,
    sellPrice,
    setSellPrice,
    arriveDate,
    setArriveDate,
    stock,
    setStock,
    code,
    setCode,
    expirationDate,
    setExpirationDate,
  };
}
