import {
  Table as LibTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import Input from "../Input/Input";
import ContentLoader from "../ContentLoader/ContentLoader";
import IconButton from "../IconButton/IconButton";
import Button from "../Button/Button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

interface Props<T> {
  columns: ColumnDefinition<T>[];
  data: T[];
  loading: boolean;
  search?: { value: string; onChange: (v: string) => void };
  pagination?: PaginationProps;
  /**
   * Exporta el conjunto completo (no solo la página actual) a un `.xlsx`
   * usando el método `excel` de cada columna. Cuando se provee, se renderiza
   * un botón de exportación en la barra de herramientas. `filename` es el
   * nombre del archivo sin extensión.
   */
  export?: {
    onSubmit: (
      columns: ColumnDefinition<T>[],
      filename: string,
    ) => void | Promise<void>;
    filename: string;
  };
}

export interface ColumnDefinition<T> {
  cell: (props: { row: T; index: number }) => React.ReactNode;
  name: string;
  render?: boolean;
  className?: string;
  /**
   * Cómo se exporta esta columna a Excel. Recibe la fila y devuelve el texto
   * de la celda. Las columnas sin `excel` se omiten de la exportación.
   */
  excel?: (row: T) => string;
}

export default function Table<T>({
  columns,
  data,
  search,
  loading,
  pagination,
  export: exportOptions,
}: Props<T>) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!exportOptions) return;

    setExporting(true);

    try {
      await exportOptions.onSubmit(columns, exportOptions.filename);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-max">
      {(search || exportOptions) && (
        <div className="flex w-full mb-3 gap-x-5 justify-between">
          <div className="w-full max-w-[260px]">
            {search && (
              <Input
                value={{ onChange: search.onChange, value: search.value }}
                placeholder="Buscar..."
              />
            )}
          </div>

          <div className="flex items-center">
            {exportOptions && (
              <Button
                variant="outline"
                onClick={handleExport}
                loading={exporting}
                disabled={loading}
              >
                <Download className="w-5 h-5" />
                {exporting ? "Exportando..." : "Exportar Excel"}
              </Button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col w-full gap-y-1.5">
          {Array.from({ length: 8 }).map((_, index) => (
            <ContentLoader height={25} key={index} />
          ))}
        </div>
      )}

      {!loading && (
        <LibTable className="">
          <TableHeader>
            <TableRow>
              {columns.map((c, index) => (
                <TableHead key={index}>{c.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns
                  .filter((c) => c.render === undefined || c.render === true)
                  .map((c, j) => (
                    <TableCell key={j} className={c.className}>
                      {c.cell({ index: index, row: item })}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </LibTable>
      )}

      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">
            Página {pagination.page} de {pagination.totalPages} ·{" "}
            {pagination.total} registros
          </span>

          <div className="flex items-center gap-x-2">
            <IconButton
              icon={<ChevronLeft className="w-6 h-6" />}
              onClick={() => pagination.canPrev && pagination.onPrev()}
            />
            <IconButton
              icon={<ChevronRight className="w-6 h-6" />}
              onClick={() => pagination.canNext && pagination.onNext()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
