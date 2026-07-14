import { NumberTextBuilder } from "@/lib/number-text-builder";
import { PriceTextBuilder } from "@/lib/price-text-builder";
import Button from "@/ui/components/Button/Button";
import Card from "@/ui/components/Card/Card";
import Table from "@/ui/components/Table/Table";
import Modals from "./components/Modals/Modals";
import useModal from "@/modal/hooks/useModal";
import {
  DeleteProductModalProps,
  EditProductModalProps,
  InsertProductModalProps,
  InsertProductStockModalProps,
  ViewProductSellsModalProps,
} from "./domain/modal";
import { useContext } from "react";
import type { ProductListable } from "@/lib/product-listable";
import { ProductListService } from "@/lib/product-list-service";
import usePagination from "@/ui/hooks/usePagination";
import IconButton from "@/ui/components/IconButton/IconButton";
import { Edit, Trash, Eye, Plus } from "lucide-react";
import { UserContext } from "@/user/context/user-context";
import { USER_ROLE } from "@/lib/user-role";

export default function Products() {
  const { role } = useContext(UserContext);
  const { handleOpenModal } = useModal();

  const {
    data: products,
    loading,
    search,
    setSearch,
    refetch,
    page,
    totalPages,
    total,
    canPrev,
    canNext,
    nextPage,
    prevPage,
    handleExportExcel,
  } = usePagination<ProductListable>({
    fetchPage: ({ from, to, search }) => {
      return ProductListService.getPage({ from, to, search });
    },
  });

  return (
    <>
      <Modals refetch={refetch} />

      <Card
        title="Inventario de Productos"
        description="Control de stock y productos disponibles"
        extra={
          role === USER_ROLE.ADMIN && (
            <Button
              onClick={() => handleOpenModal(new InsertProductModalProps())}
            >
              Insertar
            </Button>
          )
        }
      >
        <Table
          search={{ onChange: setSearch, value: search }}
          loading={loading}
          data={products}
          export={{ onSubmit: handleExportExcel, filename: "productos" }}
          pagination={{
            page,
            totalPages,
            total,
            canPrev,
            canNext,
            onPrev: prevPage,
            onNext: nextPage,
          }}
          columns={[
            {
              cell: ({ row }) => row.code,
              name: "Código",
              excel: (row) => row.code,
            },
            {
              cell: ({ row }) => row.name,
              name: "Nombre",
              excel: (row) => row.name,
            },
            {
              name: "Precio de venta",
              cell: ({ row }) => PriceTextBuilder.build(row.sell_price),
              excel: (row) => PriceTextBuilder.build(row.sell_price),
            },
            {
              name: "Precio de costo",
              cell: ({ row }) => PriceTextBuilder.build(row.cost_price),
              excel: (row) => PriceTextBuilder.build(row.cost_price),
            },
            {
              name: "Cantidad",
              cell: ({ row }) => NumberTextBuilder.execute(row.stock),
              excel: (row) => NumberTextBuilder.execute(row.stock),
            },
            {
              name: "",
              cell: ({ row }) => (
                <div className="flex items-center gap-x-2">
                  {role === USER_ROLE.ADMIN && (
                    <IconButton
                      icon={<Plus className="w-6 h-6" />}
                      onClick={() =>
                        handleOpenModal(new InsertProductStockModalProps(row))
                      }
                    />
                  )}

                  <IconButton
                    icon={<Eye className="w-6 h-6" />}
                    onClick={() =>
                      handleOpenModal(new ViewProductSellsModalProps(row.id))
                    }
                  />

                  {role === USER_ROLE.ADMIN && (
                    <IconButton
                      icon={<Edit className="w-6 h-6" />}
                      onClick={() =>
                        handleOpenModal(new EditProductModalProps(row))
                      }
                    />
                  )}

                  {role === USER_ROLE.ADMIN && (
                    <IconButton
                      icon={<Trash className="w-6 h-6" />}
                      onClick={() =>
                        handleOpenModal(new DeleteProductModalProps(row.id))
                      }
                    />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
