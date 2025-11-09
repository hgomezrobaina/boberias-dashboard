import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

interface Props {
  label: string;
  children?: React.ReactNode;
  extra?: React.ReactNode;
}

export default function FormInput({ label, children, extra }: Props) {
  return (
    <div className="mb-5">
      <Field className="mb-3" orientation={"horizontal"}>
        <FieldContent>
          <FieldLabel className="font-medium!">{label}</FieldLabel>
        </FieldContent>

        {extra}
      </Field>

      {children}
    </div>
  );
}
