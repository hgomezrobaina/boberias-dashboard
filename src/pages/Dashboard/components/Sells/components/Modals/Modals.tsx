import useModal from "@/modal/hooks/useModal";
import {
  DeleteOrderModalProps,
  InsertOrderModalProps,
} from "../../domain/modal";
import InsertOrder from "./components/InsertOrder/InsertOrder";
import DeleteOrder from "./components/DeleteOrder/DeleteOrder";

interface Props {
  refetch: () => void;
}

export default function Modals({ refetch }: Props) {
  const { open } = useModal();

  return (
    <>
      {open instanceof InsertOrderModalProps && (
        <InsertOrder refetch={refetch} />
      )}

      {open instanceof DeleteOrderModalProps && (
        <DeleteOrder order={open.order} refetch={refetch} />
      )}
    </>
  );
}
