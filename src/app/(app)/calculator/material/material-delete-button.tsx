"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteMaterial } from "./actions";

export function MaterialDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Xoá loại nhựa này?")) return;
    startTransition(async () => {
      try {
        await deleteMaterial(id);
        toast.success("Đã xoá loại nhựa");
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
