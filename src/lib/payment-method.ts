export enum PAYMENT_METHOD {
  CASH = "cash",
  TRANSFER = "transfer",
  ONLINE = "online",
}

export const paymentMethods = [
  { type: PAYMENT_METHOD.CASH },
  { type: PAYMENT_METHOD.TRANSFER },
  { type: PAYMENT_METHOD.ONLINE },
];

export class PaymentMethodTextBuilder {
  static execute(v: PAYMENT_METHOD) {
    if (v === PAYMENT_METHOD.CASH) {
      return "Efectivo";
    }

    if (v === PAYMENT_METHOD.TRANSFER) {
      return "Transferencia";
    }

    if (v === PAYMENT_METHOD.ONLINE) {
      return "Pago en línea";
    }

    return "";
  }
}
