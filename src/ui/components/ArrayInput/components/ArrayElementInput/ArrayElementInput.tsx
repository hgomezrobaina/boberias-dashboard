import IconButton from "@/ui/components/IconButton/IconButton";
import { Trash } from "lucide-react";

interface Props {
  children?: React.ReactNode;
  onDelete?: () => void;
}

export default function ArrayElementInput({ children, onDelete }: Props) {
  return (
    <div className="flex items-center gap-x-2 w-full">
      {children}

      <IconButton onClick={onDelete} icon={<Trash className="w-5 h-5" />} />
    </div>
  );
}
