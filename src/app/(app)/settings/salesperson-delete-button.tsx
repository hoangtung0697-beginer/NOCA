"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteSalesperson } from "./actions";

export function SalespersonDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Xoá người bán hàng này?")) return;
    startTransition(async () => {
      try {
        await deleteSalesperson(id);
        toast.success("Đã xoá người bán hàng");
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
