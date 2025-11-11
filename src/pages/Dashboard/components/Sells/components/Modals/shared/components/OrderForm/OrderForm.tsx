import type { OrderForm } from "@/lib/order";
import { ORDER_TYPE, orderTypes, OrderTypeTextBuiler } from "@/lib/order-type";
import {
  PAYMENT_METHOD,
  paymentMethods,
  PaymentMethodTextBuilder,
} from "@/lib/payment-method";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import ArrayInput from "@/ui/components/ArrayInput/ArrayInput";
import DatePicker from "@/ui/components/DatePicker/DatePicker";
import FormInput from "@/ui/components/FormInput/FormInput";
import IconButton from "@/ui/components/IconButton/IconButton";
import InputNumber from "@/ui/components/InputNumber/InputNumber";
import Select from "@/ui/components/Select/Select";
import Table from "@/ui/components/Table/Table";
import { Trash } from "lucide-react";

interface Props {
  form: OrderForm;
}

export default function OrderForm({ form }: Props) {
  return (
    <>
      <FormInput label="Fecha de venta">
        <DatePicker value={form.sellDate} />
      </FormInput>

      <FormInput label="Tipo">
        <Select
          options={orderTypes.map((o) => {
            return {
              label: OrderTypeTextBuiler.execute(o.type),
              value: o.type,
            };
          })}
          value={{
            value: form.type.value,
            onChange: (v) => form.type.onChange(v as ORDER_TYPE),
          }}
        />
      </FormInput>

      <ArrayInput
        label="Productos"
        onAdd={
          form.products.available.length > 0
            ? form.orderProducts.onAdd
            : undefined
        }
      >
        <Table
          data={form.orderProducts.value}
          columns={[
            {
              name: "Producto",
              cell: ({ index, row }) => (
                <Select
                  options={[row.product, ...form.products.available].map(
                    (o) => {
                      const price = PriceTextBuilder.build(o.sell_price);

                      return {
                        label: `${o.code} - ${o.name} (${price})`,
                        value: o.id.toString(),
                      };
                    }
                  )}
                  value={{
                    onChange: (v) =>
                      form.orderProducts.onChangeProduct(index, Number(v)),
                    value: row.product.id.toString(),
                  }}
                />
              ),
            },
            {
              name: "Cantidad",
              cell: ({ row: o }) => (
                <InputNumber
                  min={1}
                  max={o.product.stock}
                  value={{
                    onChange: (v) =>
                      form.orderProducts.onChangeCount(o.product.id, v),
                    value: o.count,
                  }}
                />
              ),
            },
            {
              name: "",
              cell: ({ row: o }) => (
                <IconButton
                  icon={<Trash className="w-5 h-5" />}
                  onClick={() =>
                    form.orderProducts.onDeleteProduct(o.product.id)
                  }
                />
              ),
            },
          ]}
        />
      </ArrayInput>

      <ArrayInput label="Pagos" onAdd={form.payments.onAdd}>
        <Table
          data={form.payments.value}
          columns={[
            {
              name: "Método",
              cell: ({ index, row: o }) => (
                <Select
                  options={paymentMethods.map((o) => ({
                    label: PaymentMethodTextBuilder.execute(o.type),
                    value: o.type,
                  }))}
                  value={{
                    value: o.method,
                    onChange: (v) =>
                      form.payments.onChangeMethod(index, v as PAYMENT_METHOD),
                  }}
                />
              ),
            },
            {
              name: "Cantidad",
              cell: ({ row: o, index }) => (
                <InputNumber
                  min={1}
                  value={{
                    onChange: (v) => form.payments.onChangeAmount(index, v),
                    value: o.amount,
                  }}
                />
              ),
            },
            {
              name: "",
              cell: ({ index }) => (
                <IconButton
                  icon={<Trash className="w-5 h-5" />}
                  onClick={() => form.payments.onDelete(index)}
                />
              ),
            },
          ]}
        />
      </ArrayInput>
    </>
  );
}
