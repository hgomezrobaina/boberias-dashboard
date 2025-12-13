import useModal from "@/modal/hooks/useModal";
import {
  DeleteProductModalProps,
  EditProductModalProps,
  InsertProductModalProps,
  ViewProductSellsModalProps,
} from "../../domain/modal";
import InsertProduct from "./components/InsertProduct/InsertProduct";
import DeleteProduct from "./components/DeleteProduct/DeleteProduct";
import EditProduct from "./components/EditProduct/EditProduct";
import ViewProductSells from "./components/ViewProductSells/ViewProductSells";

interface Props {
  refetch: () => void;
}

export default function Modals({ refetch }: Props) {
  const { open } = useModal();

  return (
    <>
      {open instanceof InsertProductModalProps && (
        <InsertProduct refetch={refetch} />
      )}

      {open instanceof DeleteProductModalProps && (
        <DeleteProduct id={open.id} refetch={refetch} />
      )}

      {open instanceof EditProductModalProps && (
        <EditProduct product={open.product} refetch={refetch} />
      )}

      {open instanceof ViewProductSellsModalProps && (
        <ViewProductSells id={open.id} />
      )}
    </>
  );
}
