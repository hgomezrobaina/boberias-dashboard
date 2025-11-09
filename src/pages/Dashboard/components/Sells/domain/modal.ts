import type { Order } from "@/lib/order";
import { ModalProps } from "@/modal/domain/base";

export class InsertOrderModalProps extends ModalProps {}

export class EditOrderModalProps extends ModalProps {
  constructor(readonly order: Order) {
    super();
  }
}

export class DeleteOrderModalProps extends ModalProps {
  constructor(readonly order: Order) {
    super();
  }
}
