import Button from "../Button/Button";
import FormInput from "../FormInput/FormInput";

interface Props {
  label: string;
  onAdd?: () => void;
  children?: React.ReactNode;
}

export default function ArrayInput({ label, children, onAdd }: Props) {
  return (
    <FormInput
      label={label}
      extra={
        onAdd && (
          <Button onClick={onAdd} size="sm">
            Añadir
          </Button>
        )
      }
    >
      {children}
    </FormInput>
  );
}
