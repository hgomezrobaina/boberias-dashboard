import FormModal from "@/modal/components/FormModal/FormModal";
import { useState } from "react";
import OrderForm from "../../shared/components/OrderForm/OrderForm";
import useOrderForm from "../../shared/hooks/useOrderForm";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import useModal from "@/modal/hooks/useModal";

interface Props {
  refetch: () => void;
}

export default function InsertOrder({ refetch }: Props) {
  const [loading, setLoading] = useState(false);

  const { handleClose } = useModal();

  const form = useOrderForm({});

  async function handleSubmit() {
    setLoading(true);

    const sumProducts = form.orderProducts.value.reduce(
      (a, b) => a + b.price * b.count,
      0
    );
    const sumPayments = form.payments.value.reduce((a, b) => a + b.amount, 0);

    if (sumPayments !== sumProducts) {
      toast.error(
        "La cantidad de dinero recolectado en los productos debe ser igual al pagado"
      );

      setLoading(false);

      return;
    }

    const defaultError = () => {
      toast.error("Hubo un error al crear la orden");

      setLoading(false);
    };

    let error = false;

    const { data } = await supabase
      .from("order")
      .insert([
        {
          description: form.description.value,
          sell_date: form.sellDate.value,
          type: form.type.value,
        },
      ])
      .select("*");

    if (data) {
      const element = data[0];

      // create products
      if (!error) {
        const { error: e } = await supabase.from("order_product").insert(
          form.orderProducts.value.map((p) => {
            return {
              product_id: p.product.id,
              count: p.count,
              price: p.price,
              order_id: element.id,
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
              order_id: element.id,
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
        toast.success("Orden insertada exitosamente");

        setLoading(false);

        refetch();

        handleClose();
      } else {
        defaultError();
      }
    } else {
      defaultError();
    }
  }

  return (
    <FormModal onSubmit={handleSubmit} loading={loading} title="Insertar venta">
      <OrderForm form={form} />
    </FormModal>
  );
}
