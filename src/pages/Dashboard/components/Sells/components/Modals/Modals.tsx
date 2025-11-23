import useModal from "@/modal/hooks/useModal";
import {
  DeleteOrderModalProps,
  EditOrderModalProps,
  InsertOrderModalProps,
} from "../../domain/modal";
import InsertOrder from "./components/InsertOrder/InsertOrder";
import DeleteOrder from "./components/DeleteOrder/DeleteOrder";
import EditOrder from "./components/EditOrder/EditOrder";

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

      {open instanceof EditOrderModalProps && (
        <EditOrder order={open.order} refetch={refetch} />
      )}
    </>
  );
}
