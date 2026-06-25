import type { Order } from "@/lib/order";
import { supabase } from "@/lib/supabase";
import FormModal from "@/modal/components/FormModal/FormModal";
import useModal from "@/modal/hooks/useModal";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  refetch: () => void;
  order: Order;
}

export default function DeleteOrder({ order, refetch }: Props) {
  const { handleClose } = useModal();

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    let error = false;

    // delete
    const { error: e } = await supabase
      .from("order")
      .delete()
      .eq("id", order.id);

    if (e) {
      error = true;
    }

    if (!error) {
      toast.success("Orden eliminada exitosamente");

      refetch();

      setLoading(false);

      handleClose();
    } else {
      toast.error("Hubo un error al eliminar la orden");
    }
  }

  return (
    <FormModal loading={loading} onSubmit={handleSubmit} title="Eliminar orden">
      <p className="text-base text-gray-700">
        ¿Seguro que desea eliminar esta orden?
      </p>
    </FormModal>
  );
}
