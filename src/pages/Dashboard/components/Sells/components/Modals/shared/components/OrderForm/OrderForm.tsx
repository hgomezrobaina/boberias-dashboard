import { Alert, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import type { OrderForm, OrderProduct } from "@/lib/order";
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
import SearchSelect from "@/ui/components/SearchSelect/SearchSelect";
import Select from "@/ui/components/Select/Select";
import Table from "@/ui/components/Table/Table";
import { Trash, Wallet } from "lucide-react";

interface Props {
  form: OrderForm;
}

export default function OrderForm({ form }: Props) {
  function handleSearch(row: OrderProduct, id: string, search: string): number {
    const found = [row.product, ...form.products.available].find(
      (o) => o.id === Number(id)
    );

    if (found) {
      const code = found.code.toLowerCase().includes(search.toLowerCase());
      const name = found.name.toLowerCase().includes(search.toLowerCase());

      if (code) {
        return 1;
      }

      if (name) {
        return 0.5;
      }
    }

    return 0;
  }

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

      <FormInput label="Descripción">
        <Textarea
          placeholder="Notas..."
          className="h-[110px]"
          value={form.description.value}
          onChange={(e) => form.description.onChange(e.target.value)}
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
        {form.sumProducts > 0 && (
          <Alert className="mb-1">
            <Wallet />

            <AlertTitle>
              La suma de total de los productos insertados es{" "}
              {PriceTextBuilder.build(form.sumProducts)}
            </AlertTitle>
          </Alert>
        )}

        <Table
          loading={false}
          data={form.orderProducts.value}
          columns={[
            {
              name: "Producto",
              cell: ({ index, row }) => (
                <SearchSelect
                  criteria={(id, search) => handleSearch(row, id, search)}
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
                  value={{
                    onChange: (v) =>
                      form.orderProducts.onChangeCount(o.product.id, v),
                    value: o.count,
                  }}
                />
              ),
            },
            {
              name: "Precio",
              cell: ({ row }) => (
                <InputNumber
                  min={1}
                  value={{
                    onChange: (v) =>
                      form.orderProducts.onChangePrice(row.product.id, v),
                    value: row.price,
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
        {form.sumPayments > 0 && (
          <Alert className="mb-1">
            <Wallet />

            <AlertTitle>
              La suma de total de los pagos insertados es{" "}
              {PriceTextBuilder.build(form.sumPayments)}
            </AlertTitle>
          </Alert>
        )}

        <Table
          loading={false}
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
