import { Button as LibButton } from "@/components/ui/button";
import clsx from "clsx";

interface Props {
  onClick?: () => void;
  children?: React.ReactNode;
  loading?: boolean;
  type?: "submit" | "button";
  disabled?: boolean;
  variant?: "default" | "outline";
  full?: boolean;
  size?: "sm" | "default" | "lg";
}

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "default",
  loading = false,
  full = false,
  size = "sm",
}: Props) {
  return (
    <LibButton
      className={clsx(full && "w-full")}
      size={size}
      variant={variant}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {children}
    </LibButton>
  );
}
