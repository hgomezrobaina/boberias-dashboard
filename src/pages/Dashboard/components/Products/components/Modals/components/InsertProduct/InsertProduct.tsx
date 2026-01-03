import { supabase } from "@/lib/supabase";
import FormModal from "@/modal/components/FormModal/FormModal";
import useModal from "@/modal/hooks/useModal";
import { useState } from "react";
import toast from "react-hot-toast";
import useProductForm from "../../hooks/useProductForm";
import ProductForm from "../../shared/components/ProductForm/ProductForm";

interface Props {
  refetch: () => void;
}

export default function InsertProduct({ refetch }: Props) {
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
    expirationDate,
    setExpirationDate,
  } = useProductForm({});

  const handleSubmit = () => {
    setLoading(true);

    const defaultError = () => {
      toast.error("Hubo un error al insertar el producto");

      setLoading(false);
    };

    supabase
      .from("product")
      .select("*")
      .eq("code", code.trim())
      .then((res) => {
        if (res.error === null) {
          const exists = res.data.length > 0;

          if (!exists) {
            supabase
              .from("product")
              .insert([
                {
                  cost_price: costPrice,
                  sell_price: sellPrice,
                  name: name.trim(),
                  stock: 0,
                  description: "",
                  code: code.trim(),
                  active: true,
                  expiration_date: expirationDate,
                },
              ])
              .then((res) => {
                if (res.error) {
                  defaultError();
                } else {
                  toast.success("Producto insertado exitosamente");

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
      />
    </FormModal>
  );
}
