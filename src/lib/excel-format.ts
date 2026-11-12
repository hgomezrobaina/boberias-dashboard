/**
 * Formatos de celda de Excel (los mismos códigos que el cuadro "Formato de
 * celdas > Personalizada"). Se aplican con `excelFormat` en la definición de
 * una columna de `Table`: el valor se guarda como número y sigue sirviendo
 * para fórmulas, el formato solo cambia cómo se muestra.
 *
 * A propósito ninguno lleva el símbolo de moneda: la celda tiene que leerse
 * como un número pelado para poder sumarla y operarla sin dudas.
 */
export const EXCEL_FORMAT = {
  /** `12,500.00` — importes y precios. */
  PRICE: "#,##0.00",
  /** `12,500` — cantidades enteras. */
  NUMBER: "#,##0",
  /** `12/11/2026` */
  DATE: "dd/mm/yyyy",
} as const;
