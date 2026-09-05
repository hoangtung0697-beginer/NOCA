"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSalesperson, updateSalesperson } from "./actions";

interface SalespersonDialogProps {
  mode: "create" | "edit";
  salesperson?: {
    id: string;
    name: string;
  };
  trigger: React.ReactElement;
}

export function SalespersonDialog({ mode, salesperson, trigger }: SalespersonDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createSalesperson(formData);
          toast.success("Đã thêm người bán hàng");
        } else if (salesperson) {
          await updateSalesperson(salesperson.id, formData);
          toast.success("Đã cập nhật người bán hàng");
        }
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Có lỗi xảy ra");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm người bán hàng" : "Sửa người bán hàng"}</DialogTitle>
          <DialogDescription>
            Chọn người bán hàng khi tạo đơn để theo dõi hoa hồng theo từng người.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salespersonName">Tên người bán hàng</Label>
            <Input
              id="salespersonName"
              name="name"
              required
              defaultValue={salesperson?.name}
              placeholder="VD: Sang"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
