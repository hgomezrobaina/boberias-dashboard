import { supabase } from "@/lib/supabase";
import FormModal from "@/modal/components/FormModal/FormModal";
import useModal from "@/modal/hooks/useModal";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  id: number;
  refetch: () => void;
}

export default function DeleteProduct({ id, refetch }: Props) {
  const { handleClose } = useModal();

  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);

    supabase
      .from("product")
      .update({ active: false })
      .eq("id", id)
      .then((res) => {
        if (res.error === null) {
          toast.success("Producto eliminado exitosamente");

          setLoading(false);

          refetch();

          handleClose();
        } else {
          toast.error("Hubo un error al eliminar el producto");

          setLoading(false);
        }
      });
  }

  return (
    <FormModal
      loading={loading}
      onSubmit={handleSubmit}
      title="Eliminar Producto"
    >
      <p className="text-base text-gray-700">
        ¿Seguro que desea eliminar este producto?
      </p>
    </FormModal>
  );
}
