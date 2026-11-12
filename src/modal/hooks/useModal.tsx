import { useContext } from "react";
import { ModalContext } from "../contexts/modal-context";

export default function useModal() {
  const { handleOpenModal, open } = useContext(ModalContext);

  function handleClose() {
    handleOpenModal(null);
  }

  return { open, handleOpenModal, handleClose };
}
