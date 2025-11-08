import type { Product } from "@/lib/product";
import FormModal from "@/modal/components/FormModal/FormModal";
import ProductForm from "../../shared/components/ProductForm/ProductForm";
import useModal from "@/modal/hooks/useModal";
import { useState } from "react";
import useProductForm from "../../hooks/useProductForm";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface Props {
  product: Product;
  refetch: () => void;
}

export default function EditProduct({ product, refetch }: Props) {
  const { handleClose } = useModal();

  const [loading, setLoading] = useState(false);

  const {
    arriveDate,
    code,
    costPrice,
    name,
    sellPrice,
    setArriveDate,
    setCode,
    setCostPrice,
    setName,
    setSellPrice,
    setStock,
    stock,
    expirationDate,
    setExpirationDate,
  } = useProductForm({ product: product });

  const handleSubmit = () => {
    setLoading(true);

    const defaultError = () => {
      toast.error("Hubo un error al editar el producto");

      setLoading(false);
    };

    supabase
      .from("product")
      .select("*")
      .eq("code", product.code)
      .then((res) => {
        if (res.error === null) {
          const exists = res.data.some((p) => p.id === product.id);

          if (exists) {
            supabase
              .from("product")
              .update([
                {
                  cost_price: costPrice,
                  sell_price: sellPrice,
                  name: name.trim(),
                  stock: stock,
                  description: "",
                  code: code.trim(),
                  active: true,
                  expiration_date: expirationDate,
                },
              ])
              .eq("id", product.id)
              .then((res) => {
                if (res.error) {
                  defaultError();
                } else {
                  toast.success("Producto editado exitosamente");

                  setLoading(false);

                  refetch();

                  handleClose();
                }
              });
          } else {
            toast.error("Ya existe este código en el inventario");

            setLoading(false);
          }
        } else {
          defaultError();
        }
      });
  };

  return (
    <FormModal
      onSubmit={handleSubmit}
      title="Insertar producto"
      loading={loading}
    >
      <ProductForm
        arriveDate={{ value: arriveDate, onChange: setArriveDate }}
        code={{ value: code, onChange: setCode }}
        costPrice={{ value: costPrice, onChange: setCostPrice }}
        expirationDate={{ value: expirationDate, onChange: setExpirationDate }}
        name={{ value: name, onChange: setName }}
        sellPrice={{ value: sellPrice, onChange: setSellPrice }}
        stock={{ value: stock, onChange: setStock }}
      />
    </FormModal>
  );
}
