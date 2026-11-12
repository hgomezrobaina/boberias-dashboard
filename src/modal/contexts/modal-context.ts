import { createContext } from "react";
import { ModalProps } from "../domain/base";

export interface ModalContextProps {
  open: ModalProps | null;
  handleOpenModal(props: ModalProps | null): void;
}

export const ModalContext = createContext<ModalContextProps>({
  open: null,
} as ModalContextProps);
