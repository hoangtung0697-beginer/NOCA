"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteOrder } from "./actions";

export function OrderDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Xoá đơn hàng này?")) return;
    startTransition(async () => {
      try {
        await deleteOrder(id);
        toast.success("Đã xoá đơn hàng");
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
