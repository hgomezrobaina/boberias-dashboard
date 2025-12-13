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
  ViewProductSellsModalProps,
} from "./domain/modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/product";
import IconButton from "@/ui/components/IconButton/IconButton";
import { Edit, Trash, Eye } from "lucide-react";

export default function Products() {
  const { handleOpenModal } = useModal();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const refetch = useCallback(() => {
    setLoading(true);

    supabase
      .from("product")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: false })
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
        } else {
          setProducts([]);
        }

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const showProducts = useMemo(() => {
    if (search) {
      return products.filter((p) => p.code.includes(search));
    }

    return products;
  }, [search, products]);

  return (
    <>
      <Modals refetch={refetch} />

      <Card
        title="Inventario de Productos"
        description="Control de stock y productos disponibles"
        extra={
          <Button
            onClick={() => handleOpenModal(new InsertProductModalProps())}
          >
            Insertar
          </Button>
        }
      >
        <Table
          search={{ onChange: setSearch, value: search }}
          loading={loading}
          data={showProducts}
          columns={[
            { cell: ({ row }) => row.code, name: "Código" },
            { cell: ({ row }) => row.name, name: "Nombre" },
            {
              name: "Precio de venta",
              cell: ({ row }) => PriceTextBuilder.build(row.sell_price),
            },
            {
              name: "Precio de costo",
              cell: ({ row }) => PriceTextBuilder.build(row.cost_price),
            },
            {
              name: "Cantidad",
              cell: ({ row }) => NumberTextBuilder.execute(row.stock),
            },
            {
              name: "",
              cell: ({ row }) => (
                <div className="flex items-center gap-x-2">
                  <IconButton
                    icon={<Eye className="w-6 h-6" />}
                    onClick={() =>
                      handleOpenModal(new ViewProductSellsModalProps(row.id))
                    }
                  />

                  <IconButton
                    icon={<Edit className="w-6 h-6" />}
                    onClick={() =>
                      handleOpenModal(new EditProductModalProps(row))
                    }
                  />

                  <IconButton
                    icon={<Trash className="w-6 h-6" />}
                    onClick={() =>
                      handleOpenModal(new DeleteProductModalProps(row.id))
                    }
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
