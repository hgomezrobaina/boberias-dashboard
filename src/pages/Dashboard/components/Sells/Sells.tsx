import Card from "@/ui/components/Card/Card";
import Modals from "./components/Modals/Modals";
import Button from "@/ui/components/Button/Button";
import useModal from "@/modal/hooks/useModal";
import { InsertOrderModalProps } from "./domain/modal";
import { useCallback, useEffect, useState } from "react";
import { type Order } from "@/lib/order";
import {
  OrderListService,
  type AccumulateOrder,
} from "@/lib/order-list-service";
import SellsTable from "./components/SellsTable/SellsTable";
import usePagination from "@/ui/hooks/usePagination";

interface Props {
  month: number;
  year: number;
}

export default function Sells({ month, year }: Props) {
  const { handleOpenModal } = useModal();

  const [accumulateSource, setAccumulateSource] = useState<AccumulateOrder[]>(
    [],
  );

  const {
    data: orders,
    loading,
    refetch,
    page,
    totalPages,
    total,
    canPrev,
    canNext,
    nextPage,
    prevPage,
    handleExportExcel,
  } = usePagination<Order>({
    fetchPage: ({ from, to }) =>
      OrderListService.getPage({ from, to, year, month }),
    deps: [year, month],
  });

  const loadAccumulate = useCallback(() => {
    OrderListService.getAccumulateSource({ year, month }).then(
      setAccumulateSource,
    );
  }, [year, month]);

  useEffect(() => {
    loadAccumulate();
  }, [loadAccumulate]);

  const handleRefetch = useCallback(() => {
    refetch();
    loadAccumulate();
  }, [refetch, loadAccumulate]);

  return (
    <>
      <Modals refetch={handleRefetch} />

      <Card
        title="Ventas"
        description="Historial detallado de transacciones"
        extra={
          <>
            <Button
              onClick={() => handleOpenModal(new InsertOrderModalProps())}
            >
              Insertar
            </Button>
          </>
        }
      >
        <SellsTable
          actions
          loading={loading}
          orders={orders}
          accumulateSource={accumulateSource}
          exportExcel={handleExportExcel}
          pagination={{
            page,
            totalPages,
            total,
            canPrev,
            canNext,
            onPrev: prevPage,
            onNext: nextPage,
          }}
        />
      </Card>
    </>
  );
}
