/**
 * Formatos de celda de Excel (los mismos códigos que el cuadro "Formato de
 * celdas > Personalizada"). Se aplican con `excelFormat` en la definición de
 * una columna de `Table`: el valor se guarda como número y sigue sirviendo
 * para fórmulas, el formato solo cambia cómo se muestra.
 */
export const EXCEL_FORMAT = {
  /** `$12,500.00` */
  CURRENCY: '"$"#,##0.00',
  /** `12,500` — para cantidades enteras. */
  NUMBER: "#,##0",
  /** `12,500.50` */
  DECIMAL: "#,##0.00",
  /** `12/11/2026` */
  DATE: "dd/mm/yyyy",
} as const;
