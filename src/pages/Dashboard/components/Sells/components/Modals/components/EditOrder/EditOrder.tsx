import type { Order } from "@/lib/order";
import useOrderForm from "../../shared/hooks/useOrderForm";
import { useState } from "react";
import FormModal from "@/modal/components/FormModal/FormModal";
import OrderForm from "../../shared/components/OrderForm/OrderForm";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import useModal from "@/modal/hooks/useModal";

interface Props {
  order: Order;
  refetch: () => void;
}

export default function EditOrder({ order, refetch }: Props) {
  const { handleClose } = useModal();

  const [loading, setLoading] = useState(false);

  const form = useOrderForm({ order: order });

  async function handleSubmit() {
    setLoading(true);

    if (form.sumPayments !== form.sumProducts) {
      toast.error(
        "La cantidad de dinero recolectado en los productos debe ser igual al pagado"
      );

      setLoading(false);

      return;
    }

    const defaultError = () => {
      toast.error("Hubo un error al editar la orden");

      setLoading(false);
    };

    let error = false;

    const { error: e } = await supabase
      .from("order")
      .update({
        description: form.description.value,
        sell_date: form.sellDate.value,
        type: form.type.value,
      })
      .eq("id", order.id);

    if (e === null) {
      // delete products
      for (const p of order.order_product) {
        if (error) {
          break;
        }

        const { error: e } = await supabase
          .from("order_product")
          .delete()
          .eq("order_id", order.id)
          .eq("product_id", p.product.id);

        if (e === null) {
          const { error: se } = await supabase.rpc("increment_product_stock", {
            product_id_param: p.product.id,
            product_count: p.count,
          });

          if (se !== null) {
            error = true;
          }
        } else {
          error = true;
        }
      }

      if (!error) {
        // delete payments
        for (let i = 0; i < order.order_payment_method.length; i++) {
          const { error: e } = await supabase
            .from("order_payment_method")
            .delete()
            .eq("order_id", order.id);

          if (e !== null) {
            error = true;
          }
        }
      }

      // create products
      if (!error) {
        const { error: e } = await supabase.from("order_product").insert(
          form.orderProducts.value.map((p) => {
            return {
              product_id: p.product.id,
              count: p.count,
              price: p.price,
              order_id: order.id,
            };
          })
        );

        if (e) {
          error = true;
        }
      }

      // update products
      if (!error) {
        for (const p of form.orderProducts.value) {
          const { error: e } = await supabase.rpc("decrement_product_stock", {
            product_id_param: p.product.id,
            product_count: p.count,
          });

          if (e) {
            error = true;
            break;
          }
        }
      }

      // create payments
      if (!error) {
        const { error: e } = await supabase.from("order_payment_method").insert(
          form.payments.value.map((p) => {
            return {
              order_id: order.id,
              method: p.method,
              amount: p.amount,
            };
          })
        );

        if (e) {
          error = true;
        }
      }

      if (!error) {
        toast.success("Orden editada exitosamente");

        setLoading(false);

        refetch();

        handleClose();
      } else {
        defaultError();
      }
    }
  }

  return (
    <FormModal
      loading={loading}
      width={800}
      onSubmit={handleSubmit}
      title="Editar orden"
    >
      <OrderForm form={form} />
    </FormModal>
  );
}
