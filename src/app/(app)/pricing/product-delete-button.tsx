"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "./actions";

export function ProductDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Xoá sản phẩm này khỏi danh mục?")) return;
    startTransition(async () => {
      try {
        await deleteProduct(id);
        toast.success("Đã xoá sản phẩm");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
      }
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isPending}>
      Xoá
    </Button>
  );
}
