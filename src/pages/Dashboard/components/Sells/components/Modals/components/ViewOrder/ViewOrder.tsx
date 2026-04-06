import type { Order, OrderProduct } from "@/lib/order";
import { DateTextBuilder } from "@/lib/date-text-builder";
import { OrderTypeTextBuiler } from "@/lib/order-type";
import {
  PaymentMethodTextBuilder,
  PAYMENT_METHOD,
} from "@/lib/payment-method";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import Modal from "@/modal/components/Modal/Modal";
import ModalHeader from "@/modal/components/ModalHeader/ModalHeader";
import useModal from "@/modal/hooks/useModal";
import Button from "@/ui/components/Button/Button";
import Table from "@/ui/components/Table/Table";

interface PaymentRow {
  method: PAYMENT_METHOD;
  amount: number;
}

interface Props {
  order: Order;
}

export default function ViewOrder({ order }: Props) {
  const { handleClose } = useModal();

  const paymentsByMethod = [
    PAYMENT_METHOD.CASH,
    PAYMENT_METHOD.TRANSFER,
    PAYMENT_METHOD.ONLINE,
  ]
    .map((method) => ({
      method,
      amount: order.order_payment_method
        .filter((p) => p.method === method)
        .reduce((a, b) => a + b.amount, 0),
    }))
    .filter((p) => p.amount > 0);

  return (
    <Modal>
      <div
        className="flex flex-col w-full max-h-full bg-white px-6 py-5 shadow-lg overflow-auto animate-duration-500 h-max rounded-lg"
        style={{ maxWidth: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader title="Detalle de venta" />

        <div className="flex flex-col gap-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fecha de venta</p>
              <p className="text-base font-medium">
                {DateTextBuilder.build(new Date(order.sell_date))}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Tipo</p>
              <p className="text-base font-medium">
                {OrderTypeTextBuiler.execute(order.type)}
              </p>
            </div>
          </div>

          {order.description && (
            <div>
              <p className="text-sm text-gray-500">Descripcion</p>
              <p className="text-base font-medium">{order.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-2">Productos</p>
            <Table<OrderProduct>
              loading={false}
              data={order.order_product}
              columns={[
                {
                  name: "Producto",
                  cell: ({ row }) => row.product.name,
                },
                {
                  name: "Cantidad",
                  cell: ({ row }) => row.count,
                },
                {
                  name: "Precio",
                  cell: ({ row }) => PriceTextBuilder.build(row.price),
                },
                {
                  name: "Subtotal",
                  cell: ({ row }) =>
                    PriceTextBuilder.build(row.price * row.count),
                },
              ]}
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Metodos de pago</p>
            <Table<PaymentRow>
              loading={false}
              data={paymentsByMethod}
              columns={[
                {
                  name: "Metodo",
                  cell: ({ row }) =>
                    PaymentMethodTextBuilder.execute(row.method),
                },
                {
                  name: "Monto",
                  cell: ({ row }) => PriceTextBuilder.build(row.amount),
                },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <Button onClick={handleClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
