import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import type { ColumnDefinition } from "@/ui/components/Table/Table";

export interface PaginationFetchParams {
  from: number;
  to: number;
  page: number;
  pageSize: number;
  search: string;
}

export interface PaginationFetchResult<T> {
  data: T[];
  count: number;
}

interface Options<T> {
  /**
   * Trae una página de datos. Recibe el rango (`from`/`to`) listo para usar en
   * `.range()` de Supabase y debe devolver los datos de la página junto con el
   * total de registros que cumplen el filtro.
   */
  fetchPage: (params: PaginationFetchParams) => Promise<PaginationFetchResult<T>>;
  pageSize?: number;
  /**
   * Dependencias externas que, al cambiar, vuelven a la primera página y
   * recargan (por ejemplo filtros de mes/año).
   */
  deps?: unknown[];
  searchDebounce?: number;
}

export interface UsePagination<T> {
  data: T[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  search: string;
  setSearch: (v: string) => void;
  setPage: (p: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canPrev: boolean;
  canNext: boolean;
  refetch: () => void;
  /**
   * Genera y descarga un `.xlsx` con TODO el conjunto que cumple el filtro
   * actual (no solo la página en pantalla), usando el método `excel` de cada
   * columna. Las columnas sin `excel` se omiten.
   */
  handleExportExcel: (
    columns: ColumnDefinition<T>[],
    filename?: string,
  ) => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 10;

export default function usePagination<T>({
  fetchPage,
  pageSize = DEFAULT_PAGE_SIZE,
  deps = [],
  searchDebounce = 350,
}: Options<T>): UsePagination<T> {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Se guarda en un ref para no obligar al consumidor a memorizar `fetchPage`.
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  // Detecta cambios en búsqueda/deps para resetear a la primera página sin
  // disparar una carga extra de la página anterior.
  const triggerRef = useRef<string | null>(null);

  // Debounce de la búsqueda para no consultar en cada tecla.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), searchDebounce);

    return () => clearTimeout(handle);
  }, [search, searchDebounce]);

  // Carga la página actual. Se vuelve a ejecutar cuando cambian la página, la
  // búsqueda (debounced) o las dependencias externas.
  useEffect(() => {
    const key = JSON.stringify([debouncedSearch, deps]);

    if (triggerRef.current !== key) {
      triggerRef.current = key;

      if (page !== 1) {
        setPage(1);
        return;
      }
    }

    let cancelled = false;

    setLoading(true);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    fetchRef
      .current({ from, to, page, pageSize, search: debouncedSearch })
      .then((res) => {
        if (cancelled) return;

        setData(res.data);
        setTotal(res.count);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, debouncedSearch, ...deps]);

  const refetch = () => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    setLoading(true);

    fetchRef
      .current({ from, to, page, pageSize, search: debouncedSearch })
      .then((res) => {
        setData(res.data);
        setTotal(res.count);
        setLoading(false);
      });
  };

  const handleExportExcel = async (
    columns: ColumnDefinition<T>[],
    filename = "export",
  ) => {
    const exportable = columns.filter((c) => c.excel);

    if (exportable.length === 0) return;

    // Trae todo el conjunto que cumple el filtro actual. Primero una consulta
    // ligera para conocer el total y luego el rango completo.
    const first = await fetchRef.current({
      from: 0,
      to: pageSize - 1,
      page: 1,
      pageSize,
      search: debouncedSearch,
    });

    const rows =
      first.count <= first.data.length
        ? first.data
        : (
            await fetchRef.current({
              from: 0,
              to: first.count - 1,
              page: 1,
              pageSize: first.count,
              search: debouncedSearch,
            })
          ).data;

    const header = exportable.map((c) => c.name);
    const body = rows.map((row) => exportable.map((c) => c.excel!(row)));

    const worksheet = XLSX.utils.aoa_to_sheet([header, ...body]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return {
    data,
    loading,
    page,
    pageSize,
    total,
    totalPages,
    search,
    setSearch,
    setPage,
    nextPage: () => setPage((p) => (p < totalPages ? p + 1 : p)),
    prevPage: () => setPage((p) => (p > 1 ? p - 1 : p)),
    canPrev,
    canNext,
    refetch,
    handleExportExcel,
  };
}
