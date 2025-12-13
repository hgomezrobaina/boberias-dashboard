import type { Product } from "@/lib/product";
import { ModalProps } from "@/modal/domain/base";

export class InsertProductModalProps extends ModalProps {}

export class ViewProductSellsModalProps extends ModalProps {
  constructor(readonly id: number) {
    super();
  }
}

export class EditProductModalProps extends ModalProps {
  constructor(readonly product: Product) {
    super();
  }
}

export class DeleteProductModalProps extends ModalProps {
  constructor(readonly id: number) {
    super();
  }
}
