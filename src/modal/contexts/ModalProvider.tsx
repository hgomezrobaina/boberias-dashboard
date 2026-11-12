import { useState } from "react";
import { ModalProps } from "../domain/base";
import { ModalContext } from "./modal-context";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<ModalProps | null>(null);

  return (
    <ModalContext.Provider value={{ open: open, handleOpenModal: setOpen }}>
      {children}
    </ModalContext.Provider>
  );
}
