import clsx from "clsx";
import useModal from "../../hooks/useModal";

interface Props {
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

export default function Modal({ children, id, className }: Props) {
  const { handleClose } = useModal();

  const CLASS = clsx(
    "flex items-center",
    "w-full h-dvh",
    "fixed top-0 left-0",
    "z-50",
    "bg-black/50",
    "px-4 py-5",
    "justify-center",
    className
  );

  return (
    <div id={id} className={CLASS} onClick={handleClose}>
      {children}
    </div>
  );
}
