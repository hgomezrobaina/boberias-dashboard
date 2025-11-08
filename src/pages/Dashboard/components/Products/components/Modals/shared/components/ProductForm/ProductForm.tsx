import DatePicker from "@/ui/components/DatePicker/DatePicker";
import FormInput from "@/ui/components/FormInput/FormInput";
import Input from "@/ui/components/Input/Input";
import InputNumber from "@/ui/components/InputNumber/InputNumber";

interface Props {
  code: { value: string; onChange: (v: string) => void };
  name: { value: string; onChange: (v: string) => void };
  stock: { value: number; onChange: (v: number) => void };
  costPrice: { value: number; onChange: (v: number) => void };
  sellPrice: { value: number; onChange: (v: number) => void };
  arriveDate: { value: Date; onChange: (v: Date) => void };
  expirationDate: { value: Date | null; onChange: (v: Date) => void };
}

export default function ProductForm({
  arriveDate,
  code,
  costPrice,
  expirationDate,
  name,
  sellPrice,
  stock,
}: Props) {
  return (
    <>
      <FormInput label="Código">
        <Input value={{ value: code.value, onChange: code.onChange }} />
      </FormInput>

      <FormInput label="Nombre">
        <Input value={{ onChange: name.onChange, value: name.value }} />
      </FormInput>

      <FormInput label="Cantidad">
        <InputNumber
          min={1}
          value={{ value: stock.value, onChange: stock.onChange }}
        />
      </FormInput>

      <FormInput label="Precio de costo">
        <InputNumber
          value={{ value: costPrice.value, onChange: costPrice.onChange }}
        />
      </FormInput>

      <FormInput label="Precio de venta">
        <InputNumber
          value={{ onChange: sellPrice.onChange, value: sellPrice.value }}
        />
      </FormInput>

      <FormInput label="Fecha de arribo">
        <DatePicker
          value={{ onChange: arriveDate.onChange, value: arriveDate.value }}
        />
      </FormInput>

      <FormInput label="Fecha de expiración">
        <DatePicker
          value={{
            onChange: expirationDate.onChange,
            value: expirationDate.value,
          }}
        />
      </FormInput>
    </>
  );
}
