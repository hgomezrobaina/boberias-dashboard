import useModal from "@/modal/hooks/useModal";
import { X } from "lucide-react";

interface Props {
  title: string;
}

export default function ModalHeader({ title }: Props) {
  const { handleClose } = useModal();

  return (
    <header className="flex items-start gap-x-5 mb-5 justify-between">
      <div className="flex items-center gap-x-3">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <button className="stroke-gray-800" onClick={handleClose} type="button">
        <X className="w-4 h-4" />
      </button>
    </header>
  );
}
