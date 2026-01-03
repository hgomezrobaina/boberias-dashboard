import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/product";
import { supabase } from "@/lib/supabase";
import FormModal from "@/modal/components/FormModal/FormModal";
import useModal from "@/modal/hooks/useModal";
import DatePicker from "@/ui/components/DatePicker/DatePicker";
import FormInput from "@/ui/components/FormInput/FormInput";
import InputNumber from "@/ui/components/InputNumber/InputNumber";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  refetch: () => void;
}

export default function InsertStock({ product, refetch }: Props) {
  const { handleClose } = useModal();

  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState(1);
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");

  async function handlSubmit() {
    if (count > 0) {
      setLoading(true);

      const { error: e } = await supabase.rpc("increment_product_stock", {
        product_id_param: product.id,
        product_count: count,
      });

      if (e !== null) {
        toast.error("Hubo un error al insertar la cantidad del producto");

        setLoading(false);
      } else {
        const { error: se } = await supabase
          .from("product_stock_enters")
          .insert([
            {
              count: count,
              date: date,
              description: description,
              prev_stock: product.stock,
              product_id: product.id,
            },
          ])
          .select("*");

        if (se !== null) {
          toast.error("Hubo un error al insertar la cantidad del producto");

          setLoading(false);
        } else {
          setLoading(false);

          toast.success("Cantidad insertada exitosamente");

          refetch();

          handleClose();
        }
      }
    } else {
      toast.error("La cantidad a insertar debe ser mayor a 0");
    }
  }

  return (
    <FormModal
      loading={loading}
      onSubmit={handlSubmit}
      title="Insertar cantidad"
      width={450}
    >
      <FormInput label="Cantidad">
        <InputNumber min={1} value={{ onChange: setCount, value: count }} />
      </FormInput>

      <FormInput label="Fecha">
        <DatePicker value={{ onChange: setDate, value: date }} />
      </FormInput>

      <FormInput label="Descripción">
        <Textarea
          placeholder="Notas..."
          className="h-[110px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormInput>
    </FormModal>
  );
}
