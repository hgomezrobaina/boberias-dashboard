export enum ORDER_TYPE {
  SELL = "sell",
  TRANSFER = "transfer",
  LOST = "lost",
}

export class OrderTypeTextBuiler {
  static execute(v: ORDER_TYPE) {
    if (v === ORDER_TYPE.LOST) {
      return "Merma";
    }

    if (v === ORDER_TYPE.SELL) {
      return "Venta";
    }

    if (v === ORDER_TYPE.TRANSFER) {
      return "Traslado";
    }

    return "";
  }
}

export const orderTypes = [
  { type: ORDER_TYPE.LOST },
  { type: ORDER_TYPE.SELL },
  { type: ORDER_TYPE.TRANSFER },
];
